"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useSettings } from "@/components/providers/settings-provider";

interface ProductItem {
  _id: unknown;
  name: string;
  quantity: number;
  revenue: number;
}

export function TopProductsCard({ products }: { products: ProductItem[] }) {
  const { t } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("topProducts")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((p) => (
            <div key={String(p._id)} className="flex justify-between text-sm">
              <span>{p.name}</span>
              <span className="font-medium">
                {p.quantity} {t("soldLabel")} · {formatCurrency(p.revenue)}
              </span>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("noSalesData")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
