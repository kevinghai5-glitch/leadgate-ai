import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
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
} from "lucide-react";

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group border-b border-white/10 last:border-0">
      <summary className="flex cursor-pointer items-center justify-between py-5 text-left text-lg font-medium text-white hover:text-indigo-400 transition-colors">
        {question}
        <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950/40 via-[#070b14] to-purple-950/30">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <AnimateOnScroll>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-400 mb-8">
                <Dumbbell className="h-4 w-4" />
                Built for High-Ticket Online Fitness Coaches
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Sign{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6"
                >
                  <Link href="/signup">
                    Start Getting Better Leads
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white/15 bg-white/5 text-white hover:bg-white/10">
                  <Link href="#how-it-works">See How It Works</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Setup in 5 minutes
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No tech skills required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Built for Serious Coaches */}
      <section className="border-y border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AnimateOnScroll>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-10">
              Built for Serious Coaches
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  text: "Built for coaches closing $1K\u2013$10K+ offers",
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
                  className="flex items-start gap-4 p-6 rounded-xl glass-card"
                >
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-indigo-400" />
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

          <div className="grid md:grid-cols-3 gap-8">
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
                  "Our AI scores every prospect on commitment level, budget fit, and readiness \u2014 so you know exactly who\u2019s ready to invest in high-ticket online coaching.",
              },
              {
                step: "03",
                icon: CalendarCheck,
                title: "Qualified Leads Book Instantly",
                description:
                  "High-scoring prospects see your Calendly link and book a discovery call on the spot. Low-intent leads get a polite follow-up \u2014 your calendar stays protected.",
              },
            ].map((item, i) => (
              <AnimateOnScroll key={item.step} delay={i * 120}>
                <div className="relative p-8 rounded-2xl glass-card hover:border-white/15 transition-all">
                  <div className="text-6xl font-bold text-white/5 absolute top-4 right-6">
                    {item.step}
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-indigo-400" />
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

      {/* Benefits */}
      <section className="py-24 bg-black/20">
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
                title: "1\u20132 Extra Premium Clients per Month",
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
                title: "Know Who\u2019s Ready to Invest",
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
                  "Pre-built questions about transformation goals, investment readiness, and coaching format \u2014 designed for premium online fitness programs.",
              },
            ].map((feature, i) => (
              <AnimateOnScroll key={feature.title} delay={(i % 3) * 100}>
                <div className="p-6 rounded-xl glass-card hover:border-white/15 transition-all">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-indigo-400" />
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
            <div className="divide-y divide-white/10 rounded-2xl glass-card px-6">
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

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-black/20">
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
              <div className="rounded-2xl border-2 border-indigo-500/50 p-8 glass-card shadow-xl shadow-indigo-500/10">
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
                      <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  asChild
                  className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-indigo-600/10 border-y border-white/5">
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
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6"
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
      <footer className="border-t border-white/5 bg-black/30 text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25" />
                <div className="relative h-full w-full rounded-lg flex items-center justify-center">
                  <Zap className="h-[18px] w-[18px] text-white" />
                </div>
              </div>
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
  );
}
