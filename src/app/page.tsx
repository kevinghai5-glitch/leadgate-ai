import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { DemoVideo } from "@/components/ui/demo-video";
import { CountUp } from "@/components/ui/count-up";
import { VideoModal } from "@/components/ui/video-modal";
import { HeroCTA } from "@/components/ui/hero-cta";
import { ChevronsRight, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  Clock,
  TrendingUp,
  Dumbbell,
  ChevronDown,
  CalendarCheck,
  BarChart3,
  UserCheck,
  XCircle,
  ListChecks,
} from "lucide-react";

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group border-b border-white/[0.06] last:border-0">
      <summary className="flex cursor-pointer items-center justify-between py-5 text-left text-lg font-medium text-white/90 hover:text-[#ECCA66] transition-colors">
        {question}
        <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-600 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <p className="pb-5 text-gray-400 leading-relaxed">{answer}</p>
    </details>
  );
}

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="relative min-h-screen bg-[#030303] overflow-hidden">
      {/* Fixed depth layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Top-center gold glow — very faint */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(210,172,71,0.05)_0%,transparent_65%)]" />
        {/* Mid-right subtle glow */}
        <div className="absolute top-[45%] right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(176,139,115,0.04)_0%,transparent_70%)]" />
        {/* Bottom-left subtle glow */}
        <div className="absolute top-[80%] left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(210,172,71,0.03)_0%,transparent_70%)]" />
        {/* Overall top fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#030303] to-[#030303]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-28 relative">
          {/* Animated gold dotted surface — hero background */}
          <DottedSurface className="absolute inset-0 w-full h-full overflow-hidden" />
          {/* Soft gold spotlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_35%,rgba(245,208,122,0.10)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_75%_45%,rgba(201,169,91,0.08)_0%,transparent_70%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* LEFT: Headline + CTAs */}
              <AnimateOnScroll>
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#D2AC47]/10 border border-[#D2AC47]/20 px-4 py-1.5 text-sm font-medium text-[#ECCA66] mb-8">
                    <Dumbbell className="h-4 w-4" />
                    Built for High-Ticket Coaches
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                    Stop wasting calls.
                    <br />
                    Only talk to{" "}
                    <span className="bg-gradient-to-b from-[#F5D07A] via-[#E5BE5F] to-[#C9A95B] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(245,208,122,0.25)]">
                      clients
                    </span>
                    <br />
                    <span className="bg-gradient-to-b from-[#F5D07A] via-[#E5BE5F] to-[#C9A95B] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(245,208,122,0.25)]">
                      ready to invest.
                    </span>
                  </h1>
                  <p className="mt-6 text-lg text-gray-400 leading-relaxed">
                    LeadGate AI pre-qualifies every prospect using advanced AI so you only get high-quality calls with people who are serious, qualified, and ready to pay.
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {[
                      "Eliminate time-wasters",
                      "Increase show-up rates",
                      "Close more high-ticket clients",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-[#D2AC47] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <HeroCTA className="group inline-flex items-center justify-center bg-gradient-to-b from-[#F5D07A] via-[#D2AC47] to-[#B08B73] hover:from-[#F5D07A] hover:via-[#ECCA66] hover:to-[#D2AC47] text-black font-semibold text-base px-7 py-4 rounded-xl shadow-[0_8px_24px_-4px_rgba(210,172,71,0.35)] hover:shadow-[0_12px_32px_-4px_rgba(245,208,122,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-out">
                      Start Filtering Leads Now
                    </HeroCTA>
                    <VideoModal
                      videoSrc="/demo.mp4"
                      triggerLabel="See How It Works (60 sec)"
                      triggerClassName="group inline-flex items-center justify-center bg-black/40 hover:bg-[#D2AC47]/10 border border-[#D2AC47]/30 hover:border-[#D2AC47]/60 hover:shadow-[0_0_20px_rgba(210,172,71,0.15)] text-white text-base font-medium px-6 py-4 rounded-xl transition-all duration-300"
                    />
                  </div>
                </div>
              </AnimateOnScroll>

              {/* RIGHT: Comparison Cards */}
              <AnimateOnScroll delay={150}>
                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  {/* Without LeadGate AI */}
                  <div className="relative group rounded-2xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.08] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0A] border border-white/10 px-3 py-1 text-xs font-medium text-gray-400">
                      Without LeadGate AI
                    </div>
                    <div className="p-5 pt-7">
                      <p className="text-sm font-semibold text-white">Your Calendar</p>
                      <p className="text-xs text-gray-500 mt-0.5">Lots of calls. Low show rate. No results.</p>
                      <div className="mt-4 space-y-3">
                        {[
                          { name: "Mike R.", status: "No-show" },
                          { name: "Sarah T.", status: "Not a fit" },
                          { name: "David L.", status: "No-show" },
                          { name: "James K.", status: "Not qualified" },
                          { name: "Alex P.", status: "Not a fit" },
                        ].map((row) => (
                          <div key={row.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[10px] text-gray-400">
                                {row.name.charAt(0)}
                              </div>
                              <span className="text-sm text-gray-300">{row.name}</span>
                            </div>
                            <span className="text-xs text-red-400/90 font-medium">{row.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pulsing arrow between cards (desktop only) */}
                  <div className="hidden sm:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#0A0A0A] border border-[#D2AC47]/40 shadow-[0_0_20px_rgba(210,172,71,0.3)] animate-pulse">
                      <ChevronsRight className="h-5 w-5 text-[#F5D07A]" />
                    </div>
                  </div>

                  {/* With LeadGate AI */}
                  <div className="relative group rounded-2xl bg-gradient-to-b from-[#1a1503] to-[#0a0700] border border-[#D2AC47]/40 shadow-[0_0_30px_rgba(210,172,71,0.15)] hover:shadow-[0_0_40px_rgba(210,172,71,0.25)] hover:-translate-y-1 transition-all duration-300 animate-[gold-glow_3s_ease-in-out_infinite]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D2AC47] to-[#B08B73] px-3 py-1 text-xs font-semibold text-black">
                      With LeadGate AI <Sparkles className="h-3 w-3" />
                    </div>
                    <div className="p-5 pt-7">
                      <p className="text-sm font-semibold text-white">Your Calendar</p>
                      <p className="text-xs text-gray-500 mt-0.5">High-quality calls. High show rate. More clients.</p>
                      <div className="mt-4 space-y-3">
                        {["Emma B.", "John D.", "Lisa M.", "Mark S.", "Rachel W."].map((name) => (
                          <div key={name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-[#D2AC47]/15 border border-[#D2AC47]/30 flex items-center justify-center text-[10px] text-[#F5D07A]">
                                {name.charAt(0)}
                              </div>
                              <span className="text-sm text-gray-200">{name}</span>
                            </div>
                            <span className="text-xs text-emerald-400 font-medium">Qualified</span>
                          </div>
                        ))}
                      </div>

                      {/* Metrics */}
                      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-[#D2AC47]/30 bg-black/40 p-3">
                        <div>
                          <p className="text-[11px] text-gray-400">Show Rate Increase</p>
                          <p className="text-xl font-bold bg-gradient-to-b from-[#F5D07A] to-[#D2AC47] bg-clip-text text-transparent">
                            <CountUp end={62} prefix="+" suffix="%" />
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Qualified Leads Only</p>
                          <p className="text-xl font-bold bg-gradient-to-b from-[#F5D07A] to-[#D2AC47] bg-clip-text text-transparent">
                            <CountUp end={100} suffix="%" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* Before vs After */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  What Changes When You Use LeadGate AI
                </h2>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                  Stop wasting hours on unqualified calls. Start every conversation with a serious buyer.
                </p>
              </div>
            </AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimateOnScroll>
                <div className="rounded-xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] p-6 h-full hover:shadow-[0_4px_20px_rgba(210,172,71,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 uppercase tracking-wider mb-6">
                    Without LeadGate AI
                  </div>
                  <ul className="space-y-5">
                    {[
                      "Unqualified prospects fill your calendar",
                      "Hours wasted on calls that go nowhere",
                      "Low close rates drain your energy",
                      "No way to gauge buyer intent before a call",
                      "Revenue left on the table every month",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-400/70 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll delay={100}>
                <div className="rounded-xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-[#D2AC47]/[0.12] p-6 h-full hover:shadow-[0_4px_20px_rgba(210,172,71,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-6">
                    With LeadGate AI
                  </div>
                  <ul className="space-y-5">
                    {[
                      "Only pre-qualified, high-intent leads book calls",
                      "Fewer calls, but every one has real buying intent",
                      "Higher close rates because you start with quality",
                      "AI scores every prospect before they reach you",
                      "More revenue per call, less time wasted",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* How It Works */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  How You Land More Premium Clients
                </h2>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                  Three simple steps — set it up once, and let AI filter out
                  tire-kickers so every discovery call is with a serious buyer.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: Users,
                  title: "Prospects Fill Out Your Form",
                  description:
                    "Share your unique link or embed the form on your site. Prospects answer questions about their goals, commitment level, and investment readiness.",
                },
                {
                  step: "02",
                  icon: Target,
                  title: "AI Identifies Serious Buyers",
                  description:
                    "Our AI scores every prospect on commitment level, budget fit, and readiness — so you know exactly who's ready to invest in high-ticket online coaching.",
                },
                {
                  step: "03",
                  icon: CalendarCheck,
                  title: "Qualified Leads Book Instantly",
                  description:
                    "High-scoring prospects see your Calendly link and book a discovery call on the spot. Low-intent leads get a polite follow-up — your calendar stays protected.",
                },
              ].map((item, i) => (
                <AnimateOnScroll key={item.step} delay={i * 120}>
                  <div className="relative p-6 h-full rounded-2xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_4px_20px_rgba(210,172,71,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                    <div className="text-6xl font-bold text-white/[0.03] absolute top-4 right-6">
                      {item.step}
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-[#D2AC47]/10 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-[#ECCA66]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* Benefits */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Results That Scale Your Online Coaching Business
                </h2>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                  Stop chasing cold leads. Start closing premium clients who are
                  ready to invest in themselves.
                </p>
              </div>
            </AnimateOnScroll>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: "1–2 Extra Premium Clients per Month",
                  description:
                    "By filtering out tire-kickers before they reach your calendar, every discovery call has a higher chance of converting into a high-ticket sign-up.",
                },
                {
                  icon: Clock,
                  title: "10+ Hours Saved Weekly",
                  description:
                    "No more back-and-forth with unqualified leads. Spend your time coaching, not chasing.",
                },
                {
                  icon: UserCheck,
                  title: "Know Who's Ready to Invest",
                  description:
                    "AI scoring tells you exactly which prospects have the budget, motivation, and timeline to commit to premium online coaching.",
                },
                {
                  icon: CalendarCheck,
                  title: "Calls That Actually Convert",
                  description:
                    "Only serious prospects see your booking link. Your close rate goes up because every call is with a qualified lead.",
                },
                {
                  icon: BarChart3,
                  title: "Track Your Pipeline",
                  description:
                    "See your total leads, qualification rate, and projected revenue at a glance in your dashboard.",
                },
                {
                  icon: Dumbbell,
                  title: "Built for High-Ticket Online Coaches",
                  description:
                    "Pre-built questions about transformation goals, investment readiness, and coaching format — designed for premium online fitness programs.",
                },
              ].map((feature, i) => (
                <AnimateOnScroll key={feature.title} delay={(i % 3) * 100}>
                  <div className="p-6 h-full rounded-xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_4px_20px_rgba(210,172,71,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                    <div className="h-10 w-10 rounded-lg bg-[#D2AC47]/10 flex items-center justify-center mb-3">
                      <feature.icon className="h-5 w-5 text-[#ECCA66]" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* Tailor Every Question */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#D2AC47]/10 border border-[#D2AC47]/20 px-4 py-1.5 text-sm font-medium text-[#ECCA66] mb-6">
                  <ListChecks className="h-4 w-4" />
                  Custom Form Builder
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Tailor every question to your offer
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  "Use our proven form or build your own in seconds",
                  "Ask the exact questions that qualify YOUR ideal clients",
                  "Perfect for coaches selling high-ticket offers",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-start gap-3 p-6 rounded-xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_4px_20px_rgba(210,172,71,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#D2AC47] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 font-medium leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* Built for Serious Coaches — moved above FAQ */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-10">
                Built for Serious Coaches
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Target,
                    text: "Built for coaches closing $1K–$10K+ offers",
                  },
                  {
                    icon: Clock,
                    text: "Designed after watching thousands of unqualified calls waste time and kill conversions",
                  },
                  {
                    icon: UserCheck,
                    text: "Filters out low-quality leads before they ever hit your calendar",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-start gap-4 p-6 h-full rounded-xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_4px_20px_rgba(210,172,71,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="h-10 w-10 rounded-lg bg-[#D2AC47]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-[#ECCA66]" />
                    </div>
                    <p className="text-gray-300 font-medium leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* FAQ */}
        <section id="faq" className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-lg text-gray-400">
                  Everything you need to know before getting started.
                </p>
              </div>
              <div className="divide-y divide-white/[0.06] rounded-2xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] px-6">
                <FAQItem
                  question="How does LeadGate AI help me sign more high-ticket clients?"
                  answer="LeadGate AI pre-qualifies every prospect that fills out your form using AI scoring. By filtering out people who aren't ready to invest in premium online coaching, you only spend time on discovery calls with serious buyers — which means higher close rates and more high-ticket sign-ups each month."
                />
                <FAQItem
                  question="Do I need technical skills to set up?"
                  answer="Not at all. Sign up, customize your form questions if you like, and share your unique link — or paste the embed code onto your website. The entire setup takes about 5 minutes."
                />
                <FAQItem
                  question="Can I customize the questions for my coaching niche?"
                  answer="Yes! The form comes pre-loaded with questions tailored for high-ticket online fitness coaching (transformation goals, investment readiness, commitment level), but you can add, remove, or reorder questions from your Settings page to match your exact niche."
                />
                <FAQItem
                  question="How does the lead scoring work?"
                  answer="Our AI evaluates each prospect on budget fit, timeline, motivation level, and overall readiness. Each lead gets a score from 1–10. You set the minimum qualifying score, and only leads above that threshold see your booking link."
                />
                <FAQItem
                  question="Is there a free trial?"
                  answer="You can sign up and explore the dashboard for free. To activate AI lead scoring, analytics, and all premium features, subscribe to the Pro plan."
                />
                <FAQItem
                  question="Can I integrate this with my existing website?"
                  answer="Absolutely. You can embed the lead qualification form on any website with a simple iframe code snippet, or just share the direct link on social media, in emails, or anywhere you connect with prospects."
                />
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  One Simple Plan. More Premium Clients.
                </h2>
                <p className="mt-4 text-lg text-gray-400">
                  Everything you need to fill your calendar with qualified,
                  high-ticket prospects. No hidden fees.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="rounded-2xl border border-[#D2AC47]/30 p-8 bg-gradient-to-b from-[#0F0F0F] to-[#070707] shadow-2xl shadow-[rgba(210,172,71,0.08)] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D2AC47]/50 to-transparent" />
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-white">$499</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Pays for itself with one high-ticket client
                    </p>
                  </div>
                  <ul className="mt-8 space-y-3">
                    {[
                      "Unlimited lead qualification",
                      "AI-powered scoring & summaries",
                      "High-ticket coaching form questions",
                      "Calendly integration",
                      "Lead analytics dashboard",
                      "Custom form questions",
                      "Embeddable form for your website",
                      "Priority support",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#D2AC47] flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    asChild
                    className="w-full mt-8 bg-gradient-to-r from-[#D2AC47] to-[#B08B73] hover:from-[#ECCA66] hover:to-[#D2AC47] text-black font-semibold shadow-lg shadow-[rgba(210,172,71,0.15)] hover:shadow-[rgba(210,172,71,0.25)] hover:scale-[1.01] transition-all duration-200"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* CTA — full-width black section */}
        <section className="w-full bg-[#030303] py-24">
          <AnimateOnScroll>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to fill your calendar with premium coaching clients?
              </h2>
              <p className="mt-4 text-xl text-gray-400">
                Set up in 5 minutes. Start attracting high-ticket leads today.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-[#D2AC47] to-[#B08B73] hover:from-[#ECCA66] hover:to-[#D2AC47] text-black font-semibold text-lg px-8 py-6 shadow-lg shadow-[rgba(210,172,71,0.15)] hover:shadow-[rgba(210,172,71,0.25)] hover:scale-[1.02] transition-all duration-200"
                >
                  <Link href="/signup">
                    Start Getting Better Leads
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] text-gray-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-white" />
                <span className="text-lg font-bold text-white">
                  LeadGate AI
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Dumbbell className="h-4 w-4" />
                <span>Built for high-ticket online fitness coaches</span>
              </div>
              <p className="text-sm">
                &copy; {new Date().getFullYear()} LeadGate AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
