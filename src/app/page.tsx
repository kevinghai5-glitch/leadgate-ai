import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { DottedSurface } from "@/components/ui/dotted-surface";
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
      <summary className="flex cursor-pointer items-center justify-between py-5 text-left text-lg font-medium text-white/90 hover:text-[#FFD700] transition-colors">
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.05)_0%,transparent_65%)]" />
        {/* Mid-right subtle glow */}
        <div className="absolute top-[45%] right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(184,134,11,0.04)_0%,transparent_70%)]" />
        {/* Bottom-left subtle glow */}
        <div className="absolute top-[80%] left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,215,0,0.03)_0%,transparent_70%)]" />
        {/* Overall top fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#030303] to-[#030303]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-28 relative">
          {/* Animated gold dotted surface — hero background */}
          <DottedSurface className="absolute inset-0 w-full h-full overflow-hidden" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(255,215,0,0.06)_0%,transparent_100%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <AnimateOnScroll>
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 px-4 py-1.5 text-sm font-medium text-[#D4A017] mb-8">
                  <Dumbbell className="h-4 w-4" />
                  Built for High-Ticket Online Fitness Coaches
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                  Sign{" "}
                  <span className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                    MORE premium clients
                  </span>{" "}
                  every month
                </h1>
                <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  LeadGate AI pre-qualifies every prospect before they book a
                  call — so you only spend time with people who are ready to
                  invest in high-ticket online coaching.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black font-semibold text-lg px-8 py-6 shadow-lg shadow-[rgba(255,215,0,0.15)] hover:shadow-[rgba(255,215,0,0.25)] hover:scale-[1.02] transition-all duration-200"
                  >
                    <Link href="/signup">
                      Start Getting Better Leads
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.07] hover:text-white hover:border-white/20 transition-all duration-200">
                    <Link href="#how-it-works">See How It Works</Link>
                  </Button>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500/80" />
                    Setup in 5 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500/80" />
                    No tech skills required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500/80" />
                    Cancel anytime
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
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
                <div className="rounded-2xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] p-8 h-full hover:shadow-[0_4px_20px_rgba(255,215,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
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
                <div className="rounded-2xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-[#FFD700]/[0.12] p-8 h-full hover:shadow-[0_4px_20px_rgba(255,215,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
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
                  <div className="relative p-8 rounded-2xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_4px_20px_rgba(255,215,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                    <div className="text-6xl font-bold text-white/[0.03] absolute top-4 right-6">
                      {item.step}
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-[#D4A017]" />
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <div className="p-6 rounded-xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_4px_20px_rgba(255,215,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                    <div className="h-10 w-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center mb-3">
                      <feature.icon className="h-5 w-5 text-[#D4A017]" />
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

        {/* Built for Serious Coaches — moved above FAQ */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-10">
                Built for Serious Coaches
              </h2>
              <div className="grid md:grid-cols-3 gap-5">
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
                    className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-b from-[#0F0F0F] to-[#070707] border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_4px_20px_rgba(255,215,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="h-10 w-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-[#D4A017]" />
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
                <div className="rounded-2xl border border-[#FFD700]/30 p-8 bg-gradient-to-b from-[#0F0F0F] to-[#070707] shadow-2xl shadow-[rgba(255,215,0,0.08)] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
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
                        <CheckCircle2 className="h-5 w-5 text-[#B8860B] flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    asChild
                    className="w-full mt-8 bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black font-semibold shadow-lg shadow-[rgba(255,215,0,0.15)] hover:shadow-[rgba(255,215,0,0.25)] hover:scale-[1.01] transition-all duration-200"
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
                  className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black font-semibold text-lg px-8 py-6 shadow-lg shadow-[rgba(255,215,0,0.15)] hover:shadow-[rgba(255,215,0,0.25)] hover:scale-[1.02] transition-all duration-200"
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
                <Zap className="h-5 w-5 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                <span className="text-lg font-bold text-white">
                  LeadGate <span className="text-[#FFD700]">AI</span>
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
