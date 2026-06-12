"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Sales call booking ───────────────────────────────────────────────────
// Cal.com / Calendly link that handles Zoom auto-creation. Swap the URL
// below for your real booking link — keep the env override so prod can
// point somewhere different from local without a code change.
const SALES_CALL_URL =
  process.env.NEXT_PUBLIC_SALES_CALL_URL ||
  "https://cal.com/leadgate-ai/sales-call";

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
  { id: 1, name: "Mike R.", initials: "MR", color: "#c26b5e", status: "Broke", reason: "Wants results but can't afford coaching. Asked for a free program instead." },
  { id: 2, name: "Sarah T.", initials: "ST", color: "#a87455", status: "Tire-kicker", reason: "Shopping 4 coaches. No timeline. Vibe: just gathering info." },
  { id: 3, name: "David L.", initials: "DL", color: "#b5825e", status: "Not ready", reason: "Looking for free workout plans. Not in the market for 1:1 coaching." },
  { id: 4, name: "James K.", initials: "JK", color: "#986650", status: "Wrong fit", reason: "Wants to become a coach. Not looking to hire one." },
  { id: 5, name: "Alex P.", initials: "AP", color: "#a07355", status: "No-show risk", reason: "Signals: low commitment, vague goals, no stated budget." },
];

const GOOD_LEADS: GoodLead[] = [
  { id: 1, name: "Emma B.", initials: "EB", status: "Qualified", score: 94, reason: "Clear goal: lose 20lbs in 12 weeks. Budget approved. Ready to start this week.", meta: "Goal: fat loss · Budget confirmed" },
  { id: 2, name: "John D.", initials: "JD", status: "Qualified", score: 91, reason: "Busy exec, tried DIY, ready to pay for structure and accountability. High commitment.", meta: "Exec · Hires coaches · Urgent" },
  { id: 3, name: "Lisa M.", initials: "LM", status: "Qualified", score: 88, reason: "Post-partum, 6 months in. Has trained before. Specific goal, specific timeline.", meta: "Returning client type" },
  { id: 4, name: "Mark S.", initials: "MS", status: "Qualified", score: 96, reason: "Competitor prep, 16 weeks out. Knows what he needs. Done this before. Pays upfront.", meta: "Competitor · Pays upfront" },
  { id: 5, name: "Rachel W.", initials: "RW", status: "Qualified", score: 90, reason: "Wedding in 5 months. Specific goal, hard deadline, budget ready.", meta: "Hard deadline · Motivated" },
];

const LOGOS = [
  { name: "Calendly", logo: "calendly" },
  { name: "Instagram", logo: "instagram" },
  { name: "TikTok", logo: "tiktok" },
  { name: "YouTube", logo: "youtube" },
  { name: "Stan", logo: "stan" },
  { name: "Linktree", logo: "linktree" },
  { name: "Email", logo: "email" },
  { name: "Website", logo: "website" },
];

const FEATURES = [
  { icon: "brain", title: "AI lead scoring (1–10)", desc: "Every prospect gets scored on budget fit, timeline, motivation, and readiness. You set the threshold." },
  { icon: "gate", title: "The Lead Gate™", desc: "Only prospects above your minimum score see your Calendly link. Everyone else gets a polite follow-up." },
  { icon: "sliders", title: "Build your own form", desc: "You design the qualifying questions for your offer — short text, long text, or dropdown. Tailor every question to your exact coaching niche." },
  { icon: "calendar", title: "Calendly integration", desc: "Qualified leads see your Calendly link the second they're approved and book on the spot." },
  { icon: "chart", title: "Analytics dashboard", desc: "Total leads, qualification rate, projected revenue — all at a glance. Know who's worth following up." },
  { icon: "bolt", title: "Embed anywhere", desc: "Share your unique link or drop the embed code on your website. Setup takes about 5 minutes." },
];

const STEPS = [
  { num: "01", title: "Prospects fill out your form", desc: "Share your unique link or embed the form on your site. Prospects answer questions about their goals, commitment, and investment readiness." },
  { num: "02", title: "AI identifies serious buyers", desc: "Our AI scores every prospect on commitment level, budget fit, and readiness — you know exactly who's ready to invest in high-ticket online coaching." },
  { num: "03", title: "Qualified leads book instantly", desc: "High-scoring prospects see your Calendly link and book a discovery call on the spot. Low-intent leads get a polite follow-up." },
];

const PAINS = [
  { quote: "I just spent 45 minutes pitching someone who can't afford a $1000 coaching program.", label: "every coach, every week" },
  { quote: "My calendar is full. My bank account doesn't show it.", label: "the high-volume trap" },
  { quote: "Half the people who book don't even show up. The other half want a free program.", label: "the discovery call death spiral" },
];

