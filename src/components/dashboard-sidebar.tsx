"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
  PanelLeftClose,
  PanelLeft,
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

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex h-full flex-col bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-white transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/[0.06]",
            collapsed ? "justify-center px-2" : "gap-2.5 px-6"
          )}
        >
          <div className="relative h-8 w-8 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25" />
            <div className="relative h-full w-full rounded-lg flex items-center justify-center">
              <Zap className="h-[18px] w-[18px] text-white drop-shadow-sm" />
            </div>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight">LeadGate AI</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            const link = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                  collapsed ? "justify-center px-2" : "gap-3 px-3",
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && item.name}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
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
              "flex w-full items-center rounded-lg py-2.5 text-sm font-medium text-gray-500 hover:bg-white/[0.06] hover:text-gray-300 transition-colors",
              collapsed ? "justify-center px-2" : "px-3"
            )}
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <>
                <PanelLeftClose className="h-5 w-5" />
                <span className="ml-3">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Logout */}
        <div className="border-t border-white/[0.06] px-3 py-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium text-gray-500 hover:bg-white/[0.06] hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-white/[0.06] hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              Log out
            </button>
          )}
        </div>

        {/* Form Link - fixed layout */}
        {!collapsed && (
          <div className="px-3 pb-4">
            <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <LinkIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Your Form Link</span>
              </div>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Share your unique form link from Settings
              </p>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
