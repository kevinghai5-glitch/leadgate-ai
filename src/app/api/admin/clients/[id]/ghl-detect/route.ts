import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { decryptSecret } from "@/lib/crypto";
import { getPipelines, autoMatchPipeline } from "@/lib/ghl";

/**
 * Ask GoHighLevel for this client's pipelines + stages, and auto-match the
 * pipeline / qualified stage / new-lead stage by name. Lets the operator fill
 * those IDs without ever hand-copying them. Admin only.
 *
 * Reads the location + token from what's already saved on the client, so save
 * the Location ID and token first (or send them in the body to test before saving).
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const { id } = await params;
  try {
    const client = await prisma.user.findUnique({
      where: { id },
      select: { ghlLocationId: true, ghlPrivateToken: true },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Allow overriding with unsaved values from the form (test-before-save).
    const body = await req.json().catch(() => ({}));
    const locationId = (body.ghlLocationId || client.ghlLocationId || "").trim();
    const rawToken = body.ghlPrivateToken || null;

    if (!locationId) {
      return NextResponse.json(
        { error: "Add the Location ID first." },
        { status: 400 }
      );
    }

    let token: string;
    if (rawToken && String(rawToken).trim()) {
      token = String(rawToken).trim();
    } else if (client.ghlPrivateToken) {
      token = decryptSecret(client.ghlPrivateToken);
    } else {
      return NextResponse.json(
        { error: "Add the Private Integration token first." },
        { status: 400 }
      );
    }

    const pipelines = await getPipelines(token, locationId);
    if (pipelines.length === 0) {
      return NextResponse.json(
        { error: "No pipelines found for this location. Check the Location ID and token scopes (opportunities.readonly)." },
        { status: 422 }
      );
    }

    const match = autoMatchPipeline(pipelines);
    return NextResponse.json({ pipelines, match });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Detection failed";
    console.error("Admin GHL detect error:", message);
    return NextResponse.json(
      { error: "Couldn't reach GoHighLevel. Check the Location ID and token." },
      { status: 502 }
    );
  }
}
