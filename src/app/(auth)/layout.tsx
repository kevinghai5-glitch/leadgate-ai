import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-dark min-h-screen flex flex-col items-center justify-center bg-[#030303] px-4">
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <Zap className="h-7 w-7 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.6)] group-hover:drop-shadow-[0_0_14px_rgba(255,215,0,0.8)] transition-all" />
        <span className="text-2xl font-bold text-white">
          LeadGate <span className="text-[#FFD700]">AI</span>
        </span>
      </Link>
      {children}
    </div>
  );
}
