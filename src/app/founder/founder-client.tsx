"use client";

import { Nav, Footer, LandingStyles, Founder, useScrollReveal, AUDIT_FUNNEL_URL } from "../landing-client";

export default function FounderPageClient() {
  useScrollReveal();
  return (
    <div className="lg-root lg-grain">
      <LandingStyles />
      <Nav onCTA={() => window.location.assign(AUDIT_FUNNEL_URL)} />
      <main style={{ paddingTop: 72 }}>
        <Founder />
      </main>
      <Footer />
    </div>
  );
}
