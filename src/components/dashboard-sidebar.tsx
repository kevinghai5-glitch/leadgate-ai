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
    <div
      className={cn(
        "flex h-full flex-col bg-gray-950 text-white transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-gray-800",
          collapsed ? "justify-center px-2" : "gap-2 px-6"
        )}
      >
        <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold">LeadGate AI</span>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center rounded-lg py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors justify-center px-2"
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5" />
              <span className="ml-3">Collapse</span>
              <span className="flex-1" />
            </>
          )}
        </button>
      </div>

      <div className="border-t border-gray-800 px-3 py-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors",
            collapsed ? "justify-center px-2" : "gap-3 px-3"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && "Log out"}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="rounded-lg bg-gray-900 p-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <LinkIcon className="h-4 w-4" />
              <span>Your Form Link</span>
            </div>
            <p className="mt-1 text-xs text-gray-500 truncate">
              Share your unique form link from Settings
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
