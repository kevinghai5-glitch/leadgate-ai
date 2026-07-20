import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    // ── Signup is closed. LeadGate is provisioned by ReclaimedHQ, not self-serve.
    // The only way through is the admin escape hatch: set ADMIN_SIGNUP_KEY in the
    // environment and send it as the `x-admin-signup-key` header. Accounts created
    // this way are marked plan="agency" so they pass every subscription gate.
    const adminKey = process.env.ADMIN_SIGNUP_KEY;
    const providedKey = req.headers.get("x-admin-signup-key");
    const isAdminProvision = !!adminKey && providedKey === adminKey;

    if (!isAdminProvision) {
      return NextResponse.json(
        { error: "Signups are closed. LeadGate is available through ReclaimedHQ." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password } = signupSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        plan: "agency",
      },
    });

    // Create default scoring rules
    await prisma.scoringRules.create({
      data: {
        userId: user.id,
        budgetWeight: 30,
        timelineWeight: 25,
        urgencyWeight: 25,
        qualityWeight: 20,
        minScore: 6,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
