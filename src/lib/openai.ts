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

interface ScoreResult {
  score: number;
  reasoning: string;
}

interface LeadSummary {
  summary: string;
  salesAngle: string;
}

export async function scoreLead(lead: LeadData): Promise<ScoreResult> {
  const prompt = `You are a fitness coaching lead qualification assistant. Evaluate the following prospect based on their answers to determine how likely they are to become a premium coaching client.

Prospect Information:
- Name: ${lead.name}
- Email: ${lead.email}
- Phone: ${lead.phone || "Not provided"}
- Budget: ${lead.budget}
- Timeline: ${lead.timeline}
- Answers: ${lead.problemDescription}

Evaluate the prospect holistically on:
- Commitment level and readiness to change
- Financial readiness and investment level
- Timeline urgency (how soon they want to start)
- Clarity of goals and motivation
- Previous coaching experience and attitude

Return a JSON object with exactly this structure:
{
  "score": <number from 1 to 10>,
  "reasoning": "<short explanation of why the prospect received this score>"
}

Score guidelines:
- 1-3: Low quality (just exploring, low budget, vague goals, not committed)
- 4-5: Medium quality (some interest but lacking key buying signals)
- 6-7: Good prospect (clear goals, reasonable budget, decent timeline)
- 8-10: Excellent prospect (highly committed, strong budget, wants to start immediately)

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
  const prompt = `You are a sales preparation assistant for a fitness coaching business. Generate a brief summary and suggested sales angle for this qualified prospect.

Prospect Information:
- Name: ${lead.name}
- Budget: ${lead.budget}
- Timeline: ${lead.timeline}
- Answers: ${lead.problemDescription}
- AI Score: ${lead.aiScore}/10
- AI Assessment: ${lead.aiReasoning}

Return a JSON object with exactly this structure:
{
  "summary": "<2-3 sentence overview of the prospect and their needs>",
  "salesAngle": "<1-2 sentence suggested approach for the discovery call>"
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
