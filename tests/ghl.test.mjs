// Unit + scripted-dry-run tests for the GoHighLevel/LeadConnector client.
// No test framework or network: global.fetch is mocked and every outgoing
// request is captured and asserted against the shapes verified in recon.
//
// Run:  node --test tests/ghl.test.mjs
// (Node >= 23 strips the types from the imported ../src/lib/ghl.ts at runtime.)

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  GHL_BASE,
  GHL_VERSION,
  upsertContact,
  addTags,
  createOpportunity,
  pushLeadToGHL,
  hasGhlConfig,
  isGhlPartiallyConfigured,
} from "../src/lib/ghl.ts";

const TOKEN = "pit-test-token-xyz";

// Install a mock fetch that records calls and returns canned GHL responses.
function installMockFetch() {
  const calls = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    const body = opts.body ? JSON.parse(opts.body) : undefined;
    calls.push({ url, method: opts.method, headers: opts.headers, body });
    let json = {};
    if (url.endsWith("/contacts/upsert")) {
      json = { new: true, contact: { id: "contact_123" } };
    } else if (url.includes("/tags")) {
      json = { tags: body?.tags ?? [] };
    } else if (url.endsWith("/opportunities/")) {
      json = { opportunity: { id: "opp_456" } };
    } else if (url.includes("/notes")) {
      json = { note: { id: "note_789" } };
    }
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify(json),
    };
  };
  return {
    calls,
    restore() {
      globalThis.fetch = original;
    },
  };
}

function assertAuthHeaders(headers) {
  assert.equal(headers.Authorization, `Bearer ${TOKEN}`);
  assert.equal(headers.Version, GHL_VERSION);
  assert.equal(headers["Content-Type"], "application/json");
}

test("upsertContact: correct URL, headers, payload, and returns contact id", async () => {
  const mock = installMockFetch();
  try {
    const id = await upsertContact(TOKEN, {
      locationId: "loc_1",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      source: "LeadGate",
    });
    assert.equal(id, "contact_123");
    assert.equal(mock.calls.length, 1);

    const c = mock.calls[0];
    assert.equal(c.url, `${GHL_BASE}/contacts/upsert`);
    assert.equal(c.method, "POST");
    assertAuthHeaders(c.headers);
    assert.equal(c.body.locationId, "loc_1");
    assert.equal(c.body.source, "LeadGate");
    assert.equal(c.body.firstName, "Jane");
    assert.equal(c.body.lastName, "Doe");
    assert.equal(c.body.email, "jane@example.com");
    // Must NOT send tags on upsert (would overwrite existing tags).
    assert.equal(c.body.tags, undefined);
  } finally {
    mock.restore();
  }
});

test("addTags: dedicated additive endpoint with { tags } body", async () => {
  const mock = installMockFetch();
  try {
    const tags = ["leadgate", "leadgate-qualified", "score-9"];
    const result = await addTags(TOKEN, "contact_123", tags);
    assert.deepEqual(result, tags);

    const c = mock.calls[0];
    assert.equal(c.url, `${GHL_BASE}/contacts/contact_123/tags`);
    assert.equal(c.method, "POST");
    assertAuthHeaders(c.headers);
    assert.deepEqual(c.body.tags, tags);
  } finally {
    mock.restore();
  }
});

test("createOpportunity: uses pipelineStageId (NOT stageId), status open", async () => {
  const mock = installMockFetch();
  try {
    const id = await createOpportunity(TOKEN, {
      pipelineId: "pipe_1",
      locationId: "loc_1",
      contactId: "contact_123",
      name: "Jane Doe — LeadGate qualified",
      pipelineStageId: "stage_qual",
      monetaryValue: 6500,
    });
    assert.equal(id, "opp_456");

    const c = mock.calls[0];
    assert.equal(c.url, `${GHL_BASE}/opportunities/`);
    assert.equal(c.method, "POST");
    assertAuthHeaders(c.headers);
    assert.equal(c.body.pipelineId, "pipe_1");
    assert.equal(c.body.locationId, "loc_1");
    assert.equal(c.body.contactId, "contact_123");
    assert.equal(c.body.status, "open");
    assert.equal(c.body.pipelineStageId, "stage_qual");
    assert.equal(c.body.monetaryValue, 6500);
    // The stage field must be pipelineStageId, never stageId.
    assert.equal("stageId" in c.body, false);
  } finally {
    mock.restore();
  }
});

