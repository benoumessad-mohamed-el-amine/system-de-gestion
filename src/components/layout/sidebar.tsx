"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
  Truck,
  ShoppingBag,
  Receipt,
  Wallet,
  UserCog,
  BarChart3,
  Settings,
  Bell,
  Building2,
  Tags,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/pos", key: "pos", icon: ShoppingCart },
  { href: "/products", key: "products", icon: Package },
  { href: "/categories", key: "categories", icon: Tags },
  { href: "/brands", key: "brands", icon: Award },
  { href: "/inventory", key: "inventory", icon: Warehouse },
  { href: "/customers", key: "customers", icon: Users },
  { href: "/suppliers", key: "suppliers", icon: Truck },
  { href: "/purchases", key: "purchases", icon: ShoppingBag },
  { href: "/sales", key: "sales", icon: Receipt },
  { href: "/expenses", key: "expenses", icon: Wallet },
  { href: "/employees", key: "employees", icon: UserCog },
  { href: "/reports", key: "reports", icon: BarChart3 },
  { href: "/branches", key: "branches", icon: Building2 },
  { href: "/notifications", key: "notifications", icon: Bell },
  { href: "/settings", key: "settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

import { useSettings } from "@/components/providers/settings-provider";

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { settings, t } = useSettings();

  return (
    <aside className={cn("flex flex-col w-64 shrink-0 bg-white border-r border-slate-200/80 text-slate-800 dark:bg-zinc-950 dark:border-zinc-800/80 dark:text-zinc-200 transition-colors duration-200", className)}>
      <div className="flex h-16 items-center px-6 border-b border-slate-200/60 dark:border-zinc-800/60">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-zinc-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <span className="truncate max-w-[150px]" title={settings.storeName}>
            {settings.storeName}
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/50 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-colors", active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-500")} />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
