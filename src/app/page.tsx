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
    <details className="group border-b border-gray-200 last:border-0">
      <summary className="flex cursor-pointer items-center justify-between py-5 text-left text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
        {question}
        <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <p className="pb-5 text-gray-600 leading-relaxed">{answer}</p>
    </details>
  );
}

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <AnimateOnScroll>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-8">
                <Dumbbell className="h-4 w-4" />
                Built for Fitness Coaches
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Get{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  1–2 extra clients
                </span>{" "}
                every month
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                LeadGate AI pre-qualifies every prospect before they book a
                call — so you only spend time with people who are ready to
                commit to their fitness journey.
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
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                  <Link href="#how-it-works">See How It Works</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Setup in 5 minutes
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  No tech skills required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="border-y bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimateOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Fitness Coaches Served", value: "500+" },
                { label: "Leads Qualified", value: "50,000+" },
                { label: "Avg Close Rate Increase", value: "3.2x" },
                { label: "Hours Saved per Week", value: "10+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
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
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                How You Get More Clients
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Three simple steps — set it up once, and let AI do the
                filtering so every call you take is worth your time.
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
                  "Share your unique link or embed the form on your site. Prospects answer fitness-specific questions about their goals, budget, and timeline.",
              },
              {
                step: "02",
                icon: Target,
                title: "AI Identifies Serious Buyers",
                description:
                  "Our AI scores every prospect on commitment level, budget fit, and readiness — so you know exactly who's ready to invest in coaching.",
              },
              {
                step: "03",
                icon: CalendarCheck,
                title: "Qualified Leads Book Instantly",
                description:
                  "High-scoring prospects see your Calendly link and book a call on the spot. Low-intent leads get a polite follow-up page.",
              },
            ].map((item, i) => (
              <AnimateOnScroll key={item.step} delay={i * 120}>
                <div className="relative p-8 rounded-2xl border bg-white hover:shadow-lg transition-shadow">
                  <div className="text-6xl font-bold text-gray-100 absolute top-4 right-6">
                    {item.step}
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Results That Grow Your Business
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Stop chasing cold leads. Start closing clients who are ready
                to train.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "1–2 Extra Clients per Month",
                description:
                  "By filtering out tire-kickers before they reach your calendar, every sales call has a higher chance of converting.",
              },
              {
                icon: Clock,
                title: "10+ Hours Saved Weekly",
                description:
                  "No more back-and-forth with unqualified leads. Spend your time coaching, not chasing.",
              },
              {
                icon: UserCheck,
                title: "Know Who's Ready to Buy",
                description:
                  "AI scoring tells you exactly which prospects have the budget, motivation, and timeline to commit.",
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
                title: "Built for Fitness Coaches",
                description:
                  "Pre-built questions about fitness goals, training preferences, and budget — designed for your niche.",
              },
            ].map((feature, i) => (
              <AnimateOnScroll key={feature.title} delay={(i % 3) * 100}>
                <div className="p-6 rounded-xl border bg-white transition-shadow hover:shadow-lg">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
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
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to know before getting started.
              </p>
            </div>
            <div className="divide-y divide-gray-200 rounded-2xl border bg-white px-6">
              <FAQItem
                question="How does LeadGate AI help me get more clients?"
                answer="LeadGate AI pre-qualifies every prospect that fills out your form using AI scoring. By filtering out people who aren't ready to commit, you only spend time on calls with serious buyers — which means higher close rates and more paying clients each month."
              />
              <FAQItem
                question="Do I need technical skills to set up?"
                answer="Not at all. Sign up, customize your form questions if you like, and share your unique link — or paste the embed code onto your website. The entire setup takes about 5 minutes."
              />
              <FAQItem
                question="Can I customize the questions for my fitness niche?"
                answer="Yes! The form comes pre-loaded with fitness-specific questions (goals, budget, training preferences), but you can add, remove, or reorder questions from your Settings page to match your exact niche."
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
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                One Simple Plan. More Clients.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to fill your calendar with qualified
                prospects. No hidden fees.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="rounded-2xl border-2 border-indigo-600 p-8 bg-white shadow-xl">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">Pro Plan</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">$499</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Pays for itself with one extra client
                  </p>
                </div>
                <ul className="mt-8 space-y-3">
                  {[
                    "Unlimited lead qualification",
                    "AI-powered scoring & summaries",
                    "Fitness-specific form questions",
                    "Calendly integration",
                    "Slack notifications",
                    "Lead analytics dashboard",
                    "Custom scoring rules",
                    "Embeddable form for your website",
                    "Priority support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
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
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to fill your calendar with serious clients?
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              Set up in 5 minutes. Start getting better leads today.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6"
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
      <footer className="border-t bg-gray-950 text-gray-400">
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
              <span>Built for fitness coaches who want more clients</span>
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
