import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/crypto";
import {
  pushLeadToGHL,
  hasGhlConfig,
  isGhlPartiallyConfigured,
  GhlError,
  type GhlLeadInput,
} from "@/lib/ghl";

/**
 * Server-side glue between a persisted Lead row + the tenant's GHL config and
 * the GoHighLevel push. Shared by the scoring route and the manual re-sync
 * endpoint. NEVER throws — it records the outcome on the Lead
 * (ghlSyncStatus / ghlSyncError) and returns the status. Callers may still wrap
 * defensively; the point is that a GHL failure can never break lead capture.
 */

type GhlUserConfig = {
  ghlLocationId: string | null;
  ghlPrivateToken: string | null;
  ghlPipelineId: string | null;
  ghlQualifiedStageId: string | null;
  ghlNewLeadStageId: string | null;
  offerPrice: number | null;
};

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  budget: string;
  timeline: string;
  problemDescription: string;
  aiScore: number | null;
  aiReasoning: string | null;
  aiSummary: string | null;
  status: string; // LeadStatus
  // Prior sync state — used to keep re-syncs idempotent.
  ghlContactId?: string | null;
  ghlOpportunityId?: string | null;
};

export type GhlSyncStatus = "synced" | "failed" | "skipped" | null;

export async function syncLeadRowToGHL(
  user: GhlUserConfig,
  lead: LeadRow
): Promise<GhlSyncStatus> {
  // No GHL config at all → behave exactly as before (no push, no status).
  if (!hasGhlConfig(user)) {
    if (isGhlPartiallyConfigured(user)) {
      await safeUpdate(lead.id, {
        ghlSyncStatus: "skipped",
        ghlSyncError:
          "GHL not fully configured (needs Location ID, Private Token, and Pipeline ID).",
      });
      return "skipped";
    }
    return null;
  }

  try {
    const token = decryptSecret(user.ghlPrivateToken as string);
    const input: GhlLeadInput = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      budget: lead.budget,
      timeline: lead.timeline,
      problemDescription: lead.problemDescription,
      aiScore: lead.aiScore,
      aiReasoning: lead.aiReasoning,
      aiSummary: lead.aiSummary,
      isQualified: lead.status === "QUALIFIED",
    };

    const result = await pushLeadToGHL(
      {
        token,
        locationId: user.ghlLocationId as string,
        pipelineId: user.ghlPipelineId as string,
        qualifiedStageId: user.ghlQualifiedStageId,
        newLeadStageId: user.ghlNewLeadStageId,
        offerPrice: user.offerPrice,
      },
      input,
      // Never create a duplicate opportunity on re-sync.
      { opportunityId: lead.ghlOpportunityId ?? null }
    );

    await safeUpdate(lead.id, {
      ghlSyncStatus: "synced",
      ghlContactId: result.contactId,
      ghlOpportunityId: result.opportunityId,
      ghlSyncError: null,
    });
    return "synced";
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ghl-sync] push failed for lead", lead.id, message);
    // Keep any contact that was created before the failure so a retry can
    // resume instead of orphaning it.
    const partialContactId =
      err instanceof GhlError && err.contactId ? err.contactId : undefined;
    await safeUpdate(lead.id, {
      ghlSyncStatus: "failed",
      ghlSyncError: message.slice(0, 500),
      ...(partialContactId && { ghlContactId: partialContactId }),
    });
    return "failed";
  }
}

// Persisting the status must not itself throw out of the sync.
async function safeUpdate(
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.lead.update({ where: { id }, data });
  } catch (err) {
    console.error("[ghl-sync] failed to record sync status for lead", id, err);
  }
}
