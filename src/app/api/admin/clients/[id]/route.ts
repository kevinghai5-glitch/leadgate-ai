import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { encryptSecret } from "@/lib/crypto";

function orNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

/** One client's detail for the Manage drawer. Admin only. Token never exposed. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      businessName: true,
      niche: true,
      plan: true,
      createdAt: true,
      calendarLink: true,
      ghlLocationId: true,
      ghlPrivateToken: true,
      ghlPipelineId: true,
      ghlQualifiedStageId: true,
      ghlNewLeadStageId: true,
      ghlBookingUrl: true,
      _count: { select: { leads: true } },
      leads: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          aiScore: true,
          status: true,
          ghlSyncStatus: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const { ghlPrivateToken, ...safe } = user;
  return NextResponse.json({
    ...safe,
    leadCount: user._count.leads,
    ghlPrivateTokenSet: !!ghlPrivateToken,
  });
}

/** Update a client's GHL config / booking on their behalf. Admin only. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const { id } = await params;
  try {
    const client = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const {
      ghlLocationId,
      ghlPrivateToken,
      ghlPipelineId,
      ghlQualifiedStageId,
      ghlNewLeadStageId,
      ghlBookingUrl,
      calendarLink,
      businessName,
      niche,
    } = await req.json();

    await prisma.user.update({
      where: { id },
      data: {
        ...(ghlLocationId !== undefined && { ghlLocationId: orNull(ghlLocationId) }),
        ...(ghlPipelineId !== undefined && { ghlPipelineId: orNull(ghlPipelineId) }),
        ...(ghlQualifiedStageId !== undefined && { ghlQualifiedStageId: orNull(ghlQualifiedStageId) }),
        ...(ghlNewLeadStageId !== undefined && { ghlNewLeadStageId: orNull(ghlNewLeadStageId) }),
        ...(ghlBookingUrl !== undefined && { ghlBookingUrl: orNull(ghlBookingUrl) }),
        ...(calendarLink !== undefined && { calendarLink: orNull(calendarLink) }),
        ...(businessName !== undefined && { businessName: orNull(businessName) }),
        ...(niche !== undefined && { niche: orNull(niche) }),
        // Only touch the token when a new one is provided; empty clears it.
        ...(ghlPrivateToken !== undefined && {
          ghlPrivateToken: orNull(ghlPrivateToken)
            ? encryptSecret((ghlPrivateToken as string).trim())
            : null,
        }),
      },
    });

    return NextResponse.json({ message: "Client updated" });
  } catch (error) {
    console.error("Admin update client error:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}