test("pushLeadToGHL (dry run): QUALIFIED lead → upsert, tags, qualified stage, note", async () => {
  const mock = installMockFetch();
  try {
    const result = await pushLeadToGHL(
      {
        token: TOKEN,
        locationId: "loc_1",
        pipelineId: "pipe_1",
        qualifiedStageId: "stage_qual",
        newLeadStageId: "stage_new",
        offerPrice: 6500,
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+15551234567",
        budget: "$5k+",
        timeline: "This month",
        problemDescription: "Need a new roof after storm damage",
        aiScore: 9,
        aiReasoning: "Urgent, budget confirmed, decision maker.",
        aiSummary: "Strong buyer.",
        isQualified: true,
      }
    );

    assert.deepEqual(result, {
      contactId: "contact_123",
      opportunityId: "opp_456",
      noteId: "note_789",
    });

    const paths = mock.calls.map((c) => c.url.replace(GHL_BASE, ""));
    assert.deepEqual(paths, [
      "/contacts/upsert",
      "/contacts/contact_123/tags",
      "/opportunities/",
      "/contacts/contact_123/notes",
    ]);

    // Tags for a qualified lead.
    assert.deepEqual(mock.calls[1].body.tags, [
      "leadgate",
      "leadgate-qualified",
      "score-9",
    ]);

    // Opportunity lands in the qualified stage with the offer value.
    const opp = mock.calls[2].body;
    assert.equal(opp.pipelineStageId, "stage_qual");
    assert.equal(opp.monetaryValue, 6500);
    assert.equal(opp.name, "Jane Doe — LeadGate qualified");

    // Note carries the AI reasoning + answers.
    assert.match(mock.calls[3].body.body, /AI reasoning/);
    assert.match(mock.calls[3].body.body, /roof/);
  } finally {
    mock.restore();
  }
});

test("pushLeadToGHL (dry run): DISQUALIFIED lead → new-lead stage, no monetary value", async () => {
  const mock = installMockFetch();
  try {
    await pushLeadToGHL(
      {
        token: TOKEN,
        locationId: "loc_1",
        pipelineId: "pipe_1",
        qualifiedStageId: "stage_qual",
        newLeadStageId: "stage_new",
        offerPrice: 6500,
      },
      {
        name: "Tim Kicker",
        email: "tim@example.com",
        aiScore: 3,
        isQualified: false,
      }
    );

    assert.deepEqual(mock.calls[1].body.tags, [
      "leadgate",
      "leadgate-disqualified",
      "score-3",
    ]);
    const opp = mock.calls[2].body;
    assert.equal(opp.pipelineStageId, "stage_new");
    assert.equal(opp.monetaryValue, undefined);
    assert.equal(opp.name, "Tim Kicker — LeadGate disqualified");
  } finally {
    mock.restore();
  }
});

test("pushLeadToGHL: note failure is non-fatal (contact + opportunity still succeed)", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    const body = opts.body ? JSON.parse(opts.body) : undefined;
    if (url.endsWith("/contacts/upsert"))
      return { ok: true, status: 200, text: async () => JSON.stringify({ contact: { id: "c1" } }) };
    if (url.includes("/tags"))
      return { ok: true, status: 200, text: async () => JSON.stringify({ tags: body?.tags ?? [] }) };
    if (url.endsWith("/opportunities/"))
      return { ok: true, status: 200, text: async () => JSON.stringify({ opportunity: { id: "o1" } }) };
    // Notes endpoint fails.
    return { ok: false, status: 404, text: async () => "not found" };
  };
  try {
    const result = await pushLeadToGHL(
      { token: TOKEN, locationId: "loc_1", pipelineId: "pipe_1", qualifiedStageId: "s", newLeadStageId: "n" },
      { name: "Ann", email: "ann@example.com", aiScore: 8, isQualified: true }
    );
    assert.equal(result.contactId, "c1");
    assert.equal(result.opportunityId, "o1");
    assert.equal(result.noteId, null);
  } finally {
    globalThis.fetch = original;
  }
});

