import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreLead, generateLeadSummary } from "@/lib/openai";
import { leadFormSchema } from "@/lib/validations";
import { requireProForUser } from "@/lib/require-pro";
import { syncLeadRowToGHL } from "@/lib/ghl-sync";
import { rateLimit, clientIp } from "@/lib/rate-limit";

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

    // Rate-limit this public endpoint (spam + OpenAI-cost abuse protection).
    const rl = rateLimit(`score:${clientIp(req)}`, 8, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    // Paywall: block submissions to accounts without an active subscription.
    const paywallResponse = await requireProForUser(userId);
    if (paywallResponse) return paywallResponse;

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

    // Capture the lead FIRST, as PENDING. AI scoring can fail (OpenAI outage,
    // bad key, rate limit) — but a real prospect must never be dropped because
    // of it. We persist immediately, then enrich with the score below.
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
        status: "PENDING",
        source: "form",
      },
    });

    try {
      // Score the lead with AI.
      const scoreResult = await scoreLead(validatedData);
      const minScore = user.rules?.minScore ?? 6;
      const isQualified = scoreResult.score >= minScore;

      // Generate summary for qualified leads (non-fatal).
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

      // Enrich the already-saved lead with the AI result.
      const scored = await prisma.lead.update({
        where: { id: lead.id },
        data: {
          aiScore: scoreResult.score,
          aiReasoning: scoreResult.reasoning,
          aiSummary,
          status: isQualified ? "QUALIFIED" : "DISQUALIFIED",
        },
      });

      // Push to the tenant's GoHighLevel sub-account (non-fatal).
      try {
        await syncLeadRowToGHL(user, scored);
      } catch (err) {
        console.error("GHL sync unexpected error:", err);
      }

      return NextResponse.json({
        leadId: lead.id,
        score: scoreResult.score,
        reasoning: scoreResult.reasoning,
        qualified: isQualified,
        // Prefer the tenant's GHL booking URL; fall back to Calendly.
        calendarLink: isQualified
          ? user.ghlBookingUrl || user.calendarLink
          : null,
        summary: aiSummary,
      });
    } catch (scoreErr) {
      // Scoring failed but the lead IS captured (PENDING) for manual review.
      // Degrade gracefully: the prospect sees the polite follow-up path.
      console.error(
        "Scoring failed; lead saved as PENDING for manual review:",
        scoreErr
      );
      return NextResponse.json({
        leadId: lead.id,
        score: null,
        reasoning: null,
        qualified: false,
        calendarLink: null,
        summary: null,
      });
    }
  } catch (error) {
    console.error("Score lead error:", error);
    return NextResponse.json(
      { error: "Failed to process lead. Please try again." },
      { status: 500 }
    );
  }
}