const FAQS = [
  { q: "How does LeadGate AI help me sign more high-ticket clients?", a: "LeadGate AI pre-qualifies every prospect that fills out your form using AI scoring. By filtering out people who aren't ready to invest in premium online coaching, you only spend time on discovery calls with serious buyers — which means higher close rates and more high-ticket sign-ups each month." },
  { q: "Do I need technical skills to set up?", a: "Not at all. Sign up, customize your form questions if you like, and share your unique link — or paste the embed code onto your website. The entire setup takes about 5 minutes." },
  { q: "Can I customize the questions for my coaching niche?", a: "Yes — LeadGate works across any niche (fitness, business, mindset, executive, relationships, and more) because you build your own questions. Use the Form Builder to add, edit, reorder, and remove the questions you want to ask. Name, email, and phone are always included." },
  { q: "How does the lead scoring work?", a: "Our AI evaluates each prospect on budget fit, timeline, motivation level, and overall readiness. Each lead gets a score from 1–10. You set the minimum qualifying score, and only leads above that threshold see your booking link." },
  { q: "How do I get started?", a: "Sign up, customize your form questions if you like, and share your unique link — or paste the embed code onto your website. The entire setup takes about 5 minutes." },
  { q: "Can I integrate this with my existing website?", a: "Absolutely. You can embed the lead qualification form on any website with a simple iframe code snippet, or just share the direct link on social media, in emails, or anywhere you connect with prospects." },
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

function Icon({ name, size = 20, stroke = 1.5, className = "", style = {} }: IconProps) {
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
    case "calendly":
      return (
        <div style={wrap}>
          <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="currentColor" /></svg>
          <span>Calendly</span>
        </div>
      );
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

function Nav({ onCTA }: { onCTA: () => void }) {
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
    { label: "Pricing", href: "#pricing" },
    { label: "Case Studies", href: "#cases" },
    { label: "FAQ", href: "#faq" },
  ];

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
            Log in
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
            Get Started <Icon name="arrow-right" size={14} stroke={2.2} />
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
              Log in
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
              Get Started <Icon name="arrow-right" size={14} stroke={2.2} />
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
        <Icon name="sparkle" size={14} className={isGood ? "lg-gold-text" : ""} style={{ color: isGood ? undefined : "#ff8a8a" }} />
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: isGood ? "#ffd87c" : "#ff8a8a" }}>
          AI Reasoning · {lead.name}
        </div>
        {isGood && score !== undefined && (
          <div className="lg-gold-text" style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700 }}>
            Score {score}/100
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#d4cdbc", lineHeight: 1.5 }}>{lead.reason}</div>
      {meta && <div style={{ marginTop: 6, fontSize: 11, color: "#8a7d6e" }}>{meta}</div>}
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
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 30,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 28,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,216,124,0.7))",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#b9b09a",
              }}
            >
              Lead qualification for high-ticket coaches
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(44px, 5.2vw, 72px)", lineHeight: 1.02, margin: 0, fontWeight: 600, letterSpacing: "-0.035em", color: "#f5f1e6" }}>
            Stop coaching
            <br />
            <span className="lg-gold-text" style={{ fontWeight: 500 }}>broke leads</span>
            <br />
            for free.
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.55, color: "#a49e8e", marginTop: 24, marginBottom: 28, maxWidth: 520 }}>
            LeadGate AI pre-qualifies every prospect using advanced AI so you only get high-quality discovery calls with people who are serious, qualified, and ready to invest in premium online coaching.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px 0", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Eliminate time-wasters", "Increase show-up rates", "Close more high-ticket clients"].map((t) => (
              <li key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#d4cdbc" }}>
                <span
                  className="lg-gold-text"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "rgba(255,216,124,0.1)",
                    border: "1px solid rgba(255,216,124,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="check" size={12} stroke={2.5} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              className="lg-btn-gold"
              onClick={onCTA}
              style={{ padding: "14px 24px", borderRadius: 12, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            >
              Start Filtering Leads <Icon name="arrow-right" size={15} stroke={2.4} />
            </button>
            <button
              className="lg-btn-ghost"
              onClick={onVideo}
              style={{ padding: "14px 22px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500, fontSize: 16 }}
            >
              <Icon name="play-circle" size={18} stroke={2} style={{ color: "#ffd87c" }} />
              See How It Works
            </button>
            <a
              href={SALES_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="lg-btn-ghost"
              style={{ padding: "14px 22px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 500, fontSize: 16, textDecoration: "none" }}
            >
              <Icon name="video" size={18} stroke={2} style={{ color: "#ffd87c" }} />
              Talk to Sales
            </a>
          </div>

          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              color: "#7d7666",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 8px rgba(74,222,128,0.6)",
              }}
            />
            15-min Zoom · No pitch, just answers · Talk directly with the founder
          </p>
        </div>

        {/* RIGHT */}
        <div className="lg-hero-right-enter" style={{ position: "relative" }}>
          <div className="lg-hero-compare" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start", position: "relative" }}>
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

          <div style={{ position: "absolute", top: -34, left: 0, fontSize: 11, color: "#6a6458", display: "flex", alignItems: "center", gap: 6 }}>
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
  const [score, setScore] = React.useState(87);
  React.useEffect(() => {
    const scores = [87, 92, 76, 94, 81, 90, 88];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % scores.length;
      setScore(scores[i]);
    }, 1400);
    return () => clearInterval(t);
  }, []);
  const r = 16;
  const c = 2 * Math.PI * r;
  const pct = score / 100;
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
      <span className="lg-gold-text" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "-0.02em" }}>{score}</span>
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
    { label: "C", color: "#006BFF" },
    { label: "F", color: "#ffd87c" },
    { label: "✦", color: "#7fe2a8" },
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

function SocialProof() {
  const widgets: { widget: React.ReactNode; title: string; sub: string }[] = [
    { widget: <MiniAIScore />, title: "AI scoring", sub: "1–10 on every lead" },
    { widget: <MiniGate />, title: "Pre-qualified", sub: "before they book" },
    { widget: <MiniIntegrations />, title: "Calendly-ready", sub: "embeds anywhere" },
  ];
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 32px" }}>
      <div className="lg-social-grid">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex" }}>
            {[11, 47, 33, 52, 22].map((id, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={id}
                src={`https://i.pravatar.cc/64?img=${id}`}
                alt=""
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "2px solid #0d0d0d",
                  outline: "1px solid rgba(255,216,124,0.35)",
                  marginLeft: i === 0 ? 0 : -12,
                  zIndex: 10 - i,
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f5f1e6", letterSpacing: "-0.01em" }}>
              Built for <span className="lg-gold-text">coaches like you</span>
            </div>
            <div style={{ fontSize: 11.5, color: "#8a7d6e", marginTop: 2 }}>
              Online coaches done with tire-kickers
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
          Three steps. <span className="lg-gold-text" style={{ fontWeight: 400 }}>Fifteen minutes.</span>
        </h2>
        <p style={{ fontSize: 16, color: "#a49e8e", maxWidth: 600, margin: "14px auto 0" }}>
          From signup to gating your first lead. Faster than making a coffee.
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
          Built from the ground up for coaches who are done wasting Tuesdays on discovery calls that go nowhere.
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
              className="lg-gold-text"
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "rgba(255,216,124,0.08)",
                border: "1px solid rgba(255,216,124,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={f.icon} size={20} />
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
          We built LeadGate because we kept hearing the same three things from online coaches. If you&apos;ve thought any of these in the last 30 days, keep reading.
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
                — {p.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 40, fontSize: 13, color: "#6a6458", fontStyle: "italic" }}>
        Real coach testimonials coming soon. We&apos;re onboarding our first wave now.
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
          Same leads, same niche. The only thing that changes is what reaches your booking link.
        </p>
      </div>

      <div className="lg-cases-grid lg-reveal-stagger">
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
          }}
        >
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

      <p
        className="lg-reveal"
        style={{
          margin: "32px 0 0",
          fontSize: 13,
          color: "#6a6458",
          textAlign: "center",
        }}
      >
        No staged screenshots, no invented testimonials — just a qualification layer that does one job well.
      </p>
    </section>
  );
}

function Pricing({ onCTA }: { onCTA: () => void }) {
  const features = [
    "Unlimited lead qualification",
    "AI-powered scoring & summaries",
    "High-ticket coaching form questions",
    "Custom form questions",
    "Calendly integration",
    "Lead analytics dashboard",
    "Embeddable form for your website",
    "Priority support",
  ];

  return (
    <section id="pricing" style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="lg-reveal" style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
          PRICING
        </div>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", margin: 0, letterSpacing: "-0.03em", fontWeight: 600, color: "#f5f1e6" }}>
          One simple plan. <span className="lg-gold-text" style={{ fontWeight: 500 }}>More premium clients.</span>
        </h2>
        <p style={{ fontSize: 16, color: "#a49e8e", maxWidth: 580, margin: "14px auto 0" }}>
          Pays for itself with one high-ticket client. No hidden fees.
        </p>
      </div>

      <div className="lg-reveal" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div
          className="lg-gold-border"
          style={{
            background: "linear-gradient(180deg, #120d02 0%, #0a0805 100%)",
            borderRadius: 20,
            padding: "40px 36px",
            position: "relative",
            boxShadow: "0 30px 80px -20px rgba(255,216,124,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 22, color: "#f5f1e6", letterSpacing: "-0.015em" }}>Pro Plan</h3>
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
              <Icon name="sparkle" size={11} /> Everything included
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#8a7d6e", marginBottom: 26 }}>For high-ticket online coaches in any niche.</div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
            <span className="lg-gold-text" style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1 }}>
              $499
            </span>
            <span style={{ fontSize: 16, color: "#8a7d6e" }}>/month</span>
          </div>

          <div className="lg-divider-gold" style={{ marginBottom: 22 }} />

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "flex", flexDirection: "column", gap: 13 }}>
            {features.map((f, j) => (
              <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "#e8e2d0" }}>
                <span
                  className="lg-gold-text"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginTop: 1,
                    background: "rgba(255,216,124,0.1)",
                    border: "1px solid rgba(255,216,124,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="check" size={12} stroke={2.8} />
                </span>
                {f}
              </li>
            ))}
          </ul>

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
            Get Started <Icon name="arrow-right" size={15} stroke={2.4} />
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#6a6458" }}>
            Pays for itself with one high-ticket client. Cancel anytime.
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = React.useState<number>(0);
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
            <Icon name="sparkle" size={12} /> One plan · Get started in 5 minutes
          </div>
          <h2 style={{ margin: 0, fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.035em", fontWeight: 600, color: "#f5f1e6", lineHeight: 1.05 }}>
            Your next call could be
            <br />
            <span className="lg-gold-text" style={{ fontWeight: 400 }}>a closed deal</span>.
          </h2>
          <p style={{ fontSize: 16, color: "#a49e8e", maxWidth: 560, margin: "18px auto 32px" }}>
            Join 1,250+ coaches who stopped wasting time on tire-kickers and started talking only to buyers.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="lg-btn-gold"
              onClick={onCTA}
              style={{ padding: "15px 28px", borderRadius: 12, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              Get Started <Icon name="arrow-right" size={15} stroke={2.4} />
            </button>
            <a
              href={SALES_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="lg-btn-ghost"
              style={{ padding: "15px 28px", borderRadius: 12, fontSize: 15, cursor: "pointer", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}
            >
              <Icon name="video" size={18} stroke={2} style={{ color: "#ffd87c" }} />
              Talk to Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Pricing", "Case Studies", "Changelog"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
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
            The AI that filters your leads so you only talk to clients ready to invest.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#ffd87c", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>
              {col.title}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" style={{ color: "#a49e8e", textDecoration: "none", fontSize: 13 }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="lg-divider-gold" style={{ marginBottom: 20 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#6a6458", flexWrap: "wrap", gap: 12 }}>
        <div>© 2026 LeadGate AI · All rights reserved.</div>
        <div>Made for high-ticket coaches who close.</div>
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
            background: "linear-gradient(135deg, #1a1408, #0a0805)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.3, background: "radial-gradient(circle at 50% 50%, rgba(255,216,124,0.3), transparent 60%)" }} />
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: "var(--lg-gold-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 40px rgba(255,216,124,0.4)",
              cursor: "pointer",
              color: "#1a1200",
            }}
          >
            <Icon name="play" size={32} stroke={0} />
          </div>
          <div style={{ position: "absolute", bottom: 24, left: 24, fontSize: 14, color: "#a49e8e" }}>
            How LeadGate works in 60 seconds
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

function useScrollReveal() {
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

export default function LandingPage() {
  const router = useRouter();
  const [videoOpen, setVideoOpen] = React.useState(false);
  useScrollReveal();

  const goToSignup = React.useCallback(() => {
    router.push("/signup");
  }, [router]);

  return (
    <div className="lg-root lg-grain">
      <LandingStyles />
      <Nav onCTA={goToSignup} />
      <main>
        <Hero onCTA={goToSignup} onVideo={() => setVideoOpen(true)} />
        <SocialProof />
        <Logos />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Cases />
        <Pricing onCTA={goToSignup} />
        <FAQ />
        <FinalCTA onCTA={goToSignup} />
      </main>
      <Footer />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
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
          padding-top: 110px;
          padding-bottom: 60px;
        }
        .lg-hero-grid {
          padding: 0 18px;
          gap: 36px;
        }
        .lg-hero-compare {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }
        .lg-hero-arrow {
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) rotate(90deg) !important;
        }
        .lg-social-grid {
          grid-template-columns: 1fr;
        }
        .lg-footer-grid {
          grid-template-columns: 1fr;
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

function LandingStyles() {
  return <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />;
}
