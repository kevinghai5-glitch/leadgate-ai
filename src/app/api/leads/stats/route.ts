import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/require-pro";

function pctChange(current: number, prior: number): number {
  if (prior === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}

const ALLOWED_DAYS = [7, 30, 90, 365];
const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  try {
    const guard = await requirePro();
    if ("response" in guard) return guard.response;

    const userId = guard.userId;

    // Period selector: ?days=7|30|90|365 (drives the chart + trend deltas).
    const daysParam = Number(new URL(req.url).searchParams.get("days"));
    const days = ALLOWED_DAYS.includes(daysParam) ? daysParam : 7;

    const now = new Date();
    const windowStart = new Date(now.getTime() - days * DAY_MS);
    const priorStart = new Date(now.getTime() - 2 * days * DAY_MS);

    const [
      totalLeads,
      qualifiedLeads,
      disqualifiedLeads,
      scoreAgg,
      windowLeads,
      profile,
    ] = await Promise.all([
      prisma.lead.count({ where: { userId } }),
      prisma.lead.count({ where: { userId, status: "QUALIFIED" } }),
      prisma.lead.count({ where: { userId, status: "DISQUALIFIED" } }),
      prisma.lead.aggregate({
        where: { userId, aiScore: { not: null } },
        _avg: { aiScore: true },
      }),
      prisma.lead.findMany({
        where: { userId, createdAt: { gte: priorStart } },
        select: { createdAt: true, status: true, aiScore: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { offerPrice: true, closeRate: true, avgCallMinutes: true },
      }),
    ]);

    const qualificationRate =
      totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

    // Revenue = configured offer price × close rate. If no offer price is set,
    // return null so the UI shows a "set your offer price" state instead of a
    // misleading $0 (the app no longer collects per-lead budgets).
    const offerPrice = profile?.offerPrice ?? null;
    const closeRate = profile?.closeRate ?? 25;
    const avgCallMinutes = profile?.avgCallMinutes ?? 30;

    const revenueFromOffer = (qualified: number) =>
      offerPrice ? Math.round(qualified * offerPrice * (closeRate / 100)) : null;

    const projectedRevenue = revenueFromOffer(qualifiedLeads);
    const revenueSource: "offer" | "unset" = offerPrice ? "offer" : "unset";

    const averageScore = scoreAgg._avg.aiScore
      ? Math.round(scoreAgg._avg.aiScore * 10) / 10
      : 0;

    // Split the fetched leads into the current window and the prior window.
    const current = windowLeads.filter((l) => l.createdAt >= windowStart);
    const prior = windowLeads.filter((l) => l.createdAt < windowStart);

    const currentQualified = current.filter((l) => l.status === "QUALIFIED");
    const priorQualified = prior.filter((l) => l.status === "QUALIFIED");
    const currentDisqualified = current.filter((l) => l.status === "DISQUALIFIED");
    const priorDisqualified = prior.filter((l) => l.status === "DISQUALIFIED");

    const currentRate =
      current.length > 0
        ? Math.round((currentQualified.length / current.length) * 100)
        : 0;
    const priorRate =
      prior.length > 0
        ? Math.round((priorQualified.length / prior.length) * 100)
        : 0;

    const avg = (arr: { aiScore: number | null }[]) =>
      arr.length
        ? arr.reduce((s, l) => s + (l.aiScore || 0), 0) / arr.length
        : 0;
    const currentAvg = Math.round(avg(current.filter((l) => l.aiScore != null)) * 10) / 10;
    const priorAvg = Math.round(avg(prior.filter((l) => l.aiScore != null)) * 10) / 10;

    const currentRevenue = revenueFromOffer(currentQualified.length) ?? 0;
    const priorRevenue = revenueFromOffer(priorQualified.length) ?? 0;

    // Build a `days`-length daily series (oldest → newest).
    const series: Record<string, number[]> = {
      total: new Array(days).fill(0),
      qualified: new Array(days).fill(0),
      disqualified: new Array(days).fill(0),
      rate: new Array(days).fill(0),
      score: new Array(days).fill(0),
    };
    const buckets = Array.from({ length: days }, () => ({
      total: 0,
      qualified: 0,
      disqualified: 0,
      scoreSum: 0,
      scoreCount: 0,
    }));

    for (const l of current) {
      const idx = Math.min(
        days - 1,
        Math.max(0, Math.floor((l.createdAt.getTime() - windowStart.getTime()) / DAY_MS))
      );
      buckets[idx].total += 1;
      if (l.status === "QUALIFIED") buckets[idx].qualified += 1;
      if (l.status === "DISQUALIFIED") buckets[idx].disqualified += 1;
      if (l.aiScore != null) {
        buckets[idx].scoreSum += l.aiScore;
        buckets[idx].scoreCount += 1;
      }
    }
    buckets.forEach((b, i) => {
      series.total[i] = b.total;
      series.qualified[i] = b.qualified;
      series.disqualified[i] = b.disqualified;
      series.rate[i] = b.total > 0 ? Math.round((b.qualified / b.total) * 100) : 0;
      series.score[i] = b.scoreCount > 0 ? Math.round((b.scoreSum / b.scoreCount) * 10) / 10 : 0;
    });

    return NextResponse.json({
      days,
      totalLeads,
      qualifiedLeads,
      disqualifiedLeads,
      qualificationRate,
      projectedRevenue,
      revenueSource,
      avgCallMinutes,
      offerPrice,
      closeRate,
      averageScore,
      changes: {
        totalLeads: pctChange(current.length, prior.length),
        qualifiedLeads: pctChange(currentQualified.length, priorQualified.length),
        disqualifiedLeads: pctChange(currentDisqualified.length, priorDisqualified.length),
        qualificationRate: pctChange(currentRate, priorRate),
        averageScore: pctChange(currentAvg, priorAvg),
        projectedRevenue: pctChange(currentRevenue, priorRevenue),
      },
      series,
    });
  } catch (error) {
    console.error("Get lead stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
