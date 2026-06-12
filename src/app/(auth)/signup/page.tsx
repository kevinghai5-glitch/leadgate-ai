"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, getProviders } from "next-auth/react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProviders()
      .then((p) => {
        if (!cancelled) setGoogleAvailable(!!p?.google);
      })
      .catch(() => {
        if (!cancelled) setGoogleAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Failed to create account");
        return;
      }
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      toast.error("Could not start Google sign-up. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes lgAuthShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes lgAuthAmbient {
          0%, 100% { transform: translate3d(-50%, -50%, 0) scale(1); opacity: 0.55; }
          50% { transform: translate3d(-50%, -50%, 0) scale(1.08); opacity: 0.75; }
        }
        @keyframes lgAuthFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lg-auth-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          background: #0c0a06;
          border: 1px solid rgba(255, 216, 124, 0.12);
          color: #f5f1e6;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .lg-auth-input::placeholder { color: #5e574a; }
        .lg-auth-input:focus {
          border-color: rgba(255, 216, 124, 0.55);
          background: #0e0b06;
          box-shadow: 0 0 0 4px rgba(255, 216, 124, 0.08);
        }
        .lg-auth-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .lg-auth-gold-btn {
          position: relative;
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          font-family: inherit;
          color: #1a1200;
          background: linear-gradient(110deg, #a47a1e 0%, #ffec94 35%, #e6be69 65%, #a47a1e 100%);
          background-size: 200% 200%;
          animation: lgAuthShimmer 6s ease-in-out infinite;
          box-shadow:
            0 1px 0 rgba(255, 240, 200, 0.45) inset,
            0 -1px 0 rgba(0, 0, 0, 0.25) inset,
            0 12px 32px rgba(255, 216, 124, 0.18);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }
        .lg-auth-gold-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow:
            0 1px 0 rgba(255, 240, 200, 0.55) inset,
            0 -1px 0 rgba(0, 0, 0, 0.25) inset,
            0 16px 38px rgba(255, 216, 124, 0.28);
        }
        .lg-auth-gold-btn:disabled { opacity: 0.7; cursor: default; }
        .lg-auth-ghost-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          background: #0c0a06;
          color: #f5f1e6;
          border: 1px solid rgba(255, 216, 124, 0.18);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.18s ease;
          font-family: inherit;
        }
        .lg-auth-ghost-btn:hover:not(:disabled) {
          background: #100c07;
          border-color: rgba(255, 216, 124, 0.32);
        }
        .lg-auth-ghost-btn:disabled { opacity: 0.6; cursor: default; }
        .lg-auth-link {
          color: #ffd87c;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .lg-auth-link:hover { color: #ffec94; text-decoration: underline; }
        .lg-pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #7d7666;
          cursor: pointer;
          padding: 6px;
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.15s ease;
        }
        .lg-pw-toggle:hover { color: #ffd87c; }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          width: 720,
          height: 720,
          background:
            "radial-gradient(circle, rgba(255, 216, 124, 0.18) 0%, rgba(255, 216, 124, 0.06) 35%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
          animation: "lgAuthAmbient 9s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(440px, 100%)",
          animation: "lgAuthFadeUp 0.5s cubic-bezier(.2,.7,.2,1)",
        }}
      >
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
              Start free
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 30,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                fontWeight: 600,
                color: "#f5f1e6",
              }}
            >
              Create your account.
            </h1>
            <p
              style={{
                margin: "10px 0 28px",
                fontSize: 14,
                color: "#a49e8e",
                lineHeight: 1.55,
              }}
            >
              Start qualifying leads with AI in minutes — no credit card required.
            </p>

            {googleAvailable !== false && (
              <>
                <button
                  type="button"
                  onClick={onGoogle}
                  disabled={googleLoading || googleAvailable === null}
                  className="lg-auth-ghost-btn"
                  style={{ marginBottom: 16 }}
                >
                  <GoogleGlyph />
                  {googleLoading ? "Redirecting…" : "Sign up with Google"}
                </button>

                <div
                  aria-hidden="true"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    margin: "4px 0 18px",
                    color: "#5e574a",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255, 216, 124, 0.18))" }} />
                  <span>or</span>
                  <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255, 216, 124, 0.18), transparent)" }} />
                </div>
              </>
            )}

            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "#a49e8e",
                    marginBottom: 8,
                    fontWeight: 500,
                  }}
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Doe"
                  disabled={isLoading}
                  className="lg-auth-input"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "#a49e8e",
                    marginBottom: 8,
                    fontWeight: 500,
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@coaching.com"
                  disabled={isLoading}
                  className="lg-auth-input"
                />
              </div>

              <div style={{ marginBottom: 22 }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "#a49e8e",
                    marginBottom: 8,
                    fontWeight: 500,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    disabled={isLoading}
                    className="lg-auth-input"
                    style={{ paddingRight: 64 }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="lg-pw-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="lg-auth-gold-btn"
              >
                {isLoading ? "Creating account…" : "Create account"}
              </button>

              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 11,
                  color: "#6a6458",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                By continuing you agree to our{" "}
                <Link href="/terms" className="lg-auth-link">Terms</Link>{" "}
                &amp;{" "}
                <Link href="/privacy" className="lg-auth-link">Privacy Policy</Link>.
              </p>
            </form>

            <div
              style={{
                marginTop: 22,
                paddingTop: 22,
                borderTop: "1px solid rgba(255, 216, 124, 0.08)",
                fontSize: 13,
                color: "#a49e8e",
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Link href="/login" className="lg-auth-link" style={{ fontWeight: 500 }}>
                Sign in
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "#6a6458",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 8px rgba(74, 222, 128, 0.6)",
            }}
          />
          Encrypted in transit · Your leads stay private
        </div>
      </div>
    </>
  );
}

function GoogleGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28.6L6.2 33.7A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4 5.6l6.2 5.2c-.4.4 6.5-4.8 6.5-14.8 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
