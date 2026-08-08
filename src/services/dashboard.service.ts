import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { toPlainObject } from "@/lib/utils";
import { Expense } from "@/models/Expense";
import { Product } from "@/models/Product";
import { Sale } from "@/models/Sale";
import { SaleRepository } from "@/repositories/sale.repository";
import { ProductRepository } from "@/repositories/product.repository";

const saleRepo = new SaleRepository();
const productRepo = new ProductRepository();

export class DashboardService {
  async getOverview(branchId?: string) {
    await connectDB();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [today, week, month, recent, topProducts, lowStock] =
      await Promise.all([
        saleRepo.getRevenueStats(startOfDay, new Date(), branchId),
        saleRepo.getRevenueStats(startOfWeek, new Date(), branchId),
        saleRepo.getRevenueStats(startOfMonth, new Date(), branchId),
        saleRepo.recent(8),
        saleRepo.topProducts(5, startOfMonth, new Date()),
        productRepo.lowStock(),
      ]);

    const branchObjId = branchId ? new mongoose.Types.ObjectId(branchId) : undefined;

    const monthExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth },
          ...(branchObjId ? { branchId: branchObjId } : {}),
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalProducts = await Product.countDocuments({ isActive: true });

    return toPlainObject({
      today: {
        revenue: today.totalRevenue,
        sales: today.totalSales,
        avgOrder: today.avgOrder,
      },
      week: { revenue: week.totalRevenue, sales: week.totalSales },
      month: { revenue: month.totalRevenue, sales: month.totalSales },
      expenses: monthExpenses[0]?.total ?? 0,
      profit: month.totalRevenue - (monthExpenses[0]?.total ?? 0),
      recentTransactions: recent,
      topProducts,
      lowStockAlerts: lowStock,
      totalProducts,
    });
  }

  async getSalesChart(days = 7, branchId?: string) {
    await connectDB();
    const start = new Date();
    start.setDate(start.getDate() - days);

    const branchObjId = branchId ? new mongoose.Types.ObjectId(branchId) : undefined;

    const chartData = await Sale.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: start },
          ...(branchObjId ? { branchId: branchObjId } : {}),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return toPlainObject(chartData);
  }
}
