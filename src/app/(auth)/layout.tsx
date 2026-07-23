import Image from "next/image";
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 9,
          marginBottom: 28,
          textDecoration: "none",
          zIndex: 2,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Image
            src="/leadgate-logo.png"
            alt=""
            width={28}
            height={28}
            priority
            style={{ borderRadius: 7, display: "block" }}
          />
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
        </span>

        {/* Parent-brand lockup — LeadGate is a retainer within ReclaimedHQ. */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#8a7d6e",
            whiteSpace: "nowrap",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 18,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,216,124,0.45))",
            }}
          />
          A <span style={{ color: "#cba75c" }}>ReclaimedHQ</span> system
          <span
            aria-hidden="true"
            style={{
              width: 18,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(255,216,124,0.45), transparent)",
            }}
          />
        </span>
      </Link>

      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}
