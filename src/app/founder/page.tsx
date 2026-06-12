import type { Metadata } from "next";
import FounderPageClient from "./founder-client";

export const metadata: Metadata = {
  title: "Meet the Founder · LeadGate AI",
  description:
    "Kevin Ghai built LeadGate AI to filter out tire-kickers so coaches only take calls with buyers ready to invest.",
};

export default function FounderPage() {
  return <FounderPageClient />;
}
