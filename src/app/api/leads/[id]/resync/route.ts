import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/require-pro";
import { syncLeadRowToGHL } from "@/lib/ghl-sync";
import { hasGhlConfig } from "@/lib/ghl";

/**
 * Manually re-push a lead into GoHighLevel. Used by the "retry" control on the
 * dashboard lead list for leads whose ghlSyncStatus is "failed" (or "skipped").
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requirePro();
    if ("response" in guard) return guard.response;

    const { id } = await params;

    const lead = await prisma.lead.findFirst({
      where: { id, userId: guard.userId },
    });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: guard.userId },
      select: {
        ghlLocationId: true,
        ghlPrivateToken: true,
        ghlPipelineId: true,
        ghlQualifiedStageId: true,
        ghlNewLeadStageId: true,
        offerPrice: true,
      },
    });

    if (!user || !hasGhlConfig(user)) {
      return NextResponse.json(
        {
          error:
            "GoHighLevel is not fully configured. Add your Location ID, Private Token, and Pipeline ID in Business Profile → GoHighLevel first.",
        },
        { status: 400 }
      );
    }

    const status = await syncLeadRowToGHL(user, lead);
    const updated = await prisma.lead.findFirst({
      where: { id, userId: guard.userId },
    });

    return NextResponse.json({ status, lead: updated });
  } catch (error) {
    console.error("Lead re-sync error:", error);
    return NextResponse.json(
      { error: "Failed to re-sync lead" },
      { status: 500 }
    );
  }
}
