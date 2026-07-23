import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminEmail } from "@/lib/admin";
import { hasGhlConfig } from "@/lib/ghl";
import { generateTempPassword } from "@/lib/passwords";

/** List every client (tenant) with a quick health summary. Admin only. */
export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      businessName: true,
      niche: true,
      plan: true,
      createdAt: true,
      ghlLocationId: true,
      ghlPrivateToken: true,
      ghlPipelineId: true,
      _count: { select: { leads: true } },
      leads: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  const clients = users
    // The roster is clients only — hide operator/admin accounts.
    .filter((u) => !isAdminEmail(u.email))
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      businessName: u.businessName,
      niche: u.niche,
      plan: u.plan,
      createdAt: u.createdAt,
      leadCount: u._count.leads,
      lastLeadAt: u.leads[0]?.createdAt ?? null,
      ghlConnected: hasGhlConfig(u),
    }));

  return NextResponse.json({ clients });
}

/** Provision a new client account. Admin only. Returns a one-time password. */
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  try {
    const body = await req.json();
    const businessName = (body.businessName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const contactName = (body.name || "").trim() || businessName;

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 12);

    const user = await prisma.user.create({
      data: {
        name: contactName,
        email,
        businessName,
        password: hashed,
        plan: "agency",
        rules: {
          create: {
            budgetWeight: 30,
            timelineWeight: 25,
            urgencyWeight: 25,
            qualityWeight: 20,
            minScore: 6,
          },
        },
      },
    });

    // tempPassword is returned exactly once and never stored in plaintext.
    return NextResponse.json(
      { id: user.id, email: user.email, businessName, tempPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin create client error:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
