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
        slackWebhookUrl: true,
        stripeSubscriptionStatus: true,
        rules: true,
      },
    });

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

    const body = await req.json();
    const { calendarLink, slackWebhookUrl, scoringRules } = body;

    // Update user settings
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(calendarLink !== undefined && { calendarLink }),
        ...(slackWebhookUrl !== undefined && { slackWebhookUrl }),
      },
    });

    // Update scoring rules if provided
    if (scoringRules) {
      await prisma.scoringRules.upsert({
        where: { userId: session.user.id },
        update: {
          budgetWeight: scoringRules.budgetWeight,
          timelineWeight: scoringRules.timelineWeight,
          urgencyWeight: scoringRules.urgencyWeight,
          qualityWeight: scoringRules.qualityWeight,
          minScore: scoringRules.minScore,
        },
        create: {
          userId: session.user.id,
          budgetWeight: scoringRules.budgetWeight,
          timelineWeight: scoringRules.timelineWeight,
          urgencyWeight: scoringRules.urgencyWeight,
          qualityWeight: scoringRules.qualityWeight,
          minScore: scoringRules.minScore,
        },
      });
    }

    return NextResponse.json({ message: "Settings updated" });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
