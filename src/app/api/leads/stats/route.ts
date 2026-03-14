import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [totalLeads, qualifiedLeads, disqualifiedLeads, leads, scoreAgg] =
      await Promise.all([
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
      ]);

    const qualificationRate =
      totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

    // Rough revenue projection: extract numbers from budget strings
    let projectedRevenue = 0;
    leads.forEach((lead) => {
      const match = lead.budget.match(/[\d,]+/);
      if (match) {
        projectedRevenue += parseInt(match[0].replace(/,/g, ""), 10);
      }
    });

    // Get leads per day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLeads = await prisma.lead.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const averageScore = scoreAgg._avg.aiScore
      ? Math.round(scoreAgg._avg.aiScore * 10) / 10
      : 0;

    return NextResponse.json({
      totalLeads,
      qualifiedLeads,
      disqualifiedLeads,
      qualificationRate,
      projectedRevenue,
      averageScore,
      recentLeads,
    });
  } catch (error) {
    console.error("Get lead stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
