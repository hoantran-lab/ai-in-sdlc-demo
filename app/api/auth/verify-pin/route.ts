import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { VerifyPinSchema } from '@/src/lib/validations/pin';
import prisma from '@/src/lib/prisma';

/** Thời gian session hết hạn (giờ) */
const SESSION_EXPIRY_HOURS = Number(process.env.SESSION_EXPIRY_HOURS) || 24;

/**
 * Helper: Lấy IP client từ request headers
 */
function getClientIP(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null
  );
}

/**
 * POST /api/auth/verify-pin
 * Xác thực mã PIN phía server (LGC-006)
 */
export async function POST(request: NextRequest) {
  try {
    // ================================================
    // BƯỚC 1: Parse request body
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
    // BƯỚC 2: Validate input với Zod schema
    // ================================================
    const validation = VerifyPinSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message ?? 'Mã PIN phải gồm 4 chữ số';
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    const { pin } = validation.data;

    // ================================================
    // BƯỚC 3: Đọc PIN hash từ environment variable
    // [NFR-SEC-01] Không hardcode PIN
    // ================================================
    const pinHash = process.env.APP_PIN_HASH;

    if (!pinHash) {
      console.error('[CRITICAL] APP_PIN_HASH chưa được cấu hình');
      return NextResponse.json(
        { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
        { status: 500 }
      );
    }

    // ================================================
    // BƯỚC 4: So sánh PIN với hash (bcrypt - NFR-SEC-02)
    // ================================================
    const isValid = await bcrypt.compare(pin, pinHash);

    const clientIP = getClientIP(request);

    // ================================================
    // BƯỚC 5: Xử lý kết quả
    // ================================================
    if (isValid) {
      // 5a. PIN ĐÚNG - Tạo session
      const sessionId = uuidv4();
      const createdAt = new Date();
      const expiresAt = addHours(createdAt, SESSION_EXPIRY_HOURS);

      // Lưu session vào database
      await prisma.app_sessions.create({
        data: {
          id: sessionId,
          expiresAt,
          createdAt,
        },
      });

      // Ghi log thành công (KHÔNG ghi PIN - NFR-SEC-01)
      await prisma.login_attempts.create({
        data: {
          isSuccess: true,
          ipAddress: clientIP,
        },
      });

      return NextResponse.json({
        success: true,
        sessionId,
        message: 'Đăng nhập thành công',
      });
    } else {
      // 5b. PIN SAI - Ghi log thất bại
      await prisma.login_attempts.create({
        data: {
          isSuccess: false,
          ipAddress: clientIP,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Mã PIN không đúng. Vui lòng thử lại.',
        },
        { status: 401 }
      );
    }
  } catch (error) {
    // ================================================
    // BƯỚC 6: Xử lý lỗi không mong đợi
    // ================================================
    console.error(
      '[ERROR] verify-pin:',
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
