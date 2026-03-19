import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (user) {
      // Invalidate any existing tokens for this user
      await prisma.passwordResetToken.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      });

      // Create a new token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      // Send email
      try {
        await sendPasswordResetEmail(email, token);
      } catch (err) {
        console.error("Failed to send password reset email:", err);
        return NextResponse.json(
          { error: "Failed to send email. Please try again later." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
