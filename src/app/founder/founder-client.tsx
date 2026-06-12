"use client";

import { useRouter } from "next/navigation";
import { Nav, Footer, LandingStyles, Founder, useScrollReveal } from "../landing-client";

export default function FounderPageClient() {
  const router = useRouter();
  useScrollReveal();
  return (
    <div className="lg-root lg-grain">
      <LandingStyles />
      <Nav onCTA={() => router.push("/signup")} />
      <main style={{ paddingTop: 72 }}>
        <Founder />
      </main>
      <Footer />
    </div>
  );
}
