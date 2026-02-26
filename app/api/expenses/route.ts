// ============================================================
// API Route: POST /api/expenses - Tạo chi tiêu mới (LGC-015)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { parseISO, isAfter, startOfDay, format } from 'date-fns';
import prisma from '@/src/lib/prisma';
import { CreateExpenseSchema } from '@/src/lib/validations/expense';
import { formatCurrency } from '@/src/lib/utils/currency';

export async function POST(request: NextRequest) {
  try {
    // ================================================
    // BƯỚC 1: Kiểm tra Session (Authentication)
    // ================================================
    const sessionId = request.headers.get('X-Session-Id');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để tiếp tục' },
        { status: 401 }
      );
    }

    // Validate session trong DB
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
    // BƯỚC 2: Parse request body
    // ================================================
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    // ================================================
    // BƯỚC 3: Validate với Zod
    // ================================================
    const validation = CreateExpenseSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: firstError?.message ?? 'Dữ liệu không hợp lệ',
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // ================================================
    // BƯỚC 4: Business validation bổ sung
    // ================================================

    // 4a. Kiểm tra category tồn tại trong DB
    const category = await prisma.mst_categories.findFirst({
      where: { code: data.categoryCode, isActive: true },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Danh mục không tồn tại hoặc đã bị vô hiệu' },
        { status: 400 }
      );
    }

    // 4b. Kiểm tra ngày không trong tương lai (double-check)
    const expenseDate = parseISO(data.expenseDate);
    const today = startOfDay(new Date());

    if (isAfter(startOfDay(expenseDate), today)) {
      return NextResponse.json(
        { success: false, message: 'Ngày chi tiêu không được trong tương lai' },
        { status: 400 }
      );
    }

    // ================================================
    // BƯỚC 5: Tạo chi tiêu mới trong DB
    // ================================================
    const newExpense = await prisma.trn_expenses.create({
      data: {
        amount: data.amount,
        categoryCode: data.categoryCode,
        expenseDate: expenseDate,
        note: data.note ?? null,
      },
      include: {
        category: true,
      },
    });

    // ================================================
    // BƯỚC 6: Trả về kết quả thành công
    // ================================================
    return NextResponse.json(
      {
        success: true,
        message: 'Đã lưu chi tiêu thành công',
        data: {
          id: newExpense.id,
          amount: newExpense.amount,
          amountFormatted: formatCurrency(newExpense.amount),
          categoryCode: newExpense.categoryCode,
          categoryName: newExpense.category.name,
          categoryIcon: newExpense.category.icon,
          expenseDate: format(newExpense.expenseDate, 'yyyy-MM-dd'),
          expenseDateFormatted: format(newExpense.expenseDate, 'dd/MM/yyyy'),
          note: newExpense.note,
          createdAt: newExpense.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // ================================================
    // BƯỚC 7: Xử lý lỗi
    // ================================================
    console.error(
      '[ERROR] POST /api/expenses:',
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
