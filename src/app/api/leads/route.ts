import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/require-pro";

export async function GET() {
  try {
    const guard = await requirePro();
    if ("response" in guard) return guard.response;

    const leads = await prisma.lead.findMany({
      where: { userId: guard.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
