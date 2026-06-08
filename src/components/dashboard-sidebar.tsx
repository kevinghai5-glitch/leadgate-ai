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
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  ListChecks,
  Briefcase,
} from "lucide-react";

type NavItem = { name: string; href: string; icon: typeof LayoutDashboard };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Leads", href: "/dashboard/leads", icon: Users },
    ],
  },
  {
    label: "Customize",
    items: [
      { name: "Business Profile", href: "/dashboard/business", icon: Briefcase },
      { name: "Form Builder", href: "/dashboard/form-builder", icon: ListChecks },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
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
          "relative flex h-full flex-col bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white transition-all duration-200 border-r border-white/[0.06]",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className={cn(
            "flex h-16 items-center border-b border-white/[0.06] transition-colors hover:bg-white/[0.02]",
            collapsed ? "justify-center px-2" : "gap-2.5 px-6"
          )}
        >
          <Zap className="h-6 w-6 flex-shrink-0 text-[#ffd87c]" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-white">
              LeadGate AI
            </span>
          )}
        </Link>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto px-3",
            collapsed ? "py-4 space-y-3" : "pt-2 pb-1 space-y-4"
          )}
        >
          {navGroups.map((group) => (
            <div key={group.label} className={collapsed ? "" : "space-y-0.5"}>
              {!collapsed && (
                <div className="px-2 pt-2 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                    {group.label}
                  </span>
                </div>
              )}
              {collapsed && (
                <div className="my-2 mx-2 h-px bg-white/[0.04]" />
              )}
              {group.items.map((item) => {
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
                        ? "bg-white/[0.06] text-white"
                        : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
                        style={{ background: "var(--lg-gold-gradient)" }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                        isActive && "text-[#ffd87c]"
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
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center rounded-lg py-2.5 text-[13px] font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors",
              collapsed ? "justify-center px-2" : "px-3"
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            ) : (
              <>
                <PanelLeftClose className="h-[18px] w-[18px]" />
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
                className="block rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 hover:border-[rgba(255,216,124,0.25)] hover:bg-white/[0.05] transition-all group"
              >
                <div className="flex items-center justify-between text-sm text-white">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 flex-shrink-0 text-[#ffd87c]" />
                    <span className="truncate font-medium">
                      Your Form Link
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-white/60 group-hover:text-[#ffd87c] transition-colors" />
                </div>
                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                  Preview your lead capture form on a public link
                </p>
                <div className="mt-2 px-2 py-1.5 rounded bg-black/40 text-[11px] text-white/70 truncate font-mono">
                  {formLink.replace(/^https?:\/\//, "").slice(0, 30)}...
                </div>
              </a>
            ) : (
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="flex items-center gap-2 text-sm text-white">
                  <LinkIcon className="h-4 w-4 flex-shrink-0 text-[#ffd87c]" />
                  <span className="truncate font-medium">Your Form Link</span>
                </div>
                <p className="mt-1 text-xs text-white/70 leading-relaxed">
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
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-[13px] font-medium text-white/70 hover:bg-white/[0.06] hover:text-red-400 transition-colors"
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
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/70 hover:bg-white/[0.06] hover:text-red-400 transition-colors"
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
