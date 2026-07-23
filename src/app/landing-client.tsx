"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Prospect funnel ────────────────────────────────────────────────────────
// LeadGate is provisioned through ReclaimedHQ, not sold self-serve. Every
// prospect CTA on this site points at the free-audit funnel; existing clients
// go to /login. TODO(kevin): if a direct booking link ever converts better
// than the funnel, set NEXT_PUBLIC_AUDIT_FUNNEL_URL — no code change needed.
export const AUDIT_FUNNEL_URL =
  process.env.NEXT_PUBLIC_AUDIT_FUNNEL_URL || "https://reclaimed-hq.agency/";

// ─── Data ──────────────────────────────────────────────────────────────────

type BadLead = {
  id: number;
  name: string;
  initials: string;
  color: string;
  status: string;
  reason: string;
};

type GoodLead = {
  id: number;
  name: string;
  initials: string;
  status: string;
  score: number;
  reason: string;
  meta: string;
};

const BAD_LEADS: BadLead[] = [
  { id: 1, name: "Mike R.", initials: "MR", color: "#c26b5e", status: "Price shopper", reason: "Just wants the cheapest quote. No timeline, comparing five companies." },
  { id: 2, name: "Sarah T.", initials: "ST", color: "#a87455", status: "Tire-kicker", reason: "Gathering quotes for 'someday.' No real intent to book anything." },
  { id: 3, name: "David L.", initials: "DL", color: "#b5825e", status: "Out of area", reason: "Outside your service area. Can't be helped even if booked." },
  { id: 4, name: "James K.", initials: "JK", color: "#986650", status: "Wrong fit", reason: "Looking for a free DIY fix, not the actual service you offer." },
  { id: 5, name: "Alex P.", initials: "AP", color: "#a07355", status: "No-show risk", reason: "Signals: vague problem, won't commit to a callback time." },
];

const GOOD_LEADS: GoodLead[] = [
  { id: 1, name: "Emma B.", initials: "EB", status: "Qualified", score: 9.4, reason: "Knows exactly what she needs. Budget approved. Ready to book this week.", meta: "Ready to book · Budget confirmed" },
  { id: 2, name: "John D.", initials: "JD", status: "Qualified", score: 9.1, reason: "Urgent issue, wants it handled now. Has hired pros before. High intent.", meta: "Urgent · Decision-maker" },
  { id: 3, name: "Lisa M.", initials: "LM", status: "Qualified", score: 8.8, reason: "Clear scope, realistic timeline, already asked about availability.", meta: "Clear scope · Motivated" },
  { id: 4, name: "Mark S.", initials: "MS", status: "Qualified", score: 9.6, reason: "Repeat-customer type. Knows the process, decisive, pays upfront.", meta: "Repeat type · Pays upfront" },
  { id: 5, name: "Rachel W.", initials: "RW", status: "Qualified", score: 9.0, reason: "Hard deadline, specific need, budget ready to go.", meta: "Hard deadline · Motivated" },
];

// Overlapping AI-score chips shown where a stock-photo avatar cluster used to
// be. The page promises "no staged screenshots, no invented testimonials" —
// so the imagery is the product (scores), not stock faces posing as customers.
const SCORE_CHIPS = [
  { label: "9.4", color: "#7fe2a8" },
  { label: "8.8", color: "#ffd87c" },
  { label: "9.1", color: "#7fe2a8" },
  { label: "2.1", color: "#ff8a8a" },
];

const LOGOS = [
  { name: "Instagram", logo: "instagram" },
  { name: "TikTok", logo: "tiktok" },
  { name: "YouTube", logo: "youtube" },
  { name: "Stan", logo: "stan" },
  { name: "Linktree", logo: "linktree" },
  { name: "Email", logo: "email" },
  { name: "Website", logo: "website" },
];

const FEATURES = [
  { icon: "gauge", title: "AI lead scoring (1–10)", desc: "Every prospect gets scored on budget fit, timeline, motivation, and readiness. You set the threshold." },
  { icon: "gate", title: "The lead gate", desc: "Only prospects above your minimum score see your booking calendar. Everyone else gets a polite follow-up." },
  { icon: "form", title: "Questions built for your business", desc: "Qualifying questions tailored to your services and area, short text, long text, or dropdown. We build them with you during onboarding; you can tweak them anytime." },
  { icon: "calendar", title: "Booking calendar integration", desc: "Qualified leads land on your booking calendar the second they're approved and book on the spot." },
  { icon: "chart", title: "Analytics dashboard", desc: "Total leads, qualification rate, projected revenue, all at a glance. Know who's worth following up." },
  { icon: "code", title: "Embed anywhere", desc: "Your form lives on a shareable link or embeds on your website, we wire it into your site and campaigns during onboarding." },
];

const STEPS = [
  { num: "01", title: "Prospects fill out your form", desc: "We wire the form into your site and campaigns during onboarding. Prospects answer questions about their needs, timeline, and budget." },
  { num: "02", title: "AI identifies serious buyers", desc: "Our AI scores every prospect on intent, budget fit, and readiness, so you know exactly who's ready to actually book and pay." },
  { num: "03", title: "Qualified leads book instantly", desc: "High-scoring prospects land on your booking calendar and book on the spot. Low-intent leads get a polite follow-up." },
];

const PAINS = [
  { quote: "I just spent 30 minutes quoting someone who was never going to book.", label: "wasted estimates" },
  { quote: "My phone rings all day. My bank account doesn't show it.", label: "busy but not booked" },
  { quote: "Half the people who call never show. The other half just want a free quote.", label: "low-intent leads" },
];

const FAQS = [
  { q: "How do I get LeadGate?", a: "Through ReclaimedHQ. It starts with a free audit of where your current funnel leaks leads. If we're a fit, we build your conversion system done-for-you, and LeadGate runs inside the monthly management plan from day one." },
  { q: "Can I buy LeadGate on its own?", a: "No, and that's deliberate. LeadGate is the qualification layer of a bigger system: your booking calendar, follow-up automations, and CRM wiring. Standalone, it would be a smart form with nothing behind it. It only produces results running on the system we build and manage for you." },
  { q: "Do I have to set anything up?", a: "No. Setup is done for you during onboarding: we tailor the qualifying questions to your services and area, set your qualifying threshold, wire the form into your site and campaigns, and connect your booking calendar. You get a dashboard with every scored lead; we handle the plumbing." },
  { q: "How does the lead scoring work?", a: "Our AI evaluates each prospect on budget fit, timeline, motivation level, and overall readiness. Each lead gets a score from 1–10. Leads at or above your qualifying threshold see your booking calendar instantly; everyone else gets a polite follow-up instead of a slot on your calendar." },
  { q: "Does it work with my calendar and CRM?", a: "Yes. Qualified leads are routed straight to your booking calendar, and every scored lead lands in your CRM pipeline with its score, the AI's reasoning, and the prospect's answers attached, all wired up as part of your build." },
  { q: "What happens to the leads it filters out?", a: "They don't vanish. Disqualified leads are tagged and dropped into your nurture pipeline automatically, so price shoppers and not-ready-yets get followed up with over time instead of wasting a call slot today." },
];

const WORKFLOW_BEFORE = [
  "Every form fill lands on your calendar",
  "You find out the budget on the call",
  "Tire-kickers and \u201Cjust looking\u201D book freely",
  "Prep time burned on dead-end conversations",
  "Show-up rates are a coin flip",
];

const WORKFLOW_AFTER = [
  "AI scores every lead 1\u201310 before booking",
  "Budget, timeline, and intent known up front",
  "Only leads above your threshold see the calendar",
  "Your week fills with serious, qualified buyers",
  "You walk into every call already in context",
];

// ─── Icons ─────────────────────────────────────────────────────────────────

type IconProps = {
  name: string;
  size?: number;
  stroke?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function Icon({ name, size = 20, stroke = 1.5, className = "", style = {} }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    style,
  };
  switch (name) {
    case "bolt":
      return <svg {...common}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></svg>;
    case "check":
      return <svg {...common}><path d="M20 6L9 17l-5-5" /></svg>;
    case "x":
      return <svg {...common}><path d="M18 6L6 18M6 6l12 12" /></svg>;
    case "arrow-right":
      return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7" /></svg>;
    case "arrow-up-right":
      return <svg {...common}><path d="M7 17L17 7M7 7h10v10" /></svg>;
    case "play":
      return <svg {...common}><path d="M6 4l14 8-14 8V4z" fill="currentColor" /></svg>;
    case "play-circle":
      return <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" /></svg>;
    case "video":
      return <svg {...common}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3v-4z" /></svg>;
    case "sparkle":
      return <svg {...common}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 3l.6 1.6L21 5l-1.4.4L19 7l-.6-1.6L17 5l1.4-.4L19 3zM5 15l.6 1.6L7 17l-1.4.4L5 19l-.6-1.6L3 17l1.4-.4L5 15z" /></svg>;
    case "brain":
      return <svg {...common}><path d="M12 2a4 4 0 0 0-4 4v0a4 4 0 0 0-4 4v2a4 4 0 0 0 2 3.5V19a3 3 0 0 0 6 0v-1M12 2a4 4 0 0 1 4 4v0a4 4 0 0 1 4 4v2a4 4 0 0 1-2 3.5V19a3 3 0 0 1-6 0V2z" /><path d="M8 10h.01M16 10h.01M9 14h6" /></svg>;
    case "gate":
      return <svg {...common}><path d="M3 21V7l9-4 9 4v14M3 21h18M9 21v-6h6v6M9 11h6" /></svg>;
    case "sliders":
      return <svg {...common}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>;
    case "calendar":
      return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
    case "chart":
      return <svg {...common}><path d="M3 3v18h18M7 15l4-4 3 3 6-6" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "filter":
      return <svg {...common}><path d="M3 5h18l-7 8v6l-4-2v-4L3 5z" /></svg>;
    case "trending-up":
      return <svg {...common}><path d="M3 17l6-6 4 4 8-8M15 7h6v6" /></svg>;
    case "target":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></svg>;
    case "form":
      return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>;
    case "code":
      return <svg {...common}><path d="M8 9l-3 3 3 3M16 9l3 3-3 3M13 7l-2 10" /></svg>;
    case "gauge":
      return <svg {...common}><path d="M12 14l4-4M5 18a9 9 0 1 1 14 0" /><circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" /></svg>;
    case "chat":
      return <svg {...common}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3a8.38 8.38 0 0 1 8.5 8.5z" /></svg>;
    case "logo":
      return (
        <Image
          src="/leadgate-logo.png"
          alt="LeadGate AI"
          width={size}
          height={size}
          priority
          className={className}
          style={{ borderRadius: Math.round(size * 0.24), display: "block", ...style }}
        />
      );
    case "quote":
      return <svg {...common} stroke="none" fill="currentColor"><path d="M7 7h4v4H9c0 2 1 3 3 3v2c-3 0-5-2-5-5V7zm8 0h4v4h-2c0 2 1 3 3 3v2c-3 0-5-2-5-5V7z" /></svg>;
    default:
      return null;
  }
}