test("pushLeadToGHL: tag failure is NON-fatal — opportunity is still created", async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, opts = {}) => {
    const body = opts.body ? JSON.parse(opts.body) : undefined;
    calls.push(url.replace(GHL_BASE, ""));
    if (url.endsWith("/contacts/upsert"))
      return { ok: true, status: 200, text: async () => JSON.stringify({ contact: { id: "c1" } }) };
    if (url.includes("/tags")) return { ok: false, status: 429, text: async () => "rate limited" };
    if (url.endsWith("/opportunities/"))
      return { ok: true, status: 200, text: async () => JSON.stringify({ opportunity: { id: "o1" } }) };
    return { ok: true, status: 200, text: async () => JSON.stringify({ note: { id: "n1" } }) };
  };
  try {
    const result = await pushLeadToGHL(
      { token: TOKEN, locationId: "l", pipelineId: "p", qualifiedStageId: "sq", newLeadStageId: "sn" },
      { name: "Ann", email: "ann@example.com", aiScore: 8, isQualified: true }
    );
    // The lead must still reach the pipeline despite the tag failure.
    assert.equal(result.opportunityId, "o1");
    assert.equal(result.contactId, "c1");
    assert.ok(calls.includes("/opportunities/"), "opportunity must still be created");
  } finally {
    globalThis.fetch = original;
  }
});

test("pushLeadToGHL: idempotent re-sync — existing opportunityId creates no duplicate", async () => {
  const mock = installMockFetch();
  try {
    const result = await pushLeadToGHL(
      { token: TOKEN, locationId: "l", pipelineId: "p", qualifiedStageId: "sq", newLeadStageId: "sn" },
      { name: "Ann", email: "ann@example.com", aiScore: 8, isQualified: true },
      { opportunityId: "existing_opp" }
    );
    assert.equal(result.opportunityId, "existing_opp");
    const paths = mock.calls.map((c) => c.url.replace(GHL_BASE, ""));
    assert.equal(
      paths.includes("/opportunities/"),
      false,
      "must NOT create a second opportunity on re-sync"
    );
  } finally {
    mock.restore();
  }
});

test("pushLeadToGHL: opportunity failure preserves contactId on the error", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (url.endsWith("/contacts/upsert"))
      return { ok: true, status: 200, text: async () => JSON.stringify({ contact: { id: "c_keep" } }) };
    if (url.includes("/tags")) return { ok: true, status: 200, text: async () => JSON.stringify({ tags: [] }) };
    return { ok: false, status: 500, text: async () => "boom" };
  };
  try {
    await assert.rejects(
      () =>
        pushLeadToGHL(
          { token: TOKEN, locationId: "l", pipelineId: "p", qualifiedStageId: "sq", newLeadStageId: "sn" },
          { name: "Ann", email: "ann@example.com", aiScore: 8, isQualified: true }
        ),
      (err) => {
        assert.equal(err.contactId, "c_keep");
        return true;
      }
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("ghlRequest: requests carry an abort signal (timeout bound)", async () => {
  const original = globalThis.fetch;
  let sawSignal = false;
  globalThis.fetch = async (url, opts = {}) => {
    sawSignal = !!opts.signal;
    return { ok: true, status: 200, text: async () => JSON.stringify({ contact: { id: "c1" } }) };
  };
  try {
    await upsertContact(TOKEN, { locationId: "l", name: "Ann" });
    assert.equal(sawSignal, true, "fetch must be called with an AbortSignal");
  } finally {
    globalThis.fetch = original;
  }
});

test("config helpers: hasGhlConfig / isGhlPartiallyConfigured", () => {
  const full = { ghlLocationId: "l", ghlPrivateToken: "t", ghlPipelineId: "p" };
  const partial = { ghlLocationId: "l", ghlPrivateToken: null, ghlPipelineId: null };
  const none = { ghlLocationId: null, ghlPrivateToken: null, ghlPipelineId: null };

  assert.equal(hasGhlConfig(full), true);
  assert.equal(hasGhlConfig(partial), false);
  assert.equal(isGhlPartiallyConfigured(partial), true);
  assert.equal(isGhlPartiallyConfigured(full), false);
  assert.equal(isGhlPartiallyConfigured(none), false);
});
