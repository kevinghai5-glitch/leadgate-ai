import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder",
});

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget: string;
  timeline: string;
  problemDescription: string;
}

interface ScoringRules {
  budgetWeight: number;
  timelineWeight: number;
  urgencyWeight: number;
  qualityWeight: number;
}

interface ScoreResult {
  score: number;
  reasoning: string;
}

interface LeadSummary {
  summary: string;
  salesAngle: string;
}

export async function scoreLead(
  lead: LeadData,
  rules?: ScoringRules
): Promise<ScoreResult> {
  const weights = rules || {
    budgetWeight: 30,
    timelineWeight: 25,
    urgencyWeight: 25,
    qualityWeight: 20,
  };

  const prompt = `You are a sales lead qualification assistant. Evaluate the following lead based on the criteria below.

Lead Information:
- Name: ${lead.name}
- Email: ${lead.email}
- Phone: ${lead.phone || "Not provided"}
- Company: ${lead.company || "Not provided"}
- Budget: ${lead.budget}
- Timeline: ${lead.timeline}
- Problem Description: ${lead.problemDescription}

Scoring Weights:
- Budget fit: ${weights.budgetWeight}%
- Timeline urgency: ${weights.timelineWeight}%
- Problem urgency: ${weights.urgencyWeight}%
- Problem quality/clarity: ${weights.qualityWeight}%

Return a JSON object with exactly this structure:
{
  "score": <number from 1 to 10>,
  "reasoning": "<short explanation of why the lead received this score>"
}

Score guidelines:
- 1-3: Low quality lead (vague problem, no budget, no timeline)
- 4-5: Medium quality lead (some potential but missing key signals)
- 6-7: Good lead (clear problem, reasonable budget, decent timeline)
- 8-10: Excellent lead (urgent problem, strong budget, immediate timeline)

Return ONLY the JSON object, no other text.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI scoring engine");
  }

  const result = JSON.parse(content) as ScoreResult;
  return {
    score: Math.min(10, Math.max(1, Math.round(result.score))),
    reasoning: result.reasoning,
  };
}

export async function generateLeadSummary(
  lead: LeadData & { aiScore: number; aiReasoning: string }
): Promise<LeadSummary> {
  const prompt = `You are a sales preparation assistant. Generate a brief summary and suggested sales angle for this qualified lead.

Lead Information:
- Name: ${lead.name}
- Company: ${lead.company || "Not provided"}
- Budget: ${lead.budget}
- Timeline: ${lead.timeline}
- Problem: ${lead.problemDescription}
- AI Score: ${lead.aiScore}/10
- AI Assessment: ${lead.aiReasoning}

Return a JSON object with exactly this structure:
{
  "summary": "<2-3 sentence overview of the lead and their needs>",
  "salesAngle": "<1-2 sentence suggested approach for the sales call>"
}

Return ONLY the JSON object, no other text.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI summary engine");
  }

  return JSON.parse(content) as LeadSummary;
}
