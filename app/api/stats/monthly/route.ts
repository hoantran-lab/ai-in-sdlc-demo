// ============================================================
// API Route: GET /api/stats/monthly - Thống kê chi tiêu tháng (LGC-025)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { endOfMonth } from 'date-fns';
import prisma from '@/src/lib/prisma';
import { monthQuerySchema } from '@/src/lib/validations/stats';
import { formatCurrency } from '@/src/lib/utils/currency';

export async function GET(request: NextRequest) {
  try {
    // ================================================
    // BƯỚC 1: Kiểm tra Session
    // ================================================
    const sessionId = request.headers.get('X-Session-Id');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để tiếp tục' },
        { status: 401 }
      );
    }

    const session = await prisma.app_sessions.findFirst({
      where: {
        id: sessionId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Phiên đăng nhập đã hết hạn' },
        { status: 401 }
      );
    }

    // ================================================
    // BƯỚC 2: Parse & validate query params
    // ================================================
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get('month');

    const validation = monthQuerySchema.safeParse({ month: monthParam });

    if (!validation.success) {
      const errorMsg =
        validation.error.issues[0]?.message ??
        'Tham số month là bắt buộc';
      return NextResponse.json(
        { success: false, message: errorMsg },
        { status: 400 }
      );
    }

    const month = validation.data.month;

    // ================================================
    // BƯỚC 3: Tính date range
    // ================================================
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = endOfMonth(startDate);

    // ================================================
    // BƯỚC 4: Query database - Group by category
    // ================================================
    const categoryStats = await prisma.trn_expenses.groupBy({
      by: ['categoryCode'],
      _sum: { amount: true },
      where: {
        expenseDate: {
          gte: startDate,
          lte: endDate,
        },
        isDeleted: false,
      },
      orderBy: {
        _sum: { amount: 'desc' },
      },
    });

    // ================================================
    // BƯỚC 5: Fetch category master data
    // ================================================
    const categories = await prisma.mst_categories.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    const statsMap = new Map(
      categoryStats.map((s) => [s.categoryCode, s._sum.amount ?? 0])
    );

    // ================================================
    // BƯỚC 6: Tính tổng
    // ================================================
    const grandTotal = categoryStats.reduce(
      (sum, stat) => sum + (stat._sum.amount ?? 0),
      0
    );

    // ================================================
    // BƯỚC 7: Build response - Luôn trả 4 danh mục
    // ================================================
    const result = categories.map((cat) => {
      const amount = statsMap.get(cat.code) ?? 0;
      const percentage =
        grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0;

      return {
        code: cat.code,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        total: amount,
        totalFormatted: formatCurrency(amount),
        percentage,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        month,
        monthDisplay: `Tháng ${monthNum.toString().padStart(2, '0')}/${year}`,
        categories: result,
        total: grandTotal,
        totalFormatted: formatCurrency(grandTotal),
      },
    });
  } catch (error) {
    console.error(
      '[ERROR] GET /api/stats/monthly:',
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi khi tải dữ liệu thống kê' },
      { status: 500 }
    );
  }
}
