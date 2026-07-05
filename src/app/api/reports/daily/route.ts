import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await prisma.sale.findMany({
      where: {
        shopId: user.shopId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      include: { items: true },
    });

    const expenses = await prisma.expense.findMany({
      where: {
        shopId: user.shopId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const cashSales = sales
      .filter((s) => s.paymentMethod === "CASH")
      .reduce((sum, s) => sum + s.totalAmount, 0);
    const kbzPaySales = sales
      .filter((s) => s.paymentMethod === "KBZPAY")
      .reduce((sum, s) => sum + s.totalAmount, 0);
    const cbPaySales = sales
      .filter((s) => s.paymentMethod === "CBPAY")
      .reduce((sum, s) => sum + s.totalAmount, 0);
    const wavePaySales = sales
      .filter((s) => s.paymentMethod === "WAVE")
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const totalCost = sales.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => {
        return itemSum + (item.unitPrice * item.quantity * 0.7);
      }, 0);
    }, 0);

    const totalProfit = totalSales - totalCost - totalExpenses;

    const expenseBreakdown = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        date: startOfDay.toISOString().split("T")[0],
        totalSales,
        totalExpenses,
        totalProfit,
        totalCost,
        splitPayments: {
          cash: cashSales,
          kbzPay: kbzPaySales,
          cbPay: cbPaySales,
          wavePay: wavePaySales,
        },
        expenseBreakdown,
        salesCount: sales.length,
        expensesCount: expenses.length,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch report" }, { status: 500 });
  }
}
