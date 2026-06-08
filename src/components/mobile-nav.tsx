"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  Zap,
  LogOut,
  Menu,
  X,
  Briefcase,
  ListChecks,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Business Profile", href: "/dashboard/business", icon: Briefcase },
  { name: "Form Builder", href: "/dashboard/form-builder", icon: ListChecks },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Billing", href: "/billing", icon: CreditCard },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a] px-4">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Zap className="h-5 w-5 text-[#ffd87c]" />
          <span className="text-base font-bold text-white">LeadGate AI</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-white/70 hover:text-white transition-colors p-1"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-14 z-50 bg-[#0a0a0a] border-b border-white/[0.06] shadow-xl">
          <nav className="px-3 py-3 space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/[0.06] text-white"
                      : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5", isActive && "text-[#ffd87c]")}
                  />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
