"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  LogOut,
  Zap,
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    /* Full-width positioning wrapper — fixed to top, sits above page content */
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-5">
      {/* Gold underglow — the "lit from below" streak effect */}
      <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 w-[600px] h-[80px] blur-[40px] bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.18)_0%,transparent_70%)]" />

      {/* Floating pill navbar */}
      <nav className="relative w-full max-w-5xl rounded-2xl border border-white/[0.08] bg-black/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-5 py-3">
        {/* Very subtle top highlight line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
          >
            <Zap
              className="h-5 w-5 text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.7)] transition-all duration-200"
            />
            <span className="text-[15px] font-semibold tracking-wide text-white">
              LeadGate{" "}
              <span className="text-[#FFD700]">AI</span>
            </span>
          </Link>

          {/* Center nav links — only on landing (not logged in) */}
          {!session && (
            <div className="hidden sm:flex items-center gap-1">
              {[
                { label: "Features", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-[#FFD700] rounded-lg hover:bg-[#FFD700]/[0.05] transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:bg-white/10"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#FFD700]/15 text-[#FFD700] text-sm font-semibold">
                        {session.user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-[#0A0A0A] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                  align="end"
                >
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="cursor-pointer text-gray-300 hover:text-white focus:text-white focus:bg-white/10"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="cursor-pointer text-gray-300 hover:text-white focus:text-white focus:bg-white/10"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/billing"
                      className="cursor-pointer text-gray-300 hover:text-white focus:text-white focus:bg-white/10"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-white/10"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-sm text-gray-500 hover:text-gray-300 px-3 py-1.5 transition-colors duration-200"
                >
                  Log in
                </Link>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black text-sm font-semibold rounded-xl px-4 py-2 shadow-[0_0_16px_rgba(255,215,0,0.2)] hover:shadow-[0_0_22px_rgba(255,215,0,0.35)] hover:scale-[1.02] transition-all duration-200"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
