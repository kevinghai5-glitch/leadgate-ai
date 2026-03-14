import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { auth } from "@/lib/auth";
import {
  Zap,
  Shield,
  BarChart3,
  Calendar,
  Bot,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  Clock,
} from "lucide-react";

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
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-8">
              <Bot className="h-4 w-4" />
              AI-Powered Lead Qualification
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Stop wasting time on{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                unqualified leads
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              LeadGate AI automatically scores and qualifies your leads before
              they book a call. Only high-value prospects get through to your
              calendar.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6"
              >
                <Link href="#pricing">
                  See Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Setup in 5 minutes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Leads Qualified", value: "50,000+" },
              { label: "Time Saved per Week", value: "10+ hrs" },
              { label: "Avg Close Rate Increase", value: "3.2x" },
              { label: "Active Agencies", value: "500+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How LeadGate AI Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to filter out unqualified leads and focus your
              time on high-value prospects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Users,
                title: "Lead Fills Your Form",
                description:
                  "Share your unique qualification form link. Leads submit their details including budget, timeline, and problem description.",
              },
              {
                step: "02",
                icon: Bot,
                title: "AI Scores the Lead",
                description:
                  "Our AI engine evaluates the lead based on budget, timeline, urgency, and problem quality. Each lead gets a score from 1-10.",
              },
              {
                step: "03",
                icon: Calendar,
                title: "Qualified Leads Book Calls",
                description:
                  "High-scoring leads see your calendar and can book directly. Low-scoring leads get a polite thank-you page.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl border bg-white hover:shadow-lg transition-shadow"
              >
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
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to Qualify Leads
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: "AI Lead Scoring",
                description:
                  "GPT-powered scoring evaluates every lead on budget, timeline, urgency, and problem quality.",
              },
              {
                icon: Shield,
                title: "Lead Gate",
                description:
                  "Only qualified leads see your calendar. Unqualified leads get a polite thank-you page.",
              },
              {
                icon: Calendar,
                title: "Calendly Integration",
                description:
                  "Connect your Calendly link. Qualified leads book calls directly from the form.",
              },
              {
                icon: Zap,
                title: "Slack Notifications",
                description:
                  "Get instant Slack alerts when a qualified lead comes through with full AI insights.",
              },
              {
                icon: BarChart3,
                title: "Lead Analytics",
                description:
                  "Track total leads, qualification rate, and projected revenue in your dashboard.",
              },
              {
                icon: Target,
                title: "Custom Scoring Rules",
                description:
                  "Adjust scoring weights for budget, timeline, urgency, and quality to match your ideal client.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border bg-white transition-shadow hover:shadow-lg"
              >
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              One plan. Everything included. No hidden fees.
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
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Unlimited lead qualification",
                  "AI-powered scoring & summaries",
                  "Calendly integration",
                  "Slack notifications",
                  "Lead analytics dashboard",
                  "Custom scoring rules",
                  "Multi-tenant form links",
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
                <Link href="/signup">See Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to stop wasting time on bad leads?
          </h2>
          <p className="mt-4 text-xl text-indigo-100">
            Set up LeadGate AI in 5 minutes and start qualifying leads today.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              <Link href="/signup">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                LeadGate AI
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Clock className="h-4 w-4" />
              <span>Save 10+ hours per week qualifying leads</span>
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
