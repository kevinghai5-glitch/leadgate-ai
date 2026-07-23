/**
 * GoHighLevel / LeadConnector v2 REST client (ReclaimedHQ integration).
 *
 * Direct REST only — no inbound webhooks (the agency GHL plan gates inbound
 * webhook triggers). Every scored LeadGate lead is pushed into the tenant's GHL
 * sub-account: upsert a contact, add tags, and create a pipeline opportunity.
 *
 * API shapes verified against GoHighLevel's official OpenAPI specs
 * (github.com/GoHighLevel/highlevel-api-docs, marketplace.gohighlevel.com/docs):
 *   base   https://services.leadconnectorhq.com
 *   auth   Authorization: Bearer <Private Integration Token>
 *   ver    Version: 2021-07-28
 *   upsert POST /contacts/upsert          -> { new, contact: { id } }
 *   tags   POST /contacts/{id}/tags       -> { tags: [...] }   (additive)
 *   opp    POST /opportunities/           -> { opportunity: { id } }
 *          stage field is `pipelineStageId` (NOT stageId); status defaults "open"
 *   note   POST /contacts/{id}/notes      -> { note: { id } }  (best-effort; see NOTE below)
 */

export const GHL_BASE = "https://services.leadconnectorhq.com";
export const GHL_VERSION = "2021-07-28";
export const GHL_SOURCE = "LeadGate";
// Hard per-request timeout. The sync runs inside the public form's request, so
// an unresponsive LeadConnector endpoint must never hold that response open.
export const GHL_TIMEOUT_MS = 8000;

export interface GhlConfig {
  token: string; // decrypted Private Integration Token
  locationId: string;
  pipelineId: string;
  qualifiedStageId?: string | null;
  newLeadStageId?: string | null;
  offerPrice?: number | null;
}

export interface GhlLeadInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  budget?: string | null;
  timeline?: string | null;
  problemDescription?: string | null;
  aiScore?: number | null;
  aiReasoning?: string | null;
  aiSummary?: string | null;
  isQualified: boolean;
}

export interface GhlSyncResult {
  contactId: string;
  opportunityId: string;
  noteId: string | null;
}

/** True when the tenant has the minimum config required to push to GHL. */
export function hasGhlConfig(u: {
  ghlLocationId?: string | null;
  ghlPrivateToken?: string | null;
  ghlPipelineId?: string | null;
}): boolean {
  return !!(u.ghlLocationId && u.ghlPrivateToken && u.ghlPipelineId);
}

/** True when SOME GHL fields are set but not enough to sync (misconfiguration). */
export function isGhlPartiallyConfigured(u: {
  ghlLocationId?: string | null;
  ghlPrivateToken?: string | null;
  ghlPipelineId?: string | null;
}): boolean {
  const any = !!(u.ghlLocationId || u.ghlPrivateToken || u.ghlPipelineId);
  return any && !hasGhlConfig(u);
}

export class GhlError extends Error {
  status: number;
  /** Set when a contact was successfully upserted before a later step failed,
   *  so callers can persist it instead of losing the reference. */
  contactId?: string;
  constructor(message: string, status: number) {
    super(message);
    this.name = "GhlError";
    this.status = status;
  }
}

