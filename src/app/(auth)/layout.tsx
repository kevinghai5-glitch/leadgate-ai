import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25" />
          <div className="relative h-full w-full rounded-xl flex items-center justify-center">
            <Zap className="h-6 w-6 text-white drop-shadow-sm" />
          </div>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          LeadGate AI
        </span>
      </Link>
      {children}
    </div>
  );
}
