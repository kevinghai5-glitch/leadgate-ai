interface SlackLeadData {
  name: string;
  company?: string | null;
  budget: string;
  timeline: string;
  aiScore: number;
  aiReasoning: string;
  formUrl: string;
}

export async function sendSlackNotification(
  webhookUrl: string,
  lead: SlackLeadData
) {
  const scoreEmoji = lead.aiScore >= 8 ? "🔥" : lead.aiScore >= 6 ? "✅" : "⚠️";

  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${scoreEmoji} New Qualified Lead: ${lead.name}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Company:*\n${lead.company || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Budget:*\n${lead.budget}`,
          },
          {
            type: "mrkdwn",
            text: `*Timeline:*\n${lead.timeline}`,
          },
          {
            type: "mrkdwn",
            text: `*AI Score:*\n${lead.aiScore}/10`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*AI Assessment:*\n${lead.aiReasoning}`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Submitted via LeadGate AI`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Slack notification failed:", response.statusText);
    }
  } catch (error) {
    console.error("Slack notification error:", error);
  }
}
