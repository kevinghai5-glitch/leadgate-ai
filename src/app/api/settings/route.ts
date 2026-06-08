import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/require-pro";

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
        businessName: true,
        niche: true,
        offerName: true,
        offerPrice: true,
        closeRate: true,
        avgCallMinutes: true,
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
    const guard = await requirePro();
    if ("response" in guard) return guard.response;

    const userId = guard.userId;
    const body = await req.json();
    const {
      calendarLink,
      scoringRules,
      businessName,
      niche,
      offerName,
      offerPrice,
      closeRate,
      avgCallMinutes,
      name,
    } = body;

    // Validate numeric ranges where applicable
    if (offerPrice !== undefined && offerPrice !== null && offerPrice < 0) {
      return NextResponse.json({ error: "Offer price must be ≥ 0" }, { status: 400 });
    }
    if (closeRate !== undefined && closeRate !== null && (closeRate < 0 || closeRate > 100)) {
      return NextResponse.json({ error: "Close rate must be 0–100" }, { status: 400 });
    }
    if (avgCallMinutes !== undefined && avgCallMinutes !== null && avgCallMinutes < 0) {
      return NextResponse.json({ error: "Call duration must be ≥ 0" }, { status: 400 });
    }

    // Update user settings (only fields explicitly included in the body)
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(calendarLink !== undefined && { calendarLink }),
        ...(name !== undefined && { name }),
        ...(businessName !== undefined && { businessName }),
        ...(niche !== undefined && { niche }),
        ...(offerName !== undefined && { offerName }),
        ...(offerPrice !== undefined && { offerPrice: offerPrice === null ? null : Number(offerPrice) }),
        ...(closeRate !== undefined && { closeRate: closeRate === null ? null : Number(closeRate) }),
        ...(avgCallMinutes !== undefined && { avgCallMinutes: avgCallMinutes === null ? null : Number(avgCallMinutes) }),
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
