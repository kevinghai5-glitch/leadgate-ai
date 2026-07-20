import Link from "next/link";

/**
 * Public signup is closed. LeadGate is no longer self-serve — it is provisioned
 * for ReclaimedHQ agency clients. This page is a static notice; the account
 * creation API (/api/auth/signup) is gated behind ADMIN_SIGNUP_KEY, and Google
 * OAuth self-signup is blocked in src/lib/auth.ts. Stripe/checkout code is left
 * intact but dormant.
 */
export default function SignupPage() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          width: 720,
          height: 720,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255, 216, 124, 0.14) 0%, rgba(255, 216, 124, 0.05) 35%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "min(440px, 100%)" }}>
        <div
          style={{
            position: "relative",
            padding: 2,
            borderRadius: 22,
            background:
              "linear-gradient(140deg, rgba(255, 216, 124, 0.55) 0%, rgba(255, 216, 124, 0.08) 35%, rgba(255, 216, 124, 0.02) 65%, rgba(255, 216, 124, 0.35) 100%)",
            boxShadow:
              "0 30px 80px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 216, 124, 0.04)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, #0a0805 0%, #07060a 100%)",
              borderRadius: 20,
              padding: "40px 36px 32px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 18,
                padding: "5px 10px",
                borderRadius: 999,
                background: "rgba(255, 216, 124, 0.06)",
                border: "1px solid rgba(255, 216, 124, 0.18)",
                fontSize: 10,
                fontWeight: 600,
                color: "#ffd87c",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#ffd87c",
                  boxShadow: "0 0 8px rgba(255, 216, 124, 0.7)",
                }}
              />
              Invite only
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                fontWeight: 600,
                color: "#f5f1e6",
              }}
            >
              LeadGate is available through ReclaimedHQ.
            </h1>
            <p
              style={{
                margin: "12px 0 28px",
                fontSize: 14,
                color: "#a49e8e",
                lineHeight: 1.6,
              }}
            >
              LeadGate isn&apos;t self-serve. It&apos;s set up for you as part of
              your ReclaimedHQ engagement. If you&apos;re already a client, your
              account has been created for you — just sign in.
            </p>

            <Link
              href="/login"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 15,
                color: "#1a1200",
                textDecoration: "none",
                background:
                  "linear-gradient(110deg, #a47a1e 0%, #ffec94 35%, #e6be69 65%, #a47a1e 100%)",
                boxShadow:
                  "0 1px 0 rgba(255, 240, 200, 0.45) inset, 0 12px 32px rgba(255, 216, 124, 0.18)",
              }}
            >
              Sign in to your account
            </Link>

            <div
              style={{
                marginTop: 22,
                paddingTop: 22,
                borderTop: "1px solid rgba(255, 216, 124, 0.08)",
                fontSize: 13,
                color: "#a49e8e",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Want LeadGate for your business? Reach out to ReclaimedHQ to get
              set up.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
