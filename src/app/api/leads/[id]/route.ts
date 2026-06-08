import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/require-pro";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requirePro();
    if ("response" in guard) return guard.response;

    const { id } = await params;

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId: guard.userId,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Get lead error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requirePro();
    if ("response" in guard) return guard.response;

    const { id } = await params;
    const body = await req.json();

    const allowed = ["PENDING", "QUALIFIED", "DISQUALIFIED"] as const;
    if (body.status && !allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await prisma.lead.updateMany({
      where: { id, userId: guard.userId },
      data: { status: body.status },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const lead = await prisma.lead.findFirst({
      where: { id, userId: guard.userId },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requirePro();
    if ("response" in guard) return guard.response;

    const { id } = await params;

    await prisma.lead.deleteMany({
      where: {
        id,
        userId: guard.userId,
      },
    });

    return NextResponse.json({ message: "Lead deleted" });
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
