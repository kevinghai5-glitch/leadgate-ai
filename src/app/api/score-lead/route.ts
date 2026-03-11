import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreLead, generateLeadSummary } from "@/lib/openai";
import { sendSlackNotification } from "@/lib/slack";
import { leadFormSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, ...leadData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate lead form data
    const validatedData = leadFormSchema.parse(leadData);

    // Get user and their scoring rules
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { rules: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Score the lead with AI
    const scoreResult = await scoreLead(
      validatedData,
      user.rules
        ? {
            budgetWeight: user.rules.budgetWeight,
            timelineWeight: user.rules.timelineWeight,
            urgencyWeight: user.rules.urgencyWeight,
            qualityWeight: user.rules.qualityWeight,
          }
        : undefined
    );

    const minScore = user.rules?.minScore ?? 6;
    const isQualified = scoreResult.score >= minScore;

    // Generate summary for qualified leads
    let aiSummary: string | null = null;
    if (isQualified) {
      try {
        const summary = await generateLeadSummary({
          ...validatedData,
          aiScore: scoreResult.score,
          aiReasoning: scoreResult.reasoning,
        });
        aiSummary = `${summary.summary}\n\nSuggested Sales Angle: ${summary.salesAngle}`;
      } catch (err) {
        console.error("Failed to generate lead summary:", err);
      }
    }

    // Save lead to database
    const lead = await prisma.lead.create({
      data: {
        userId,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        problemDescription: validatedData.problemDescription,
        aiScore: scoreResult.score,
        aiReasoning: scoreResult.reasoning,
        aiSummary,
        status: isQualified ? "QUALIFIED" : "DISQUALIFIED",
        source: "form",
      },
    });

    // Send Slack notification for qualified leads
    if (isQualified && user.slackWebhookUrl) {
      await sendSlackNotification(user.slackWebhookUrl, {
        name: lead.name,
        company: lead.company,
        budget: lead.budget,
        timeline: lead.timeline,
        aiScore: scoreResult.score,
        aiReasoning: scoreResult.reasoning,
        formUrl: `${process.env.NEXT_PUBLIC_APP_URL}/form/${userId}`,
      });
    }

    return NextResponse.json({
      leadId: lead.id,
      score: scoreResult.score,
      reasoning: scoreResult.reasoning,
      qualified: isQualified,
      calendarLink: isQualified ? user.calendarLink : null,
      summary: aiSummary,
    });
  } catch (error) {
    console.error("Score lead error:", error);
    return NextResponse.json(
      { error: "Failed to process lead. Please try again." },
      { status: 500 }
    );
  }
}
