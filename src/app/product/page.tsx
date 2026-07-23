import LandingClient from "../landing-client";

/**
 * Parked marketing page. No longer the front door (see src/app/page.tsx) — kept
 * reachable by direct URL in case the full landing is ever wanted again.
 */
export default function ProductPage() {
  return <LandingClient />;
}