async function ghlRequest<T>(
  token: string,
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${GHL_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // Bounded so a hung GHL endpoint can't stall the form response.
      signal: AbortSignal.timeout(GHL_TIMEOUT_MS),
    });
  } catch (err) {
    const timedOut =
      err instanceof Error &&
      (err.name === "TimeoutError" || err.name === "AbortError");
    throw new GhlError(
      timedOut
        ? `GHL ${method} ${path} timed out after ${GHL_TIMEOUT_MS}ms`
        : `GHL ${method} ${path} network error: ${
            err instanceof Error ? err.message : String(err)
          }`,
      timedOut ? 504 : 0
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new GhlError(
      `GHL ${method} ${path} failed (${res.status}): ${detail.slice(0, 400)}`,
      res.status
    );
  }

  // Some endpoints (rarely) return empty bodies; guard the JSON parse.
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

/**
 * Upsert a contact by email/phone. Returns the contact id.
 * NOTE: passing `tags` on upsert OVERWRITES the contact's tags — we deliberately
 * omit tags here and add them additively via addTags().
 */
export async function upsertContact(
  token: string,
  input: {
    locationId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    source?: string;
  }
): Promise<string> {
  const [firstName, ...rest] = input.name.trim().split(/\s+/);
  const lastName = rest.join(" ");
  const payload: Record<string, unknown> = {
    locationId: input.locationId,
    name: input.name,
    firstName: firstName || input.name,
    source: input.source ?? GHL_SOURCE,
  };
  if (lastName) payload.lastName = lastName;
  if (input.email) payload.email = input.email;
  if (input.phone) payload.phone = input.phone;

  const data = await ghlRequest<{ contact?: { id?: string }; new?: boolean }>(
    token,
    "POST",
    "/contacts/upsert",
    payload
  );
  const id = data?.contact?.id;
  if (!id) {
    throw new GhlError("GHL upsert returned no contact id", 500);
  }
  return id;
}

/** Add tags to a contact (additive — does not clobber existing tags). */
export async function addTags(
  token: string,
  contactId: string,
  tags: string[]
): Promise<string[]> {
  if (tags.length === 0) return [];
  const data = await ghlRequest<{ tags?: string[] }>(
    token,
    "POST",
    `/contacts/${contactId}/tags`,
    { tags }
  );
  return data?.tags ?? tags;
}

/** Create an opportunity in a pipeline stage. Returns the opportunity id. */
export async function createOpportunity(
  token: string,
  input: {
    pipelineId: string;
    locationId: string;
    contactId: string;
    name: string;
    pipelineStageId?: string | null;
    status?: string;
    monetaryValue?: number | null;
  }
): Promise<string> {
  const payload: Record<string, unknown> = {
    pipelineId: input.pipelineId,
    locationId: input.locationId,
    contactId: input.contactId,
    name: input.name,
    status: input.status ?? "open",
  };
  if (input.pipelineStageId) payload.pipelineStageId = input.pipelineStageId;
  if (input.monetaryValue != null) payload.monetaryValue = input.monetaryValue;

  const data = await ghlRequest<{ opportunity?: { id?: string } }>(
    token,
    "POST",
    "/opportunities/",
    payload
  );
  const id = data?.opportunity?.id;
  if (!id) {
    throw new GhlError("GHL createOpportunity returned no opportunity id", 500);
  }
  return id;
}

/**
 * Move an existing opportunity to a new pipeline stage.
 * Used when a repeat submitter (same email → same GHL contact) re-enters the
 * funnel and we need to update the stage rather than create a duplicate.
 * Rule: new submission = latest truth; move accordingly.
 */
export async function updateOpportunity(
  token: string,
  input: {
    opportunityId: string;
    pipelineId: string;
    name: string;
    pipelineStageId?: string | null;
    status?: string;
    monetaryValue?: number | null;
  }
): Promise<string> {
  // NOTE: locationId is NOT accepted by PUT /opportunities/{id} (422 if included).
  const payload: Record<string, unknown> = {
    pipelineId: input.pipelineId,
    name: input.name,
    status: input.status ?? "open",
  };
  if (input.pipelineStageId) payload.pipelineStageId = input.pipelineStageId;
  if (input.monetaryValue != null) payload.monetaryValue = input.monetaryValue;

  await ghlRequest(
    token,
    "PUT",
    `/opportunities/${input.opportunityId}`,
    payload
  );
  return input.opportunityId;
}

/**
 * Attach a note (AI reasoning + answers) to a contact.
 * NOTE: the contact-notes endpoint was NOT part of the three specs verified in
 * recon — it is a well-known GHL v2 endpoint but should be confirmed against a
 * live token. Callers treat this as best-effort so a note failure never fails
 * the overall sync.
 */
export async function createContactNote(
  token: string,
  contactId: string,
  body: string
): Promise<string | null> {
  const data = await ghlRequest<{ note?: { id?: string } }>(
    token,
    "POST",
    `/contacts/${contactId}/notes`,
    { body }
  );
  return data?.note?.id ?? null;
}

export interface GhlStage {
  id: string;
  name: string;
}
export interface GhlPipeline {
  id: string;
  name: string;
  stages: GhlStage[];
}

/**
 * List the location's opportunity pipelines and their stages.
 * GET /opportunities/pipelines?locationId=... — used to auto-fill Pipeline ID +
 * Stage IDs so the operator never hand-copies raw GHL IDs.
 */
export async function getPipelines(
  token: string,
  locationId: string
): Promise<GhlPipeline[]> {
  const data = await ghlRequest<{ pipelines?: unknown[] }>(
    token,
    "GET",
    `/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`
  );
  const pipelines = Array.isArray(data.pipelines) ? data.pipelines : [];
  return pipelines.map((p) => {
    const pp = p as { id?: string; name?: string; stages?: unknown[] };
    const stages = Array.isArray(pp.stages) ? pp.stages : [];
    return {
      id: pp.id ?? "",
      name: pp.name ?? "",
      stages: stages.map((s) => {
        const ss = s as { id?: string; name?: string };
        return { id: ss.id ?? "", name: ss.name ?? "" };
      }),
    };
  });
}

/**
 * Auto-match the pipeline + the two stages LeadGate needs from a fetched list.
 * Because every client sub-account is cloned from the same master template, the
 * NAMES ("Client Conversion Pipeline", "Qualified", "New Lead") are consistent
 * even though the IDs differ per client — so match by name, fall back sensibly.
 */
export function autoMatchPipeline(pipelines: GhlPipeline[]): {
  pipelineId: string | null;
  pipelineName: string | null;
  qualifiedStageId: string | null;
  newLeadStageId: string | null;
} {
  const pick =
    pipelines.find((p) => /client\s*conversion/i.test(p.name)) ??
    pipelines[0] ??
    null;
  if (!pick) {
    return { pipelineId: null, pipelineName: null, qualifiedStageId: null, newLeadStageId: null };
  }
  const qualified = pick.stages.find((s) => /qualif/i.test(s.name));
  const newLead =
    pick.stages.find((s) => /new\s*lead/i.test(s.name)) ?? pick.stages[0];
  return {
    pipelineId: pick.id || null,
    pipelineName: pick.name || null,
    qualifiedStageId: qualified?.id ?? null,
    newLeadStageId: newLead?.id ?? null,
  };
}

/** Build the note body from the lead's AI reasoning + submitted answers. */
export function buildNoteBody(lead: GhlLeadInput): string {
  const lines: string[] = [];
  lines.push(
    `LeadGate — ${lead.isQualified ? "QUALIFIED" : "DISQUALIFIED"}${
      lead.aiScore != null ? ` (score ${lead.aiScore}/10)` : ""
    }`
  );
  if (lead.aiReasoning) lines.push(`\nAI reasoning: ${lead.aiReasoning}`);
  if (lead.aiSummary) lines.push(`\n${lead.aiSummary}`);
  lines.push("\nSubmitted answers:");
  if (lead.budget) lines.push(`• Budget: ${lead.budget}`);
  if (lead.timeline) lines.push(`• Timeline: ${lead.timeline}`);
  if (lead.company) lines.push(`• Company: ${lead.company}`);
  if (lead.problemDescription)
    lines.push(`• Details: ${lead.problemDescription}`);
  return lines.join("\n");
}

/**
 * Full push: upsert contact -> add tags -> create opportunity -> attach note.
 * Contact + opportunity are the required success criteria; the note is
 * best-effort. Throws (to be caught by the caller) if contact or opportunity
 * creation fails.
 */
export async function pushLeadToGHL(
  config: GhlConfig,
  lead: GhlLeadInput,
  existing?: { opportunityId?: string | null }
): Promise<GhlSyncResult> {
  const contactId = await upsertContact(config.token, {
    locationId: config.locationId,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: GHL_SOURCE,
  });

  // Tags are cosmetic — a tag failure must not stop the lead reaching the
  // pipeline. Contact + opportunity are the only required success criteria.
  const scoreTag =
    lead.aiScore != null ? `score-${lead.aiScore}` : "score-unknown";
  try {
    await addTags(config.token, contactId, [
      "leadgate",
      lead.isQualified ? "leadgate-qualified" : "leadgate-disqualified",
      scoreTag,
    ]);
  } catch (err) {
    console.error("[ghl] tag add failed (non-fatal):", err);
  }

  const stageId = lead.isQualified
    ? config.qualifiedStageId
    : config.newLeadStageId;

  // Idempotency: POST /opportunities/ is NOT idempotent, so never create a
  // second opportunity for a lead that already has one (e.g. on manual re-sync).
  let opportunityId = existing?.opportunityId ?? null;
  if (!opportunityId) {
    const oppName = `${lead.name} — LeadGate ${
      lead.isQualified ? "qualified" : "disqualified"
    }`;
    const monetaryValue = lead.isQualified
      ? config.offerPrice ?? undefined
      : undefined;
    try {
      opportunityId = await createOpportunity(config.token, {
        pipelineId: config.pipelineId,
        locationId: config.locationId,
        contactId,
        name: oppName,
        pipelineStageId: stageId,
        status: "open",
        monetaryValue,
      });
    } catch (err) {
      // GHL rejects duplicate opportunities (400 + meta.existingId) when the
      // same contact already owns one in this pipeline (repeat submitter whose
      // earlier lead row already synced). Rule: new submission = latest truth —
      // move the existing opportunity to the correct stage instead of failing.
      if (err instanceof GhlError && err.status === 400) {
        const match = /"existingId"\s*:\s*"([^"]+)"/.exec(err.message);
        if (match) {
          const existingOppId = match[1];
          try {
            opportunityId = await updateOpportunity(config.token, {
              opportunityId: existingOppId,
              pipelineId: config.pipelineId,
              name: oppName,
              pipelineStageId: stageId,
              status: "open",
              monetaryValue,
            });
          } catch (updateErr) {
            // Preserve the contact so the caller can persist it.
            if (updateErr instanceof GhlError) updateErr.contactId = contactId;
            throw updateErr;
          }
        } else {
          // 400 but no existingId — re-throw as before.
          if (err instanceof GhlError) err.contactId = contactId;
          throw err;
        }
      } else {
        // Preserve the contact we already created so the caller can persist it.
        if (err instanceof GhlError) err.contactId = contactId;
        throw err;
      }
    }
  }

  // Best-effort note; never fail the sync over it.
  let noteId: string | null = null;
  try {
    noteId = await createContactNote(
      config.token,
      contactId,
      buildNoteBody(lead)
    );
  } catch (err) {
    console.error("[ghl] note attach failed (non-fatal):", err);
  }

  return { contactId, opportunityId, noteId };
}
