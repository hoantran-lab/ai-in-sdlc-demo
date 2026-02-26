import { VerifyPinResponse } from '@/src/types/auth';

/**
 * Gọi API xác thực mã PIN
 * @throws Error khi PIN sai hoặc server lỗi
 */
export async function verifyPin(pin: string): Promise<VerifyPinResponse> {
  const response = await fetch('/api/auth/verify-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });

  const data: VerifyPinResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Mã PIN không đúng. Vui lòng thử lại.');
  }

  return data;
}
