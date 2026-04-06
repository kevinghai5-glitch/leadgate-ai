"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  LinkIcon,
  Zap,
  LogOut,
  PanelLeft,
  ExternalLink,
  CheckSquare,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Billing", href: "/billing", icon: CreditCard },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  const formLink =
    typeof window !== "undefined" && session?.user?.id
      ? `${window.location.origin}/form/${session.user.id}`
      : null;

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex h-full flex-col bg-gradient-to-b from-[#0A0A0A] to-[#060606] text-white transition-all duration-200 border-r border-white/[0.04]",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/[0.06]",
            collapsed ? "justify-center px-2" : "gap-2.5 px-6"
          )}
        >
          <Zap className="h-6 w-6 flex-shrink-0 text-white" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-white">
              LeadGate AI
            </span>
          )}
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Overview
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 px-3 space-y-0.5",
            collapsed ? "py-4" : "py-1"
          )}
        >
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            const link = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center rounded-lg py-2.5 text-[13px] font-medium transition-all duration-150",
                  collapsed ? "justify-center px-2" : "gap-3 px-3",
                  isActive
                    ? "border-l-2 border-[#D2AC47] bg-[#D2AC47]/[0.06] text-white"
                    : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#D2AC47]" />
                )}
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                    isActive && "text-[#ECCA66]"
                  )}
                />
                {!collapsed && item.name}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center rounded-lg py-2.5 text-[13px] font-medium text-gray-500 hover:bg-white/[0.06] hover:text-gray-300 transition-colors",
              collapsed ? "justify-center px-2" : "px-3"
            )}
          >
            {collapsed ? (
              <PanelLeft className="h-[18px] w-[18px]" />
            ) : (
              <>
                <CheckSquare className="h-[18px] w-[18px]" />
                <span className="ml-3">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Form Link — clickable, opens in new tab */}
        {!collapsed && (
          <div className="px-3 pb-3">
            {formLink ? (
              <a
                href={formLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-gradient-to-br from-[#D2AC47]/[0.08] to-[#B08B73]/[0.06] border border-[#D2AC47]/10 p-3 hover:border-[#D2AC47]/25 hover:from-[#D2AC47]/[0.12] hover:to-[#B08B73]/[0.10] transition-all group"
              >
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 flex-shrink-0 text-[#ECCA66]" />
                    <span className="truncate font-medium">
                      Your Form Link
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-gray-500 group-hover:text-[#ECCA66] transition-colors" />
                </div>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Preview your lead capture form on a public link
                </p>
                <div className="mt-2 px-2 py-1.5 rounded bg-white/[0.04] text-[11px] text-gray-500 truncate font-mono">
                  {formLink.replace(/^https?:\/\//, "").slice(0, 30)}...
                </div>
              </a>
            ) : (
              <div className="rounded-lg bg-gradient-to-br from-[#D2AC47]/[0.08] to-[#B08B73]/[0.06] border border-[#D2AC47]/10 p-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <LinkIcon className="h-4 w-4 flex-shrink-0 text-[#ECCA66]" />
                  <span className="truncate font-medium">Your Form Link</span>
                </div>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Share your unique form link from Settings
                </p>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <div className="border-t border-white/[0.06] px-3 py-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-white/[0.06] hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Log out
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-white/[0.06] hover:text-red-400 transition-colors"
            >
              <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
              Log out
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
