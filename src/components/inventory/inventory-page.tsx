"use client";

import { useEffect, useState } from "react";
import { Eye, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { InventoryAdjustDialog } from "@/components/inventory/inventory-adjust-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

import { useSettings } from "@/components/providers/settings-provider";

interface InventoryRow {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  sellingPrice: number;
  isActive: boolean;
  categoryId?: { name?: string };
  brandId?: { name?: string };
}

export function InventoryPage() {
  const { t } = useSettings();
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryRow | null>(null);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products?limit=100");
      const json = await res.json();
      if (json.success) {
        setInventory(json.data.items ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const openAdjust = (item: InventoryRow) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const lowStockCount = inventory.filter((item) => item.stock <= 5).length;

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("inventoryTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("products")}</p>
                <p className="text-lg font-semibold">{inventory.length}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("lowStockAlert")}</p>
                <Badge variant={lowStockCount > 0 ? "warning" : "success"}>
                  {lowStockCount}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("inventorySub")}
              </p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => openAdjust(inventory[0] ?? { _id: "", name: "", sku: "", stock: 0, sellingPrice: 0, isActive: true })}
                disabled={inventory.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("edit")}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("status")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <TrendingDown className="h-4 w-4 text-amber-500" />
                <span>{t("lowStockAlert")}: {lowStockCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>{t("products")}: {inventory.filter((item) => item.isActive).length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t("inventoryTitle")}</CardTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("inventorySub")}
              </p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => openAdjust(selectedItem ?? inventory[0] ?? { _id: "", name: "", sku: "", stock: 0, sellingPrice: 0, isActive: true })} disabled={inventory.length === 0}>
              <Eye className="mr-2 h-4 w-4" />
              {t("edit")}
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {isLoading ? (
              <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">Loading inventory...</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-zinc-500 dark:text-zinc-400">
                    <th className="pb-3 pr-4 font-medium">{t("products")}</th>
                    <th className="pb-3 pr-4 font-medium">SKU</th>
                    <th className="pb-3 pr-4 font-medium">{t("categories")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("brands")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("price")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("stock")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("status")}</th>
                    <th className="pb-3 font-medium">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item._id} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 pr-4 font-medium">{item.name}</td>
                      <td className="py-3 pr-4 text-zinc-500 dark:text-zinc-400">{item.sku}</td>
                      <td className="py-3 pr-4 text-zinc-500 dark:text-zinc-400">{item.categoryId?.name ?? "—"}</td>
                      <td className="py-3 pr-4 text-zinc-500 dark:text-zinc-400">{item.brandId?.name ?? "—"}</td>
                      <td className="py-3 pr-4">{formatCurrency(item.sellingPrice)}</td>
                      <td className="py-3 pr-4">
                        <span className={item.stock <= 5 ? "text-amber-600" : "text-zinc-900 dark:text-zinc-50"}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={item.isActive ? "success" : "secondary"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button size="sm" variant="outline" onClick={() => openAdjust(item)}>
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!isLoading && inventory.length === 0 && (
              <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">No inventory data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <InventoryAdjustDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productId={selectedItem?._id ?? inventory[0]?._id ?? ""}
        productName={selectedItem?.name ?? inventory[0]?.name ?? "Product"}
        onSuccess={loadInventory}
      />
    </>
  );
}
