"use client";

import Link from "next/link";
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useSettings } from "@/components/providers/settings-provider";

interface StatsCardsProps {
  today: { revenue: number; sales: number; avgOrder: number };
  week: { revenue: number; sales: number };
  lowStockCount: number;
}

export function StatsCards({ today, week, lowStockCount }: StatsCardsProps) {
  const { t } = useSettings();

  const stats = [
    {
      title: t("todayRevenue"),
      value: formatCurrency(today.revenue),
      icon: DollarSign,
      change: `${today.sales} ${t("salesCount")}`,
      href: "/sales",
    },
    {
      title: t("weeklyRevenue"),
      value: formatCurrency(week.revenue),
      icon: TrendingUp,
      change: `${week.sales} ${t("ordersCount")}`,
      href: "/sales",
    },
    {
      title: t("avgOrder"),
      value: formatCurrency(today.avgOrder),
      icon: ShoppingBag,
      change: t("todayLabel"),
      href: "/sales",
    },
    {
      title: t("lowStockAlert"),
      value: String(lowStockCount),
      icon: AlertTriangle,
      change: lowStockCount > 0 ? t("attentionNeeded") : t("stockOptimal"),
      alert: lowStockCount > 0,
      href: "/inventory",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link key={stat.title} href={stat.href} className="block group">
            <Card className="h-full transition-all duration-200 group-hover:border-emerald-500/50 group-hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {stat.title}
                </CardTitle>
                <Icon
                  className={`h-4 w-4 ${stat.alert ? "text-amber-500" : "text-zinc-400"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-zinc-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
