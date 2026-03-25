import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreLead, generateLeadSummary } from "@/lib/openai";
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

    // Score the lead with AI (no manual scoring rules)
    const scoreResult = await scoreLead(validatedData);

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
