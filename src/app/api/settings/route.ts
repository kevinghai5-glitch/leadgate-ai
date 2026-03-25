import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        calendarLink: true,

        stripeSubscriptionStatus: true,
        rules: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { calendarLink, scoringRules } = body;

    // Update user settings
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(calendarLink !== undefined && { calendarLink }),

      },
    });

    // Update scoring rules if provided
    if (scoringRules) {
      await prisma.scoringRules.upsert({
        where: { userId },
        update: {
          budgetWeight: Number(scoringRules.budgetWeight),
          timelineWeight: Number(scoringRules.timelineWeight),
          urgencyWeight: Number(scoringRules.urgencyWeight),
          qualityWeight: Number(scoringRules.qualityWeight),
          minScore: Number(scoringRules.minScore),
        },
        create: {
          userId,
          budgetWeight: Number(scoringRules.budgetWeight),
          timelineWeight: Number(scoringRules.timelineWeight),
          urgencyWeight: Number(scoringRules.urgencyWeight),
          qualityWeight: Number(scoringRules.qualityWeight),
          minScore: Number(scoringRules.minScore),
        },
      });
    }

    return NextResponse.json({ message: "Settings updated" });
  } catch (error) {
    console.error("Update settings error:", error);
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
