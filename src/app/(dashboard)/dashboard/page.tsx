import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TopProductsCard } from "@/components/dashboard/top-products-card";
import { LowStockCard } from "@/components/dashboard/low-stock-card";
import { connectDB } from "@/lib/db";
import { toPlainObject } from "@/lib/utils";
import { DashboardService } from "@/services/dashboard.service";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

const dashboardService = new DashboardService();

export default async function DashboardPage() {
  await connectDB();
  const rawOverview = await dashboardService.getOverview();
  const rawChart = await dashboardService.getSalesChart(7);

  const overview = toPlainObject(rawOverview);
  const chart = toPlainObject(rawChart);

  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-6">
        <StatsCards
          today={overview.today}
          week={overview.week}
          lowStockCount={overview.lowStockAlerts.length}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <SalesChart data={chart} />
          <RecentTransactions
            transactions={overview.recentTransactions as never[]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TopProductsCard products={overview.topProducts as never[]} />
          <LowStockCard alerts={overview.lowStockAlerts as never[]} />
        </div>
      </div>
    </DashboardShell>
  );
}