function BrandLogo({ name }: { name: string }) {
  const wrap: React.CSSProperties = {
    height: 22,
    opacity: 0.55,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 600,
    fontSize: 18,
    color: "#e8e2d0",
  };
  switch (name) {
    case "instagram":
      return (
        <div style={wrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
          <span>Instagram</span>
        </div>
      );
    case "tiktok":
      return (
        <div style={{ ...wrap, fontWeight: 700, fontSize: 19 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8.5a6 6 0 0 1-4-1.5v7.5a5.5 5.5 0 1 1-5.5-5.5c.34 0 .67.03 1 .1v2.6a3 3 0 1 0 2 2.8V3h2.5a3.5 3.5 0 0 0 3.5 3.5v2z" /></svg>
          <span>TikTok</span>
        </div>
      );
    case "youtube":
      return (
        <div style={{ ...wrap, fontWeight: 700 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M10 9l5 3-5 3V9z" fill="currentColor" /></svg>
          <span>YouTube</span>
        </div>
      );
    case "stan":
      return (
        <div style={{ ...wrap, fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 8h8a3 3 0 0 1 0 6H10a3 3 0 0 0 0 6h8M5 4v16M19 4v16" /></svg>
          <span>Stan</span>
        </div>
      );
    case "linktree":
      return (
        <div style={wrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v8M5 7l7 4 7-4M9 21v-6M15 21v-6M12 11v10" /></svg>
          <span>Linktree</span>
        </div>
      );
    case "email":
      return (
        <div style={wrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></svg>
          <span>Email</span>
        </div>
      );
    case "website":
      return (
        <div style={wrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18M7 6h.01M10 6h.01" /></svg>
          <span>Your Site</span>
        </div>
      );
    default:
      return null;
  }
}

// ─── Nav ───────────────────────────────────────────────────────────────────

export function Nav({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  React.useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const links = [
    { label: "How It Works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "How to Get It", href: "#pricing" },
    { label: "Meet the Founder", href: "/founder" },
    { label: "FAQ", href: "#faq" },
  ];

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Real route links (e.g. /founder) navigate normally.
    if (href.startsWith("/")) {
      setMenuOpen(false);
      return;
    }
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Anchor target lives on the landing page, go there.
      window.location.href = "/" + href;
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all .3s ease",
        background:
          scrolled || menuOpen ? "rgba(7,7,7,0.92)" : "transparent",
        backdropFilter:
          scrolled || menuOpen ? "blur(18px) saturate(140%)" : "none",
        WebkitBackdropFilter:
          scrolled || menuOpen ? "blur(18px) saturate(140%)" : "none",
        borderBottom:
          scrolled || menuOpen
            ? "1px solid rgba(255,216,124,0.08)"
            : "1px solid transparent",
      }}
    >
      <nav className="lg-nav">
        <a
          href="#top"
          onClick={(e) => smoothScroll(e, "#top")}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <Icon name="logo" size={28} />
          <span style={{ fontWeight: 700, fontSize: 19, letterSpacing: "-0.02em", color: "#f5f1e6" }}>
            LeadGate <span className="lg-gold-text">AI</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="lg-nav-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => smoothScroll(e, l.href)}
              style={{ color: "#c9c2b0", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color .2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffec94")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c9c2b0")}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="lg-nav-cta">
          <Link
            href="/login"
            className="lg-btn-ghost"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              background: "transparent",
              border: "none",
              color: "#c9c2b0",
              textDecoration: "none",
            }}
          >
            Client login
          </Link>
          <button
            className="lg-btn-gold"
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 14,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={onCTA}
          >
            See If You Qualify <Icon name="arrow-right" size={14} stroke={2.2} />
          </button>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="lg-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`lg-hamburger-bar ${menuOpen ? "open-1" : ""}`} />
          <span className={`lg-hamburger-bar ${menuOpen ? "open-2" : ""}`} />
          <span className={`lg-hamburger-bar ${menuOpen ? "open-3" : ""}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className="lg-mobile-drawer"
        style={{
          maxHeight: menuOpen ? "100vh" : 0,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        aria-hidden={!menuOpen}
      >
        <div style={{ padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: 6 }}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => smoothScroll(e, l.href)}
              style={{
                color: "#e5dfcc",
                textDecoration: "none",
                fontSize: 17,
                fontWeight: 500,
                padding: "14px 4px",
                borderBottom: "1px solid rgba(255,216,124,0.06)",
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="lg-btn-ghost"
              style={{
                padding: "13px 18px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                textAlign: "center",
                textDecoration: "none",
                color: "#e5dfcc",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Client login
            </Link>
            <button
              className="lg-btn-gold"
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onClick={() => {
                setMenuOpen(false);
                onCTA();
              }}
            >
              See If You Qualify <Icon name="arrow-right" size={14} stroke={2.2} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function BadCalendarCard({
  activeId,
  setActiveId,
}: {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) {
  return (
    <div
      style={{
        background: "#0d0d0d",
        border: "1px solid rgba(255,92,92,0.18)",
        borderRadius: 18,
        padding: 22,
        position: "relative",
        boxShadow: "0 20px 50px -20px rgba(0,0,0,0.8)",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#ff8a8a", fontWeight: 600, marginBottom: 8 }}>
          Without LeadGate
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f5f1e6" }}>Your Calendar</h4>
          <p style={{ margin: 0, fontSize: 12, color: "#8a7d6e", textAlign: "right" }}>Anyone can book.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2, position: "relative" }}>
        {BAD_LEADS.map((lead) => {
          const active = activeId === `bad-${lead.id}`;
          return (
            <div
              key={lead.id}
              className={`lg-lead-row ${active ? "active" : ""}`}
              onMouseEnter={() => setActiveId(`bad-${lead.id}`)}
              onMouseLeave={() => setActiveId(null)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderRadius: 10, position: "relative" }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: lead.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  flexShrink: 0,
                  opacity: active ? 1 : 0.75,
                }}
              >
                {lead.initials}
              </div>
              <div style={{ flex: 1, fontSize: 13, color: "#b8b0a0", fontWeight: 500 }}>{lead.name}</div>
              <div
                style={{
                  color: "#ff8a8a",
                  fontWeight: 500,
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: "rgba(255,92,92,0.08)",
                  border: "1px solid rgba(255,92,92,0.15)",
                  letterSpacing: "0.02em",
                }}
              >
                {lead.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GoodCalendarCard({
  activeId,
  setActiveId,
}: {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) {
  return (
    <div
      className="lg-gold-border"
      style={{
        borderRadius: 18,
        padding: 22,
        position: "relative",
        boxShadow: "0 20px 60px -15px rgba(255,216,124,0.25), 0 0 0 1px rgba(255,216,124,0.08)",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -12,
          right: 28,
          background: "var(--lg-gold-gradient)",
          backgroundSize: "200% 200%",
          color: "#1a1200",
          fontSize: 10,
          fontWeight: 700,
          padding: "5px 12px",
          borderRadius: 999,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          boxShadow: "0 4px 14px rgba(255,216,124,0.4)",
        }}
      >
        With LeadGate ✦
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="lg-gold-text" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8 }}>
          With LeadGate
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f5f1e6" }}>Your Calendar</h4>
          <p style={{ margin: 0, fontSize: 12, color: "#8a7d6e", textAlign: "right" }}>Qualified only.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {GOOD_LEADS.map((lead) => {
          const active = activeId === `good-${lead.id}`;
          return (
            <div
              key={lead.id}
              className={`lg-lead-row ${active ? "active" : ""}`}
              onMouseEnter={() => setActiveId(`good-${lead.id}`)}
              onMouseLeave={() => setActiveId(null)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderRadius: 10 }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--lg-gold-gradient)",
                  color: "#1a1200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: "0 0 0 1px rgba(255,216,124,0.4)",
                }}
              >
                {lead.initials}
              </div>
              <div style={{ flex: 1, fontSize: 13, color: "#f5f1e6", fontWeight: 500 }}>{lead.name}</div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: "rgba(127,226,168,0.1)",
                  border: "1px solid rgba(127,226,168,0.25)",
                  color: "#7fe2a8",
                  letterSpacing: "0.02em",
                }}
              >
                Qualified
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReasoningPopover({ activeId }: { activeId: string | null }) {
  if (!activeId) return null;
  const [type, idStr] = activeId.split("-");
  const id = parseInt(idStr, 10);
  const isGood = type === "good";
  const lead = isGood ? GOOD_LEADS.find((l) => l.id === id) : BAD_LEADS.find((l) => l.id === id);
  if (!lead) return null;
  const score = isGood ? (lead as GoodLead).score : undefined;
  const meta = isGood ? (lead as GoodLead).meta : undefined;

  return (
    <div
      style={{
        position: "absolute",
        bottom: -120,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        background: "#0a0a0a",
        border: `1px solid ${isGood ? "rgba(255,216,124,0.35)" : "rgba(255,92,92,0.3)"}`,
        borderRadius: 14,
        padding: "14px 18px",
        width: "min(520px, 90vw)",
        boxShadow: `0 20px 50px -10px ${isGood ? "rgba(255,216,124,0.25)" : "rgba(255,92,92,0.15)"}`,
        animation: "lgFadeUp .25s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Icon name="brain" size={14} style={{ color: isGood ? "#ffd87c" : "#ff8a8a" }} />
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: isGood ? "#ffd87c" : "#ff8a8a" }}>
          AI Reasoning · {lead.name}
        </div>
        {isGood && score !== undefined && (
          <div className="lg-gold-text" style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700 }}>
            Score {score.toFixed(1)}/10
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#d4cdbc", lineHeight: 1.5 }}>{lead.reason}</div>
      {meta && <div style={{ marginTop: 6, fontSize: 11, color: "#8a7d6e" }}>{meta}</div>}
    </div>
  );
}

const HERO_BENEFITS = [
  { t: "Eliminate time-wasters", icon: "filter" },
  { t: "Increase show-up rates", icon: "trending-up" },
  { t: "Book more qualified jobs", icon: "target" },
];

function RotatingBenefits() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % HERO_BENEFITS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const { t, icon } = HERO_BENEFITS[i];
  return (
    <div style={{ height: 36, margin: "0 0 36px 0", display: "flex", alignItems: "center", gap: 14 }}>
      <div
        key={i}
        className="lg-benefit-swap"
        style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 400, color: "#cfc8b8" }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffd87c",
            flexShrink: 0,
          }}
        >
          <Icon name={icon} size={20} stroke={2} />
        </span>
        {t}
      </div>
      <div aria-hidden="true" style={{ display: "flex", gap: 6, marginLeft: 4 }}>
        {HERO_BENEFITS.map((_, j) => (
          <span
            key={j}
            style={{
              width: j === i ? 18 : 6,
              height: 6,
              borderRadius: 999,
              background: j === i ? "#ffd87c" : "rgba(255,216,124,0.25)",
              transition: "width .35s ease, background .35s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Hero({ onCTA, onVideo }: { onCTA: () => void; onVideo: () => void }) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  return (
    <section id="top" className="lg-bg-gold-glow lg-hero-section" style={{ position: "relative", overflow: "hidden" }}>
      <div className="lg-dot-grid" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 240, pointerEvents: "none" }} />

      <div className="lg-hero-grid">
        {/* LEFT */}
        <div className="lg-hero-enter">
          <h1 style={{ fontSize: "clamp(44px, 5.2vw, 72px)", lineHeight: 1.02, margin: 0, fontWeight: 600, letterSpacing: "-0.035em", color: "#f5f1e6" }}>
            Stop losing the{" "}
            <span className="lg-gold-text" style={{ fontWeight: 500 }}>leads</span>
            <br />
            you already
            <br />
            paid for.
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.55, color: "#a49e8e", marginTop: 24, marginBottom: 28, maxWidth: 520 }}>
            LeadGate qualifies every inbound lead the second it arrives and routes serious buyers straight to your calendar, while price shoppers and tire-kickers get filtered out automatically. Included as part of the ReclaimedHQ conversion-recovery service.
          </p>

          <RotatingBenefits />

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              className="lg-btn-gold"
              onClick={onCTA}
              style={{ padding: "14px 24px", borderRadius: 12, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            >
              See If Your Business Qualifies <Icon name="arrow-right" size={15} stroke={2.4} />
            </button>
            <button
              className="lg-btn-ghost"
              onClick={onVideo}
              style={{ padding: "14px 22px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500, fontSize: 16 }}
            >
              <Icon name="play-circle" size={18} stroke={2} style={{ color: "#ffd87c" }} />
              See How It Works
            </button>
          </div>

        </div>

        {/* RIGHT */}
        <div className="lg-hero-right-enter" style={{ position: "relative" }}>
          <div className="lg-hero-compare lg-mobile-swipe" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start", position: "relative" }}>
            <BadCalendarCard activeId={activeId} setActiveId={setActiveId} />
            <GoodCalendarCard activeId={activeId} setActiveId={setActiveId} />

            <div
              className="lg-hero-arrow"
              style={{
                position: "absolute",
                left: "50%",
                top: "42%",
                transform: "translate(-50%,-50%)",
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--lg-gold-gradient)",
                backgroundSize: "200% 200%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 30px rgba(255,216,124,0.4)",
                animation: "lgPulseRing 1.8s ease-out infinite",
                color: "#1a1200",
                zIndex: 5,
              }}
            >
              <Icon name="arrow-right" size={20} stroke={2.5} />
            </div>
          </div>

          <ReasoningPopover activeId={activeId} />

          <div className="lg-hero-hint" style={{ position: "absolute", top: -34, left: 0, fontSize: 11, color: "#6a6458", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd87c", animation: "lgPulseRing 1.5s ease-out infinite" }} />
            Hover any lead to see AI reasoning
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Mini widgets (Social proof bar) ───────────────────────────────────────

function MiniAIScore() {
  const [score, setScore] = React.useState(8.7);
  React.useEffect(() => {
    const scores = [8.7, 9.2, 7.6, 9.4, 8.1, 9.0, 8.8];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % scores.length;
      setScore(scores[i]);
    }, 1400);
    return () => clearInterval(t);
  }, []);
  const r = 16;
  const c = 2 * Math.PI * r;
  const pct = score / 10;
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        flexShrink: 0,
        background: "rgba(255,216,124,0.06)",
        border: "1px solid rgba(255,216,124,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="lg-mini-ai-grad" x1="0" y1="0" x2="44" y2="44">
            <stop offset="0" stopColor="#ffec94" />
            <stop offset="1" stopColor="#a47a1e" />
          </linearGradient>
        </defs>
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,216,124,0.12)" strokeWidth="2" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="url(#lg-mini-ai-grad)"
          strokeWidth="2"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <span className="lg-gold-text" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "-0.02em" }}>{score.toFixed(1)}</span>
    </div>
  );
}

function MiniGate() {
  const [state, setState] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setState((s) => 1 - s), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        flexShrink: 0,
        background: state === 1 ? "rgba(127,226,168,0.08)" : "rgba(255,216,124,0.06)",
        border: `1px solid ${state === 1 ? "rgba(127,226,168,0.35)" : "rgba(255,216,124,0.22)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .4s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {state === 0 ? (
        <div style={{ display: "flex", gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#ffd87c",
                animation: `lgMiniBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ color: "#7fe2a8", display: "flex" }}>
          <Icon name="check" size={20} stroke={3} />
        </div>
      )}
    </div>
  );
}

function MiniIntegrations() {
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % 3), 1100);
    return () => clearInterval(t);
  }, []);
  const items = [
    { label: "✓", color: "#7fe2a8" },
    { label: "9.4", color: "#ffd87c" },
    { label: "✦", color: "#8ab8ff" },
  ];
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        flexShrink: 0,
        background: "rgba(255,216,124,0.06)",
        border: "1px solid rgba(255,216,124,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {items.map((it, i) => {
        const isActive = active === i;
        const offset = i - active;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#0a0a0a",
              border: `1.5px solid ${isActive ? it.color : "rgba(255,216,124,0.25)"}`,
              color: isActive ? "#fff" : "#8a7d6e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              transform: `translate(${offset * 9}px, ${offset * 1}px) scale(${isActive ? 1.05 : 0.85})`,
              opacity: isActive ? 1 : 0.55,
              zIndex: isActive ? 5 : 5 - Math.abs(offset),
              transition: "all .5s cubic-bezier(.4,0,.2,1)",
              boxShadow: isActive ? `0 0 0 2px ${it.color}33` : "none",
            }}
          >
            {it.label}
          </div>
        );
      })}
    </div>
  );
}

// ─── Sections ──────────────────────────────────────────────────────────────

const SCORER_QUESTIONS = [
  {
    key: "budget",
    label: "What's their budget?",
    icon: "target",
    options: [
      { t: "Ready to spend $2k+", pts: 4 },
      { t: "Open if the ROI is clear", pts: 2.5 },
      { t: "Looking for free or cheap", pts: 0 },
    ],
  },
  {
    key: "timeline",
    label: "When do they want to start?",
    icon: "calendar",
    options: [
      { t: "This week", pts: 3 },
      { t: "In the next month or two", pts: 1.8 },
      { t: "Just browsing for now", pts: 0 },
    ],
  },
  {
    key: "commitment",
    label: "How committed are they?",
    icon: "trending-up",
    options: [
      { t: "Hired a pro before, ready to go", pts: 3 },
      { t: "Motivated, but new to this", pts: 2 },
      { t: "Curious, no real goal yet", pts: 0.4 },
    ],
  },
] as const;

function scorerVerdict(score: number) {
  if (score >= 7)
    return {
      label: "Qualified",
      color: "#7fe2a8",
      bg: "rgba(127,226,168,0.1)",
      border: "rgba(127,226,168,0.3)",
      reason:
        "Strong budget signal, a real timeline, and genuine commitment. This is a buyer, they'd instantly see your booking calendar and book a call.",
      outcome: "Sees your booking link \u2192 lands on your calendar",
    };
  if (score >= 4.5)
    return {
      label: "Borderline",
      color: "#ffd87c",
      bg: "rgba(255,216,124,0.1)",
      border: "rgba(255,216,124,0.3)",
      reason:
        "Some intent, but a soft spot on budget, timing, or commitment. Below your threshold they\u2019re held back from the calendar and sent a polite nurture follow-up instead.",
      outcome: "Held back \u2192 automatic follow-up, not a call",
    };
  return {
    label: "Filtered out",
    color: "#ff8a8a",
    bg: "rgba(255,92,92,0.1)",
    border: "rgba(255,92,92,0.3)",
    reason:
      "Low budget, no timeline, and weak commitment. This is the call that wastes 45 minutes. LeadGate keeps them off your calendar and sends a courteous decline.",
    outcome: "Kept off your calendar \u2192 no wasted call",
  };
}

function LiveScorer({ onCTA }: { onCTA: () => void }) {
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [display, setDisplay] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const goTo = React.useCallback((i: number) => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(SCORER_QUESTIONS.length - 1, i));
    if (track) track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setStep(clamped);
  }, []);

  const onTrackScroll = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setStep(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  const allAnswered = SCORER_QUESTIONS.every((q) => answers[q.key] !== undefined);
  const rawScore = SCORER_QUESTIONS.reduce(
    (sum, q) => sum + (answers[q.key] !== undefined ? q.options[answers[q.key]].pts : 0),
    0
  );
  const score = allAnswered ? Math.max(1, Math.min(10, rawScore)) : 0;
  const verdict = scorerVerdict(score);

  React.useEffect(() => {
    if (!allAnswered) {
      setDisplay(0);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const from = display;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 600);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (score - from) * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // Guarantee the number lands on the exact score even if rAF is throttled
    // (e.g. the tab is backgrounded mid-animation).
    const settle = setTimeout(() => setDisplay(score), 650);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, allAnswered]);

  return (
    <section id="demo" style={{ padding: "100px 32px", maxWidth: 1160, margin: "0 auto" }}>
      <div className="lg-reveal" style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
          TRY IT YOURSELF
        </div>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", margin: 0, letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6" }}>
          Score a lead <span className="lg-gold-text" style={{ fontWeight: 400 }}>in real time</span>.
        </h2>
        <p style={{ fontSize: 16, color: "#a49e8e", maxWidth: 580, margin: "14px auto 0", lineHeight: 1.6 }}>
          A simplified, hands-on demo of how the scoring works. Answer like a prospect would and watch the AI decide whether they&rsquo;d reach your calendar. On your real form, <span style={{ color: "#cfc8b8" }}>you write your own questions</span> for your exact offer.
        </p>
      </div>

      <div className="lg-reveal lg-gold-border lg-scorer-card" style={{ borderRadius: 22, padding: 0, overflow: "hidden", boxShadow: "0 30px 80px -28px rgba(255,216,124,0.18)" }}>
        <div className="lg-scorer-grid">
          {/* Questions */}
          <div className="lg-scorer-questions">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <div className="lg-badge lg-badge--demo">
                <Icon name="sparkle" size={12} style={{ color: "#ffd87c" }} />
                Interactive demo
              </div>
              <span style={{ fontSize: 11.5, color: "#7a7263" }}>Question {Math.min(step + 1, SCORER_QUESTIONS.length)} of {SCORER_QUESTIONS.length}</span>
            </div>

            <div className="lg-scorer-swipe" ref={trackRef} onScroll={onTrackScroll}>
              {SCORER_QUESTIONS.map((q) => (
                <div className="lg-scorer-slide" key={q.key}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
                    <Icon name={q.icon} size={15} stroke={2} style={{ color: "#ffd87c" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#f5f1e6", letterSpacing: "-0.01em" }}>{q.label}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.options.map((opt, oi) => {
                      const selected = answers[q.key] === oi;
                      return (
                        <button
                          key={oi}
                          type="button"
                          onClick={() => {
                            setAnswers((a) => ({ ...a, [q.key]: oi }));
                            const idx = SCORER_QUESTIONS.findIndex((x) => x.key === q.key);
                            if (idx < SCORER_QUESTIONS.length - 1) {
                              window.setTimeout(() => goTo(idx + 1), 240);
                            }
                          }}
                          className={`lg-scorer-opt ${selected ? "selected" : ""}`}
                        >
                          <span className="lg-scorer-radio" aria-hidden="true">
                            {selected && <Icon name="check" size={11} stroke={3} />}
                          </span>
                          {opt.t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg-scorer-dots">
              {SCORER_QUESTIONS.map((q, di) => (
                <button
                  key={q.key}
                  type="button"
                  aria-label={`Go to question ${di + 1}`}
                  onClick={() => goTo(di)}
                  className={`lg-scorer-dot ${di === step ? "active" : ""} ${answers[q.key] !== undefined ? "answered" : ""}`}
                />
              ))}
            </div>

          </div>

          {/* Result */}
          <div className="lg-scorer-result">
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, color: "#8a7d6e", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="brain" size={14} style={{ color: allAnswered ? verdict.color : "#6a6458" }} />
              AI Verdict
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 68, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: allAnswered ? verdict.color : "#3a3730", transition: "color .3s" }}>
                {allAnswered ? display.toFixed(1) : "-"}
              </span>
              <span style={{ fontSize: 20, color: "#6a6458", fontWeight: 500 }}>/10</span>
            </div>

            {/* Score bar */}
            <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 22 }}>
              <div style={{ height: "100%", width: `${(display / 10) * 100}%`, background: allAnswered ? verdict.color : "transparent", borderRadius: 999, transition: "width .1s linear, background .3s" }} />
            </div>

            {allAnswered ? (
              <>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 999, background: verdict.bg, border: `1px solid ${verdict.border}`, color: verdict.color, fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
                  {verdict.label === "Filtered out" ? <Icon name="x" size={12} stroke={2.5} /> : <Icon name="check" size={12} stroke={2.5} />}
                  {verdict.label}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#cfc8b8", margin: "0 0 14px" }}>{verdict.reason}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "#8a7d6e", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <Icon name="gate" size={15} style={{ color: verdict.color, flexShrink: 0 }} />
                  <span style={{ color: "#a49e8e" }}>{verdict.outcome}</span>
                </div>
              </>
            ) : (
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#7a7263", margin: 0 }}>
                These three are just an example. In LeadGate you build your own qualifying questions, any niche, any wording, and the AI scores answers the same way.
              </p>
            )}

            {allAnswered && (
              <button
                className="lg-btn-gold"
                onClick={onCTA}
                style={{ marginTop: 22, padding: "13px 20px", borderRadius: 11, fontSize: 14.5, fontWeight: 700, width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, cursor: "pointer" }}
              >
                See If Your Business Qualifies <Icon name="arrow-right" size={15} stroke={2.4} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const widgets: { widget: React.ReactNode; title: string; sub: string }[] = [
    { widget: <MiniAIScore />, title: "AI scoring", sub: "1–10 on every lead" },
    { widget: <MiniGate />, title: "Pre-qualified", sub: "before they book" },
    { widget: <MiniIntegrations />, title: "Booking-ready", sub: "straight to your calendar" },
  ];
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 32px" }}>
      <div className="lg-social-grid">
        <div className="lg-social-intro" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex" }}>
            {SCORE_CHIPS.map((chip, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "2px solid #0d0d0d",
                  outline: `1px solid ${chip.color}55`,
                  marginLeft: i === 0 ? 0 : -12,
                  zIndex: 10 - i,
                  background: "#12100b",
                  color: chip.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {chip.label}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f5f1e6", letterSpacing: "-0.01em" }}>
              Built for <span className="lg-gold-text">businesses like you</span>
            </div>
            <div style={{ fontSize: 11.5, color: "#8a7d6e", marginTop: 2 }}>
              Local service businesses done with tire-kickers
            </div>
          </div>
        </div>

        {widgets.map((v) => (
          <div key={v.title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {v.widget}
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f5f1e6", letterSpacing: "-0.01em" }}>{v.title}</div>
              <div style={{ fontSize: 11.5, color: "#8a7d6e", marginTop: 1 }}>{v.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Logos() {
  return (
    <section style={{ padding: "48px 0", position: "relative", overflow: "hidden" }}>
      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "#6a6458",
          fontWeight: 600,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        SHARE YOUR FORM ANYWHERE
      </div>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="lg-marquee-track" style={{ display: "flex", gap: 72, width: "max-content" }}>
          {[...LOGOS, ...LOGOS].map((l, i) => (
            <BrandLogo key={i} name={l.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" style={{ padding: "100px 32px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="lg-reveal" style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
          HOW IT WORKS
        </div>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", margin: 0, letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6" }}>
          Three steps. <span className="lg-gold-text" style={{ fontWeight: 400 }}>Zero lift.</span>
        </h2>
        <p style={{ fontSize: 16, color: "#a49e8e", maxWidth: 600, margin: "14px auto 0" }}>
          We build and wire the whole thing for you during onboarding. You just watch qualified calls land.
        </p>
      </div>

      <div className="lg-steps-grid lg-reveal-stagger lg-mobile-swipe">
        <div
          className="lg-step-connector"
          style={{
            position: "absolute",
            top: 42,
            left: "14%",
            right: "14%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,216,124,0.3), transparent)",
            zIndex: 0,
          }}
        />
        {STEPS.map((s, i) => (
          <div
            key={i}
            className="lg-card-hover"
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(255,216,124,0.1)",
              borderRadius: 16,
              padding: 30,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "rgba(255,216,124,0.06)",
                border: "1px solid rgba(255,216,124,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <span className="lg-gold-text" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.num}</span>
            </div>
            <h3 style={{ margin: "0 0 10px", fontSize: 20, color: "#f5f1e6" }}>{s.title}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#a49e8e" }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="lg-reveal" style={{ marginBottom: 56, display: "flex", alignItems: "end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
            FEATURES
          </div>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", margin: 0, letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6", maxWidth: 700 }}>
            Everything you need to <span className="lg-gold-text" style={{ fontWeight: 400 }}>filter the noise</span>.
          </h2>
        </div>
        <p style={{ fontSize: 15, color: "#a49e8e", maxWidth: 360, margin: 0 }}>
          Built from the ground up for local businesses done wasting time on quotes and calls that go nowhere.
        </p>
      </div>

      <div
        className="lg-features-grid lg-reveal-stagger lg-mobile-swipe lg-mobile-swipe-features"
        style={{
          background: "rgba(255,216,124,0.08)",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(255,216,124,0.08)",
        }}
      >
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="lg-feature-cell"
            style={{
              background: "#0a0a0a",
              padding: "34px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              transition: "background .2s ease",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "rgba(255,216,124,0.08)",
                border: "1px solid rgba(255,216,124,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffd87c",
              }}
            >
              <Icon name={f.icon} size={20} stroke={1.8} />
            </div>
            <h3 style={{ margin: 0, fontSize: 17, color: "#f5f1e6" }}>{f.title}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#a49e8e" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="lg-reveal" style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
          SOUND FAMILIAR?
        </div>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", margin: 0, letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6" }}>
          If any of this hits, <span className="lg-gold-text" style={{ fontWeight: 500 }}>this is for you</span>.
        </h2>
        <p style={{ fontSize: 16, color: "#a49e8e", maxWidth: 620, margin: "14px auto 0" }}>
          We built LeadGate because we kept hearing the same three things from local business owners. If you&apos;ve thought any of these in the last 30 days, keep reading.
        </p>
      </div>

      <div className="lg-pains-grid lg-reveal-stagger lg-mobile-swipe">
        {PAINS.map((p, i) => (
          <div
            key={i}
            className="lg-card-hover"
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(255,216,124,0.1)",
              borderRadius: 16,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              position: "relative",
              minHeight: 220,
            }}
          >
            <div className="lg-gold-text" style={{ opacity: 0.5, position: "absolute", top: 22, right: 22 }}>
              <Icon name="quote" size={32} />
            </div>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.45, color: "#f5f1e6", fontWeight: 500, letterSpacing: "-0.01em", flex: 1 }}>
              &ldquo;{p.quote}&rdquo;
            </p>
            <div
              style={{
                paddingTop: 14,
                borderTop: "1px solid rgba(255,216,124,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lg-gold-gradient)" }} />
              <div style={{ fontSize: 12, color: "#a49e8e", letterSpacing: "0.02em", textTransform: "uppercase", fontWeight: 600 }}>
                - {p.label}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

function Cases() {
  return (
    <section id="cases" style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="lg-reveal" style={{ marginBottom: 48, maxWidth: 620 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
          The difference
        </div>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", margin: 0, letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6" }}>
          Your calendar, <span className="lg-gold-text" style={{ fontWeight: 400 }}>before &amp; after</span>.
        </h2>
        <p style={{ fontSize: 16, color: "#a49e8e", margin: "16px 0 0", lineHeight: 1.6 }}>
          Same leads, same ad spend. The only thing that changes is what reaches your booking link.
        </p>
      </div>

      <div className="lg-cases-grid lg-reveal-stagger lg-mobile-swipe">
        {/* Without LeadGate */}
        <div
          className="lg-card-hover"
          style={{
            background: "#0d0d0d",
            border: "1px solid rgba(255,92,92,0.15)",
            borderRadius: 18,
            padding: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                color: "#ff8a8a",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 700,
              }}
            >
              Without LeadGate
            </span>
          </div>
          <div style={{ fontSize: 14, color: "#8a7d6e", marginBottom: 24 }}>
            Anyone can book a call.
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {WORKFLOW_BEFORE.map((t) => (
              <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "#c9c2b0", lineHeight: 1.45 }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(255,92,92,0.08)",
                    border: "1px solid rgba(255,92,92,0.2)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ff8a8a",
                    marginTop: 1,
                  }}
                >
                  <Icon name="x" size={12} stroke={2.5} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* With LeadGate */}
        <div
          className="lg-card-hover lg-gold-border"
          style={{
            background: "linear-gradient(180deg, #100b02 0%, #0a0805 100%)",
            borderRadius: 18,
            padding: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="lg-dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span
              className="lg-gold-text"
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 700,
              }}
            >
              With LeadGate
            </span>
          </div>
          <div style={{ fontSize: 14, color: "#8a7d6e", marginBottom: 24 }}>
            Only qualified leads book.
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {WORKFLOW_AFTER.map((t) => (
              <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "#f0ebdc", lineHeight: 1.45 }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(255,216,124,0.1)",
                    border: "1px solid rgba(255,216,124,0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffd87c",
                    marginTop: 1,
                  }}
                >
                  <Icon name="check" size={12} stroke={2.6} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>

      <p
        className="lg-reveal"
        style={{
          margin: "32px 0 0",
          fontSize: 13,
          color: "#6a6458",
          textAlign: "center",
        }}
      >
        No staged screenshots, no invented testimonials, just a qualification layer that does one job well.
      </p>
    </section>
  );
}

function Pricing({ onCTA }: { onCTA: () => void }) {
  const steps = [
    {
      title: "Free audit",
      desc: "We map exactly where your current funnel leaks leads, and what recovering them is worth.",
    },
    {
      title: "Done-for-you build",
      desc: "We build your conversion system, booking calendar, follow-up, and LeadGate wired in. Nothing lands on your plate.",
    },
    {
      title: "Monthly management",
      desc: "LeadGate qualifies every lead while we run and tune the system month over month.",
    },
  ];

  return (
    <section id="pricing" style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="lg-reveal" style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
          HOW TO GET LEADGATE
        </div>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", margin: 0, letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6" }}>
          Not sold standalone. <span className="lg-gold-text" style={{ fontWeight: 500 }}>Included with ReclaimedHQ.</span>
        </h2>
        <p style={{ fontSize: 16, color: "#a49e8e", maxWidth: 620, margin: "14px auto 0" }}>
          LeadGate runs on the system we build for you, so it comes as part of the
          monthly management service that follows your done-for-you build, not as
          software you set up yourself.
        </p>
      </div>

      <div className="lg-reveal" style={{ maxWidth: 560, margin: "0 auto" }}>
        <div
          className="lg-gold-border"
          style={{
            background: "linear-gradient(180deg, #120d02 0%, #0a0805 100%)",
            borderRadius: 20,
            padding: "40px 36px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 30px 80px -20px rgba(255,216,124,0.2)",
          }}
        >
          <div className="lg-dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <h3 style={{ margin: 0, fontSize: 22, color: "#f5f1e6", letterSpacing: "-0.015em" }}>Part of your monthly plan</h3>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 11px",
                  borderRadius: 999,
                  background: "rgba(255,216,124,0.08)",
                  border: "1px solid rgba(255,216,124,0.25)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#ffd87c",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                <Icon name="check" size={11} stroke={2.5} /> Managed for you
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#8a7d6e", marginBottom: 28 }}>
              Here&apos;s the path from first call to qualified leads on your calendar.
            </div>

            <ol style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "flex", flexDirection: "column", gap: 18 }}>
              {steps.map((step, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: 1,
                      color: "#ffd87c",
                      background: "rgba(255,216,124,0.1)",
                      border: "1px solid rgba(255,216,124,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#f5f1e6" }}>{step.title}</div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#a49e8e", marginTop: 3 }}>{step.desc}</div>
                  </div>
                </li>
              ))}
            </ol>

            <button
              className="lg-btn-gold"
              onClick={onCTA}
              style={{
                padding: "15px 20px",
                borderRadius: 12,
                fontSize: 15.5,
                cursor: "pointer",
                fontWeight: 700,
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              See If Your Business Qualifies <Icon name="arrow-right" size={15} stroke={2.4} />
            </button>

            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#6a6458" }}>
              Already a client?{" "}
              <Link href="/login" style={{ color: "#ffd87c", textDecoration: "none", fontWeight: 600 }}>
                Log in
              </Link>{" "}
              — LeadGate is in your dashboard.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = React.useState<number>(-1);
  return (
    <section id="faq" style={{ padding: "80px 32px", maxWidth: 900, margin: "0 auto" }}>
      <div className="lg-reveal" style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
          FAQ
        </div>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", margin: 0, letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6" }}>
          Questions, <span className="lg-gold-text" style={{ fontWeight: 400 }}>answered</span>.
        </h2>
      </div>

      <div className="lg-reveal-stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQS.map((f, i) => (
          <div
            key={i}
            style={{
              background: "#0d0d0d",
              border: `1px solid ${open === i ? "rgba(255,216,124,0.3)" : "rgba(255,216,124,0.08)"}`,
              borderRadius: 12,
              overflow: "hidden",
              transition: "all .2s ease",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 22px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#f5f1e6",
                fontSize: 15.5,
                fontWeight: 500,
                textAlign: "left",
              }}
            >
              {f.q}
              <span
                className="lg-gold-text"
                style={{
                  transition: "transform .25s ease",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  display: "inline-flex",
                }}
              >
                <Icon name="plus" size={18} stroke={2} />
              </span>
            </button>
            <div style={{ maxHeight: open === i ? 400 : 0, transition: "max-height .3s ease", overflow: "hidden" }}>
              <div style={{ padding: "0 22px 20px", fontSize: 14, lineHeight: 1.6, color: "#a49e8e" }}>{f.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Founder() {
  return (
    <section id="founder" style={{ padding: "100px 32px", maxWidth: 1160, margin: "0 auto" }}>
      <div className="lg-founder-grid lg-reveal">
        {/* Photo */}
        <div className="lg-founder-photo">
          <Image
            src="/founder.jpg"
            alt="Kevin Ghai, founder of LeadGate AI"
            width={1013}
            height={1206}
            sizes="(max-width: 880px) 100vw, 440px"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
          />
        </div>

        {/* Copy */}
        <div className="lg-founder-copy">
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 18 }}>
            MEET THE FOUNDER
          </div>

          <h2 style={{ margin: 0, fontSize: "clamp(30px, 3.6vw, 44px)", letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6", lineHeight: 1.1 }}>
            Hey, I&rsquo;m <span className="lg-gold-text" style={{ fontWeight: 500 }}>Kevin Ghai</span>.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "22px 0 30px" }}>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#bdb6a6" }}>
              I&rsquo;ve sat on both sides of the table, building AI systems and running sales.
              I watched businesses burn hour after hour on calls and quotes with people who were never
              going to buy. Price shoppers, &ldquo;just looking,&rdquo; out-of-area. It wasn&rsquo;t a
              closing problem. It was a <span style={{ color: "#f5f1e6", fontWeight: 500 }}>filtering</span> problem.
            </p>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#bdb6a6" }}>
              So I built LeadGate to do what a great sales assistant would, qualify every lead
              before it ever hits your calendar, so the only calls you take are with people ready to buy.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <a
              href={AUDIT_FUNNEL_URL}
              className="lg-btn-gold"
              style={{ padding: "14px 26px", borderRadius: 12, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}
            >
              Get your free audit <Icon name="arrow-right" size={16} stroke={2.2} />
            </a>
            <span style={{ fontSize: 13, color: "#8a7d6e" }}>
              Free · no pitch, just straight answers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onCTA }: { onCTA: () => void }) {
  return (
    <section style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
      <div
        className="lg-gold-border lg-reveal"
        style={{
          borderRadius: 24,
          padding: "64px 40px",
          textAlign: "center",
          background: "radial-gradient(ellipse at center, rgba(255,216,124,0.06), #0a0705)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="lg-dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              borderRadius: 999,
              background: "rgba(255,216,124,0.08)",
              border: "1px solid rgba(255,216,124,0.3)",
              fontSize: 12,
              fontWeight: 600,
              color: "#ffd87c",
              marginBottom: 24,
            }}
          >
            <Icon name="check" size={12} stroke={2.5} /> Included with ReclaimedHQ management
          </div>
          <h2 style={{ margin: 0, fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.035em", fontWeight: 600, color: "#f5f1e6", lineHeight: 1.05 }}>
            Your next call could be
            <br />
            <span className="lg-gold-text" style={{ fontWeight: 400 }}>a closed deal</span>.
          </h2>
          <p style={{ fontSize: 16, color: "#a49e8e", maxWidth: 560, margin: "18px auto 32px" }}>
            Stop spending calls and quotes on tire-kickers. Talk only to the buyers who are ready to book.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="lg-btn-gold"
              onClick={onCTA}
              style={{ padding: "15px 28px", borderRadius: 12, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              See If Your Business Qualifies <Icon name="arrow-right" size={15} stroke={2.4} />
            </button>
            <Link
              href="/login"
              className="lg-btn-ghost"
              style={{ padding: "15px 28px", borderRadius: 12, fontSize: 15, cursor: "pointer", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}
            >
              Client login <Icon name="arrow-right" size={15} stroke={2} style={{ color: "#ffd87c" }} />
            </Link>
          </div>
          <div style={{ marginTop: 20, fontSize: 13, color: "#6a6458" }}>
            Done-for-you setup · Runs inside your monthly ReclaimedHQ plan
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  // Only pages/sections that actually exist. No legal pages exist yet, so no
  // legal column — do not link to pages that 404.
  const cols = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "/#how" },
        { label: "Features", href: "/#features" },
        { label: "How to get it", href: "/#pricing" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Meet the founder", href: "/founder" },
        { label: "Get your free audit", href: AUDIT_FUNNEL_URL },
        { label: "Client login", href: "/login" },
      ],
    },
  ];
  return (
    <footer
      style={{
        padding: "60px 32px 40px",
        maxWidth: 1280,
        margin: "40px auto 0",
        borderTop: "1px solid rgba(255,216,124,0.08)",
      }}
    >
      <div className="lg-footer-grid" style={{ marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Icon name="logo" size={26} />
            <span style={{ fontWeight: 700, fontSize: 18, color: "#f5f1e6" }}>
              LeadGate <span className="lg-gold-text">AI</span>
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#8a7d6e", maxWidth: 280, lineHeight: 1.6 }}>
            The AI that filters your leads so you only talk to customers ready to book.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>
              {col.title}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} style={{ color: "#a49e8e", textDecoration: "none", fontSize: 13 }}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="lg-divider-gold" style={{ marginBottom: 20 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#6a6458", flexWrap: "wrap", gap: 12 }}>
        <div>© 2026 LeadGate AI · All rights reserved.</div>
        <div>Made for local businesses that close.</div>
      </div>
    </footer>
  );
}

// ─── Modals ────────────────────────────────────────────────────────────────


function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "lgFadeIn .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="lg-gold-border"
        style={{ background: "#0a0805", borderRadius: 18, padding: 16, width: "min(880px, 100%)", position: "relative" }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: -38,
            right: 0,
            background: "transparent",
            border: "none",
            color: "#f5f1e6",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
          }}
        >
          Close <Icon name="x" size={16} />
        </button>
        <div
          style={{
            aspectRatio: "16/9",
            borderRadius: 12,
            background: "#000",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <iframe
            src="https://www.youtube-nocookie.com/embed/QAOoRF4M3r0?autoplay=1&rel=0&modestbranding=1"
            title="How LeadGate AI works"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export function useScrollReveal() {
  React.useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll(".lg-reveal, .lg-reveal-stagger").forEach((el) => {
        el.classList.add("lg-in-view");
      });
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lg-in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    const nodes = document.querySelectorAll(".lg-reveal, .lg-reveal-stagger");
    nodes.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function StickyCTA({ onCTA }: { onCTA: () => void }) {
  const [show, setShow] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 760);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = show && !dismissed;

  React.useEffect(() => {
    document.body.classList.toggle("lg-sticky-active", visible);
    return () => document.body.classList.remove("lg-sticky-active");
  }, [visible]);

  return (
    <div className={`lg-sticky-cta ${visible ? "show" : ""}`} aria-hidden={!visible}>
      <button
        type="button"
        className="lg-sticky-close"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
      >
        <Icon name="x" size={14} stroke={2.4} />
      </button>
      <div style={{ minWidth: 0, fontSize: 13.5, fontWeight: 600, color: "#f5f1e6", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        Filter out the tire-kickers
      </div>
      <button
        className="lg-btn-gold"
        onClick={onCTA}
        style={{ padding: "7px 14px", borderRadius: 9, fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
      >
        See if you qualify <Icon name="arrow-right" size={14} stroke={2.4} />
      </button>
    </div>
  );
}

function FounderAssistant() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="lg-assistant">
      {/* Panel */}
      {open && (
        <div className="lg-assistant-panel" role="dialog" aria-label="Talk to the founder">
          <div className="lg-assistant-head">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="lg-assistant-avatar">
                <Image src="/leadgate-logo.png" alt="" width={40} height={40} style={{ borderRadius: 10, display: "block" }} />
                <span className="lg-assistant-dot" aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f5f1e6", letterSpacing: "-0.01em" }}>
                  Questions before you start?
                </div>
                <div style={{ fontSize: 11.5, color: "#7fe2a8", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7fe2a8", display: "inline-block" }} />
                  Founder · usually replies same day
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="lg-assistant-close">
              <Icon name="x" size={16} stroke={2} />
            </button>
          </div>

          <div className="lg-assistant-body">
            <div className="lg-assistant-bubble">
              Hey, I&apos;m the founder. If you&apos;re weighing whether LeadGate fits your
              business, start with the free audit. No pitch, just a straight answer
              on where your leads leak.
            </div>
          </div>

          <div className="lg-assistant-foot">
            <a
              href={AUDIT_FUNNEL_URL}
              className="lg-btn-gold"
              style={{ padding: "13px 18px", borderRadius: 11, fontSize: 14.5, fontWeight: 700, width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, textDecoration: "none" }}
            >
              Get your free audit <Icon name="arrow-right" size={16} stroke={2.2} />
            </a>
            <div style={{ textAlign: "center", marginTop: 9, fontSize: 11, color: "#6a6458" }}>
              Free · takes about two minutes
            </div>
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="lg-assistant-fab"
        aria-label={open ? "Close founder chat" : "Talk to the founder"}
      >
        <Icon name={open ? "x" : "chat"} size={24} stroke={2} />
        {!open && <span className="lg-assistant-fab-pulse" aria-hidden="true" />}
      </button>
    </div>
  );
}

export default function LandingPage() {
  const [videoOpen, setVideoOpen] = React.useState(false);
  useScrollReveal();

  // Prospects go to the ReclaimedHQ audit funnel — signup is admin-only.
  const goToAudit = React.useCallback(() => {
    window.location.assign(AUDIT_FUNNEL_URL);
  }, []);

  return (
    <div className="lg-root lg-grain">
      <LandingStyles />
      <Nav onCTA={goToAudit} />
      <main>
        <Hero onCTA={goToAudit} onVideo={() => setVideoOpen(true)} />
        <SocialProof />
        <Logos />
        <HowItWorks />
        <LiveScorer onCTA={goToAudit} />
        <Features />
        <Testimonials />
        <Cases />
        <Pricing onCTA={goToAudit} />
        <FAQ />
        <FinalCTA onCTA={goToAudit} />
      </main>
      <Footer />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
      <StickyCTA onCTA={goToAudit} />
      <FounderAssistant />
    </div>
  );
}

// ─── Scoped styles ─────────────────────────────────────────────────────────

const LANDING_CSS = `
      @import url("https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap");

      .lg-root {
        --lg-gold-gradient: linear-gradient(
          135deg,
          #a47a1e 0%,
          #d3a84c 18%,
          #ffec94 34%,
          #e6be69 50%,
          #ffd87c 66%,
          #b58f3e 82%,
          #956d13 100%
        );
        background: #070707;
        color: #f5f1e6;
        font-family: "Geist", -apple-system, BlinkMacSystemFont, sans-serif;
        font-feature-settings: "ss01", "cv11";
        -webkit-font-smoothing: antialiased;
        letter-spacing: -0.01em;
        min-height: 100vh;
        overflow-x: hidden;
      }
      .lg-root h1,
      .lg-root h2,
      .lg-root h3,
      .lg-root h4 {
        font-family: "Geist", sans-serif;
        letter-spacing: -0.03em;
        font-weight: 600;
      }

      html,
      body {
        background: #070707;
      }
      body {
        margin: 0;
      }

      .lg-gold-text {
        background: var(--lg-gold-gradient);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        background-size: 200% 200%;
        animation: lgGoldShimmer 8s ease-in-out infinite;
      }
      @keyframes lgGoldShimmer {
        0%,
        100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }

      .lg-gold-border {
        position: relative;
        background: #111;
      }
      .lg-gold-border::before {
        content: "";
        position: absolute;
        inset: 0;
        padding: 1px;
        border-radius: inherit;
        background: var(--lg-gold-gradient);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        opacity: 0.55;
      }

      .lg-btn-gold {
        background: var(--lg-gold-gradient);
        background-size: 200% 200%;
        color: #1a1200;
        font-weight: 700;
        border: 0;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .lg-btn-gold:hover {
        background-position: 100% 50%;
        box-shadow: 0 10px 40px -10px rgba(255, 216, 124, 0.5),
          0 0 0 1px rgba(255, 236, 148, 0.4);
        transform: translateY(-1px);
      }
      .lg-btn-gold::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 60%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.6s ease;
      }
      .lg-btn-gold:hover::after {
        left: 120%;
      }

      .lg-btn-ghost {
        background: rgba(255, 255, 255, 0.03);
        color: #f5f1e6;
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.2s ease;
      }
      .lg-btn-ghost:hover {
        background: rgba(255, 216, 124, 0.08);
        border-color: rgba(255, 216, 124, 0.3);
      }

      .lg-google-btn:hover:not(:disabled) {
        background: #131313 !important;
        border-color: rgba(255, 216, 124, 0.35) !important;
        box-shadow: 0 6px 24px -10px rgba(255, 216, 124, 0.25);
      }

      .lg-divider-gold {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 216, 124, 0.3), transparent);
      }

      .lg-grain::before {
        content: "";
        position: fixed;
        inset: 0;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        pointer-events: none;
        opacity: 0.6;
        mix-blend-mode: overlay;
        z-index: 9999;
      }

      .lg-dot-grid {
        background-image: radial-gradient(rgba(255, 216, 124, 0.25) 1px, transparent 1px);
        background-size: 14px 14px;
        mask-image: linear-gradient(to top, black 0%, transparent 80%);
        -webkit-mask-image: linear-gradient(to top, black 0%, transparent 80%);
      }

      @keyframes lgMarquee {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-50%);
        }
      }
      .lg-marquee-track {
        animation: lgMarquee 30s linear infinite;
      }

      .lg-lead-row {
        transition: all 0.2s ease;
        cursor: pointer;
      }
      .lg-lead-row:hover {
        background: rgba(255, 216, 124, 0.05);
      }
      .lg-lead-row.active {
        background: rgba(255, 216, 124, 0.09);
      }

      @keyframes lgPulseRing {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 216, 124, 0.5);
        }
        100% {
          box-shadow: 0 0 0 14px rgba(255, 216, 124, 0);
        }
      }
      @keyframes lgFadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes lgFadeUp {
        from {
          opacity: 0;
          transform: translate(-50%, 8px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
      /* ── Sticky mobile CTA bar ── */
      .lg-sticky-cta {
        display: none;
      }
      @media (max-width: 767px) {
        .lg-sticky-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          position: fixed;
          left: 12px;
          right: 12px;
          bottom: 12px;
          z-index: 55;
          padding: 6px 8px 6px 16px;
          border-radius: 13px;
          background: rgba(14, 12, 8, 0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 216, 124, 0.22);
          box-shadow: 0 18px 50px -12px rgba(0, 0, 0, 0.85);
          transform: translateY(140%);
          opacity: 0;
          transition: transform 0.32s cubic-bezier(0.34, 1.2, 0.5, 1), opacity 0.25s ease;
        }
        .lg-sticky-cta.show {
          transform: translateY(0);
          opacity: 1;
        }
        .lg-sticky-close {
          position: absolute;
          top: -10px;
          right: -4px;
          width: 24px;
          height: 24px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(20, 18, 12, 0.96);
          border: 1px solid rgba(255, 216, 124, 0.28);
          color: #b8b0a0;
          cursor: pointer;
          box-shadow: 0 6px 16px -4px rgba(0, 0, 0, 0.7);
          transition: color 0.18s ease, border-color 0.18s ease;
        }
        .lg-sticky-close:hover {
          color: #f5f1e6;
          border-color: rgba(255, 216, 124, 0.5);
        }
        /* Lift the founder chat FAB above the sticky bar while it's visible */
        body.lg-sticky-active .lg-assistant {
          bottom: 86px;
        }
        /* Keep footer content from hiding behind the bar */
        body.lg-sticky-active {
          padding-bottom: 80px;
        }
      }
      .lg-assistant {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 60;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 16px;
        transition: bottom 0.3s ease;
      }
      .lg-assistant-fab {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px solid rgba(255, 216, 124, 0.45);
        background: var(--lg-gold-gradient);
        background-size: 200% 200%;
        color: #1a1200;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 14px 38px -8px rgba(255, 216, 124, 0.5);
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }
      .lg-assistant-fab:hover {
        transform: translateY(-2px) scale(1.04);
        box-shadow: 0 18px 46px -8px rgba(255, 216, 124, 0.62);
      }
      .lg-assistant-fab-pulse {
        position: absolute;
        inset: -1px;
        border-radius: 50%;
        border: 1px solid rgba(255, 216, 124, 0.6);
        animation: lgPulseRing 2.4s ease-out infinite;
        pointer-events: none;
      }
      .lg-assistant-panel {
        width: 340px;
        max-width: calc(100vw - 32px);
        background: #0c0b09;
        border: 1px solid rgba(255, 216, 124, 0.22);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 30px 70px -18px rgba(0, 0, 0, 0.8),
          0 0 0 1px rgba(255, 216, 124, 0.04);
        transform-origin: bottom right;
        animation: lgAssistantPop 0.28s cubic-bezier(0.34, 1.4, 0.5, 1);
      }
      @keyframes lgAssistantPop {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.94);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .lg-assistant-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 18px 18px 14px;
        background: linear-gradient(180deg, rgba(255, 216, 124, 0.07), transparent);
        border-bottom: 1px solid rgba(255, 216, 124, 0.1);
      }
      .lg-assistant-avatar {
        position: relative;
        flex-shrink: 0;
      }
      .lg-assistant-dot {
        position: absolute;
        right: -2px;
        bottom: -2px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #7fe2a8;
        border: 2px solid #0c0b09;
      }
      .lg-assistant-close {
        background: transparent;
        border: none;
        color: #8a8478;
        cursor: pointer;
        padding: 4px;
        border-radius: 8px;
        display: flex;
        transition: color 0.15s ease, background 0.15s ease;
      }
      .lg-assistant-close:hover {
        color: #f5f1e6;
        background: rgba(255, 255, 255, 0.06);
      }
      .lg-assistant-body {
        padding: 18px 18px 6px;
      }
      .lg-assistant-bubble {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 216, 124, 0.1);
        border-radius: 14px;
        border-top-left-radius: 4px;
        padding: 13px 15px;
        font-size: 13.5px;
        line-height: 1.55;
        color: #d4cdbc;
      }
      .lg-assistant-foot {
        padding: 14px 18px 18px;
      }
      @media (max-width: 600px) {
        .lg-assistant {
          bottom: 18px;
          right: 18px;
        }
        .lg-assistant-fab {
          width: 54px;
          height: 54px;
        }
      }
      .lg-benefit-swap {
        animation: lgBenefitSwap 0.45s cubic-bezier(0.4, 0, 0.2, 1);
      }
      @keyframes lgBenefitSwap {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes lgMiniBounce {
        0%,
        80%,
        100% {
          opacity: 0.3;
          transform: scale(0.7);
        }
        40% {
          opacity: 1;
          transform: scale(1.1);
        }
      }

      .lg-bg-gold-glow {
        background:
          radial-gradient(600px 300px at 85% 20%, rgba(255, 216, 124, 0.1), transparent 60%),
          radial-gradient(500px 400px at 10% 40%, rgba(164, 122, 30, 0.08), transparent 60%);
      }

      .lg-feature-cell:hover {
        background: #111 !important;
      }

      /* ── Meet the Founder ── */
      .lg-founder-grid {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: 56px;
        align-items: center;
      }
      .lg-founder-photo {
        position: relative;
        aspect-ratio: 4 / 5;
        overflow: hidden;
        border-radius: 20px;
        border: 1px solid rgba(255, 216, 124, 0.14);
        box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.8);
      }
      .lg-founder-copy {
        max-width: 560px;
      }
      @media (max-width: 880px) {
        .lg-founder-grid {
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 440px;
          margin: 0 auto;
        }
        .lg-founder-photo {
          aspect-ratio: 1 / 1;
        }
      }

      /* ── Nav (desktop default + mobile drawer) ── */
      .lg-nav {
        max-width: 1280px;
        margin: 0 auto;
        padding: 18px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
      }
      .lg-nav-links {
        display: flex;
        align-items: center;
        gap: 28px;
      }
      .lg-nav-cta {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .lg-hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: transparent;
        border: 1px solid rgba(255, 216, 124, 0.18);
        border-radius: 10px;
        padding: 10px 11px;
        cursor: pointer;
        position: relative;
        z-index: 60;
      }
      .lg-hamburger-bar {
        display: block;
        width: 20px;
        height: 2px;
        background: #f5f1e6;
        border-radius: 2px;
        transition: transform 0.25s ease, opacity 0.2s ease;
        transform-origin: center;
      }
      .lg-hamburger-bar.open-1 {
        transform: translateY(7px) rotate(45deg);
      }
      .lg-hamburger-bar.open-2 {
        opacity: 0;
      }
      .lg-hamburger-bar.open-3 {
        transform: translateY(-7px) rotate(-45deg);
      }
      .lg-mobile-drawer {
        overflow: hidden;
        transition: max-height 0.35s cubic-bezier(0.2, 0.6, 0.2, 1),
          opacity 0.25s ease;
        background: rgba(7, 7, 7, 0.96);
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        border-bottom: 1px solid rgba(255, 216, 124, 0.08);
      }

      .lg-hero-section {
        padding-top: 140px;
        padding-bottom: 80px;
      }
      .lg-hero-grid {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 32px;
        display: grid;
        grid-template-columns: 1fr 1.1fr;
        gap: 64px;
        align-items: center;
      }
      .lg-social-grid {
        background: #0d0d0d;
        border: 1px solid rgba(255, 216, 124, 0.12);
        border-radius: 16px;
        padding: 22px 30px;
        display: grid;
        grid-template-columns: 1.3fr 1fr 1fr 1fr;
        align-items: center;
        gap: 32px;
      }
      .lg-steps-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        position: relative;
      }
      .lg-features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
      }
      .lg-pains-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      .lg-cases-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
      /* ── Pill badge (SaaS eyebrow / label) ── */
      .lg-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px 6px 11px;
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(255, 216, 124, 0.1), rgba(255, 216, 124, 0.03));
        border: 1px solid rgba(255, 216, 124, 0.2);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 14px -6px rgba(255, 216, 124, 0.22);
        font-size: 12.5px;
        font-weight: 500;
        letter-spacing: 0.01em;
        color: #e7dcc2;
        white-space: nowrap;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .lg-badge:hover {
        border-color: rgba(255, 216, 124, 0.34);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 6px 18px -6px rgba(255, 216, 124, 0.32);
      }
      .lg-badge-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
        background: var(--lg-gold-gradient);
        animation: lgPulseRing 2.4s ease-out infinite;
      }
      .lg-badge--demo {
        padding: 5px 13px 5px 10px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: #ffd87c;
      }
      /* ── Live lead scorer ── */
      .lg-scorer-card {
        background: linear-gradient(180deg, #100b02 0%, #0a0805 100%);
      }
      .lg-scorer-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
      }
      .lg-scorer-questions {
        min-width: 0;
        padding: 40px;
      }
      .lg-scorer-result {
        min-width: 0;
        padding: 40px;
        background: rgba(255, 216, 124, 0.025);
        border-left: 1px solid rgba(255, 216, 124, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .lg-scorer-opt {
        display: flex;
        align-items: center;
        gap: 11px;
        width: 100%;
        text-align: left;
        padding: 12px 14px;
        border-radius: 11px;
        font-size: 13.5px;
        color: #cfc8b8;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.07);
        cursor: pointer;
        transition: all 0.18s ease;
      }
      .lg-scorer-opt:hover {
        border-color: rgba(255, 216, 124, 0.32);
        background: rgba(255, 216, 124, 0.05);
        color: #f5f1e6;
      }
      .lg-scorer-opt.selected {
        border-color: rgba(255, 216, 124, 0.55);
        background: rgba(255, 216, 124, 0.09);
        color: #f5f1e6;
      }
      .lg-scorer-radio {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        flex-shrink: 0;
        border: 1.5px solid rgba(255, 255, 255, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1a1200;
        transition: all 0.18s ease;
      }
      .lg-scorer-opt.selected .lg-scorer-radio {
        background: var(--lg-gold-gradient);
        border-color: transparent;
      }
      .lg-scorer-swipe {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        scroll-behavior: smooth;
      }
      .lg-scorer-swipe::-webkit-scrollbar {
        display: none;
      }
      .lg-scorer-slide {
        flex: 0 0 100%;
        min-width: 0;
        scroll-snap-align: start;
        padding: 2px 2px 0;
      }
      .lg-scorer-dots {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: 22px;
      }
      .lg-scorer-dot {
        width: 8px;
        height: 8px;
        padding: 0;
        border: none;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        cursor: pointer;
        transition: all 0.25s ease;
      }
      .lg-scorer-dot.answered {
        background: rgba(255, 216, 124, 0.45);
      }
      .lg-scorer-dot.active {
        width: 24px;
        background: var(--lg-gold-gradient);
      }
      @media (max-width: 767px) {
        .lg-scorer-grid {
          grid-template-columns: minmax(0, 1fr);
        }
        .lg-scorer-questions {
          padding: 28px 22px;
        }
        .lg-scorer-result {
          padding: 28px 22px;
          border-left: none;
          border-top: 1px solid rgba(255, 216, 124, 0.1);
        }
      }
      .lg-footer-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr 1fr 1fr;
        gap: 32px;
      }

      @media (max-width: 960px) {
        .lg-nav-links {
          display: none;
        }
        .lg-nav-cta {
          display: none;
        }
        .lg-hamburger {
          display: inline-flex;
        }
        .lg-hero-grid {
          grid-template-columns: 1fr;
          gap: 48px;
          padding: 0 20px;
        }
        .lg-social-grid {
          grid-template-columns: 1fr 1fr;
        }
        .lg-steps-grid,
        .lg-features-grid,
        .lg-pains-grid,
        .lg-cases-grid {
          grid-template-columns: 1fr;
        }
        .lg-step-connector {
          display: none;
        }
        .lg-footer-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 640px) {
        .lg-nav {
          padding: 14px 18px;
        }
        .lg-hero-section {
          padding-top: 88px;
          padding-bottom: 48px;
        }
        .lg-hero-grid {
          padding: 0 18px;
          gap: 36px;
          grid-template-columns: minmax(0, 1fr) !important;
        }
        /* Center the hero heading + copy on mobile only (desktop stays left-aligned) */
        .lg-hero-enter {
          text-align: center;
        }
        .lg-hero-enter h1 {
          font-size: 34px !important;
          letter-spacing: -0.02em !important;
        }
        .lg-hero-enter p {
          font-size: 15.5px !important;
        }
        .lg-hero-enter p {
          margin-left: auto;
          margin-right: auto;
        }
        .lg-hero-enter > div {
          justify-content: center;
        }
        /* Push the cards block down so it clears the CTAs, and pin the hint right above the cards (centered) */
        .lg-hero-right-enter {
          margin-top: 22px;
        }
        .lg-hero-hint {
          top: -24px !important;
          left: -8px !important;
          justify-content: flex-start;
          white-space: nowrap;
        }
        .lg-hero-arrow {
          display: none !important;
        }
        .lg-social-grid {
          grid-template-columns: 1fr;
        }
        .lg-social-intro {
          flex-direction: column;
          align-items: flex-start !important;
          gap: 12px !important;
        }
        .lg-footer-grid {
          grid-template-columns: 1fr;
        }
        /* Tighten vertical rhythm + gutters so sections don't feel like big empty stacked blocks */
        .lg-root main > section {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
        .lg-root main > section:not(.lg-hero-section) {
          padding-top: 58px !important;
          padding-bottom: 58px !important;
        }
      }

      /* ── Scroll reveal ── */
      .lg-reveal {
        opacity: 0;
        transform: translate3d(0, 18px, 0);
        transition:
          opacity 0.7s cubic-bezier(0.2, 0.6, 0.2, 1),
          transform 0.7s cubic-bezier(0.2, 0.6, 0.2, 1);
        will-change: opacity, transform;
      }
      .lg-reveal.lg-in-view {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      .lg-reveal-stagger > * {
        opacity: 0;
        transform: translate3d(0, 14px, 0);
        transition:
          opacity 0.55s cubic-bezier(0.2, 0.6, 0.2, 1),
          transform 0.55s cubic-bezier(0.2, 0.6, 0.2, 1);
        will-change: opacity, transform;
      }
      .lg-reveal-stagger.lg-in-view > * {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      .lg-reveal-stagger.lg-in-view > *:nth-child(1) { transition-delay: 0.02s; }
      .lg-reveal-stagger.lg-in-view > *:nth-child(2) { transition-delay: 0.08s; }
      .lg-reveal-stagger.lg-in-view > *:nth-child(3) { transition-delay: 0.14s; }
      .lg-reveal-stagger.lg-in-view > *:nth-child(4) { transition-delay: 0.20s; }
      .lg-reveal-stagger.lg-in-view > *:nth-child(5) { transition-delay: 0.26s; }
      .lg-reveal-stagger.lg-in-view > *:nth-child(6) { transition-delay: 0.32s; }
      .lg-reveal-stagger.lg-in-view > *:nth-child(7) { transition-delay: 0.36s; }
      .lg-reveal-stagger.lg-in-view > *:nth-child(8) { transition-delay: 0.40s; }

      /* ── Hero entrance ── */
      @keyframes lgHeroFadeUp {
        from { opacity: 0; transform: translate3d(0, 14px, 0); }
        to   { opacity: 1; transform: translate3d(0, 0, 0); }
      }
      .lg-hero-enter > * {
        opacity: 0;
        animation: lgHeroFadeUp 0.7s cubic-bezier(0.2, 0.6, 0.2, 1) forwards;
        will-change: opacity, transform;
      }
      .lg-hero-enter > *:nth-child(1) { animation-delay: 0.05s; }
      .lg-hero-enter > *:nth-child(2) { animation-delay: 0.14s; }
      .lg-hero-enter > *:nth-child(3) { animation-delay: 0.22s; }
      .lg-hero-enter > *:nth-child(4) { animation-delay: 0.30s; }
      .lg-hero-enter > *:nth-child(5) { animation-delay: 0.42s; }
      .lg-hero-right-enter {
        opacity: 0;
        animation: lgHeroFadeUp 0.8s cubic-bezier(0.2, 0.6, 0.2, 1) 0.35s forwards;
        will-change: opacity, transform;
      }

      /* ── Card hover lift + soft glow ── */
      .lg-card-hover {
        transition:
          transform 0.3s cubic-bezier(0.2, 0.6, 0.2, 1),
          box-shadow 0.3s cubic-bezier(0.2, 0.6, 0.2, 1),
          border-color 0.3s ease;
        will-change: transform;
      }
      @media (hover: hover) {
        .lg-card-hover:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 216, 124, 0.22);
          box-shadow:
            0 18px 40px -22px rgba(255, 216, 124, 0.28),
            0 0 0 1px rgba(255, 216, 124, 0.08);
        }
        .lg-feature-cell {
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .lg-feature-cell:hover {
          transform: translateY(-2px);
        }
      }

      /* ── Mobile horizontal swipe (< 768px) ── */
      @media (max-width: 767px) {
        .lg-mobile-swipe {
          display: flex !important;
          grid-template-columns: none !important;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: visible;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: 14px;
          padding: 6px 24px 18px;
          margin: 0 -32px;
          scroll-padding-left: 24px;
        }
        .lg-mobile-swipe::-webkit-scrollbar {
          display: none;
        }
        .lg-mobile-swipe > * {
          flex: 0 0 82%;
          max-width: 82%;
          scroll-snap-align: start;
          min-width: 0;
        }
        .lg-mobile-swipe > *:last-child {
          margin-right: 8px;
        }
        /* Features grid uses gap-as-border on desktop; restore solid card edges on mobile */
        .lg-mobile-swipe-features {
          background: transparent !important;
          border: none !important;
          gap: 14px;
          /* Override the inline overflow:hidden from the desktop card so the horizontal swipe is not silently disabled. */
          overflow: visible !important;
          overflow-x: auto !important;
          overflow-y: visible !important;
        }
        .lg-mobile-swipe-features > .lg-feature-cell {
          border: 1px solid rgba(255, 216, 124, 0.12);
          border-radius: 16px;
        }
        /* Restore stagger reveal initial state inside the swipe row */
        .lg-reveal-stagger.lg-mobile-swipe > * {
          opacity: 0;
          transform: translate3d(0, 12px, 0);
        }
        .lg-reveal-stagger.lg-mobile-swipe.lg-in-view > * {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .lg-reveal,
        .lg-reveal-stagger > *,
        .lg-hero-enter > *,
        .lg-hero-right-enter {
          opacity: 1 !important;
          transform: none !important;
          animation: none !important;
          transition: none !important;
        }
        .lg-gold-text,
        .lg-marquee-track {
          animation: none !important;
        }
      }
`;

export function LandingStyles() {
  return <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />;
}
