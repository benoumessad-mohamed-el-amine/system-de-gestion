"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/components/providers/settings-provider";

interface AlertItem {
  _id: unknown;
  name: string;
  stock: number;
}

export function LowStockCard({ alerts }: { alerts: AlertItem[] }) {
  const { t } = useSettings();

  return (
    <Link href="/inventory" className="block group">
      <Card className="h-full transition-all duration-200 group-hover:border-emerald-500/50 group-hover:shadow-md">
        <CardHeader>
          <CardTitle className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {t("lowStockAlert")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.map((p) => (
              <div
                key={String(p._id)}
                className="flex justify-between rounded-lg bg-amber-50 p-2 text-sm dark:bg-amber-950/60"
              >
                <span>{p.name}</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {p.stock} {t("leftLabel")}
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("stockOptimal")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
