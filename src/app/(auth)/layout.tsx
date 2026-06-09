import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="dashboard-dark"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at top, #0e0a04 0%, #050402 55%, #020202 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Faint grid overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,216,124,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,216,124,0.025) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <Link
        href="/"
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
          textDecoration: "none",
          zIndex: 2,
        }}
      >
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient
              id="lgAuthLayoutLogo"
              x1="0"
              y1="0"
              x2="24"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#a47a1e" />
              <stop offset=".35" stopColor="#ffec94" />
              <stop offset=".65" stopColor="#e6be69" />
              <stop offset="1" stopColor="#956d13" />
            </linearGradient>
          </defs>
          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="url(#lgAuthLayoutLogo)" />
        </svg>
        <span
          style={{
            fontSize: 19,
            fontWeight: 600,
            color: "#f5f1e6",
            letterSpacing: "-0.01em",
          }}
        >
          LeadGate <span style={{ color: "#ffd87c" }}>AI</span>
        </span>
      </Link>

      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}
