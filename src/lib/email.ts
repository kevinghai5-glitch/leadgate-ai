import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  token: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your LeadGate AI password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 24px; margin: 0;">LeadGate AI</h1>
        </div>
        <h2 style="color: #111827; font-size: 20px;">Reset your password</h2>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to choose a new password. This link expires in 1 hour.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Reset Password
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.5;">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 11px;">
          If the button above doesn't work, copy and paste this link into your browser:<br />
          <a href="${resetLink}" style="color: #4f46e5; word-break: break-all;">${resetLink}</a>
        </p>
      </div>
    `,
  });
}
