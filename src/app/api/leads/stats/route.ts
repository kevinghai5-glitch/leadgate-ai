import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/require-pro";

function pctChange(current: number, prior: number): number {
  if (prior === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}

function sumBudget(leads: { budget: string }[]): number {
  let total = 0;
  for (const l of leads) {
    const match = l.budget.match(/[\d,]+/);
    if (match) total += parseInt(match[0].replace(/,/g, ""), 10);
  }
  return total;
}

export async function GET() {
  try {
    const guard = await requirePro();
    if ("response" in guard) return guard.response;

    const userId = guard.userId;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [
      totalLeads,
      qualifiedLeads,
      disqualifiedLeads,
      qualifiedBudgets,
      scoreAgg,
      windowLeads,
      profile,
    ] = await Promise.all([
      prisma.lead.count({ where: { userId } }),
      prisma.lead.count({ where: { userId, status: "QUALIFIED" } }),
      prisma.lead.count({ where: { userId, status: "DISQUALIFIED" } }),
      prisma.lead.findMany({
        where: { userId, status: "QUALIFIED" },
        select: { budget: true },
      }),
      prisma.lead.aggregate({
        where: { userId, aiScore: { not: null } },
        _avg: { aiScore: true },
      }),
      prisma.lead.findMany({
        where: { userId, createdAt: { gte: fourteenDaysAgo } },
        select: { createdAt: true, status: true, aiScore: true, budget: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { offerPrice: true, closeRate: true, avgCallMinutes: true },
      }),
    ]);

    const qualificationRate =
      totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

    // Revenue model: prefer the coach's configured offer price × close rate.
    // Fall back to summing budgets parsed from lead answers if offer price isn't set.
    const offerPrice = profile?.offerPrice ?? null;
    const closeRate = profile?.closeRate ?? 25;
    const avgCallMinutes = profile?.avgCallMinutes ?? 30;

    const revenueFromOffer = (qualified: number) =>
      offerPrice ? Math.round(qualified * offerPrice * (closeRate / 100)) : null;

    const projectedRevenue =
      revenueFromOffer(qualifiedLeads) ?? sumBudget(qualifiedBudgets);
    const revenueSource: "offer" | "budgets" = offerPrice ? "offer" : "budgets";

    const averageScore = scoreAgg._avg.aiScore
      ? Math.round(scoreAgg._avg.aiScore * 10) / 10
      : 0;

    // Split last 14 days into two 7-day buckets
    const current = windowLeads.filter((l) => l.createdAt >= sevenDaysAgo);
    const prior = windowLeads.filter((l) => l.createdAt < sevenDaysAgo);

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

    const currentScores = current.filter((l) => l.aiScore != null);
    const priorScores = prior.filter((l) => l.aiScore != null);
    const avg = (arr: { aiScore: number | null }[]) =>
      arr.length
        ? arr.reduce((s, l) => s + (l.aiScore || 0), 0) / arr.length
        : 0;
    const currentAvg = Math.round(avg(currentScores) * 10) / 10;
    const priorAvg = Math.round(avg(priorScores) * 10) / 10;

    const currentRevenue =
      revenueFromOffer(currentQualified.length) ?? sumBudget(currentQualified);
    const priorRevenue =
      revenueFromOffer(priorQualified.length) ?? sumBudget(priorQualified);

    // Build 7-day daily series (oldest → newest) for sparklines
    const dailySeries: Record<string, number[]> = {
      total: new Array(7).fill(0),
      qualified: new Array(7).fill(0),
      disqualified: new Array(7).fill(0),
      rate: new Array(7).fill(0),
      score: new Array(7).fill(0),
    };
    const dayBuckets: {
      total: number;
      qualified: number;
      disqualified: number;
      scoreSum: number;
      scoreCount: number;
    }[] = Array.from({ length: 7 }, () => ({
      total: 0,
      qualified: 0,
      disqualified: 0,
      scoreSum: 0,
      scoreCount: 0,
    }));

    for (const l of current) {
      const dayIdx = Math.min(
        6,
        Math.floor((l.createdAt.getTime() - sevenDaysAgo.getTime()) / (24 * 60 * 60 * 1000))
      );
      if (dayIdx < 0) continue;
      dayBuckets[dayIdx].total += 1;
      if (l.status === "QUALIFIED") dayBuckets[dayIdx].qualified += 1;
      if (l.status === "DISQUALIFIED") dayBuckets[dayIdx].disqualified += 1;
      if (l.aiScore != null) {
        dayBuckets[dayIdx].scoreSum += l.aiScore;
        dayBuckets[dayIdx].scoreCount += 1;
      }
    }
    dayBuckets.forEach((b, i) => {
      dailySeries.total[i] = b.total;
      dailySeries.qualified[i] = b.qualified;
      dailySeries.disqualified[i] = b.disqualified;
      dailySeries.rate[i] = b.total > 0 ? Math.round((b.qualified / b.total) * 100) : 0;
      dailySeries.score[i] = b.scoreCount > 0 ? Math.round((b.scoreSum / b.scoreCount) * 10) / 10 : 0;
    });

    return NextResponse.json({
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
      series: dailySeries,
    });
  } catch (error) {
    console.error("Get lead stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
