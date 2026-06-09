"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, getProviders } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [returning, setReturning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Detect returning users + prefill last-used email from cookie.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const parts = document.cookie.split("; ");
    const get = (k: string) =>
      parts.find((p) => p.startsWith(k + "="))?.slice(k.length + 1);
    const last = get("lg_last_email");
    if (last) setEmail(decodeURIComponent(last));
    if (get("lg_returning") === "1") setReturning(true);
  }, []);

  // Probe whether Google provider is configured.
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

  const greeting = useMemo(() => {
    if (returning && email) {
      const handle = email.split("@")[0];
      const nice = handle
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
      return `Welcome back, ${nice}.`;
    }
    return returning ? "Welcome back." : "Sign in to LeadGate AI.";
  }, [returning, email]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }
      router.push("/dashboard");
      router.refresh();
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
      toast.error("Could not start Google sign-in. Please try again.");
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
        @keyframes lgAuthFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
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

      {/* Ambient gold glow behind the card */}
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
        {/* Card */}
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
              Secure sign-in
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
              {greeting}
            </h1>
            <p
              style={{
                margin: "10px 0 28px",
                fontSize: 14,
                color: "#a49e8e",
                lineHeight: 1.55,
              }}
            >
              {returning
                ? "Pick up where you left off — your pipeline is ready."
                : "Log in to manage your lead qualification pipeline."}
            </p>

            {/* Google */}
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
                  {googleLoading ? "Redirecting…" : "Continue with Google"}
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
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 216, 124, 0.18))",
                    }}
                  />
                  <span>or</span>
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background:
                        "linear-gradient(90deg, rgba(255, 216, 124, 0.18), transparent)",
                    }}
                  />
                </div>
              </>
            )}

            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "#a49e8e",
                    marginBottom: 8,
                    fontWeight: 500,
                    letterSpacing: "0.01em",
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@coaching.com"
                  disabled={isLoading}
                  className="lg-auth-input"
                />
              </div>

              <div style={{ marginBottom: 22 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <label
                    htmlFor="password"
                    style={{
                      fontSize: 12,
                      color: "#a49e8e",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Password
                  </label>
                  <Link href="/forgot-password" className="lg-auth-link" style={{ fontSize: 12 }}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Your password"
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
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
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
              New to LeadGate?{" "}
              <Link href="/signup" className="lg-auth-link" style={{ fontWeight: 500 }}>
                Create an account
              </Link>
            </div>
          </div>
        </div>

        {/* Trust line under card */}
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
          Encrypted in transit · SOC 2-aligned · Trusted by 1,250+ coaches
        </div>
      </div>
    </>
  );
}

function GoogleGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44a20 20 0 0 0 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28.6L6.2 33.7A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4 5.6l6.2 5.2c-.4.4 6.5-4.8 6.5-14.8 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
