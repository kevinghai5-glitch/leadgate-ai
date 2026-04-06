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
    <nav className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2.5">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#B8860B] shadow-lg shadow-[rgba(255,215,0,0.2)]" />
              <div className="relative h-full w-full rounded-lg flex items-center justify-center">
                <Zap className="h-[18px] w-[18px] text-black drop-shadow-sm" />
              </div>
            </div>
            <span className="text-xl font-bold text-white">
              LeadGate AI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:bg-white/10"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#FFD700]/15 text-[#FFD700]">
                        {session.user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#0A0A0A] border-white/10" align="end">
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
                    <Link href="/dashboard" className="cursor-pointer text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/billing" className="cursor-pointer text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
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
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-white/10">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black font-semibold shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_28px_rgba(255,215,0,0.25)]">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
