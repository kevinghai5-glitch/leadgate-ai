import type { Metadata } from "next";
import FounderPageClient from "./founder-client";

export const metadata: Metadata = {
  title: "Meet the Founder · LeadGate AI",
  description:
    "Kevin Ghai built LeadGate AI to filter out tire-kickers so local businesses only take calls with buyers ready to book.",
};

export default function FounderPage() {
  return <FounderPageClient />;
}
