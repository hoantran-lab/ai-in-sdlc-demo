// ============================================================
// Zod schema cho chi tiêu - UC-02
// ============================================================

import { z } from 'zod';
import { isAfter, startOfDay } from 'date-fns';
import { CATEGORY_CODES } from '@/src/constants/categories';
import { MAX_AMOUNT, MIN_AMOUNT, MAX_NOTE_LENGTH } from '@/src/constants/expense';

/** Schema validate request tạo chi tiêu (server-side) */
export const CreateExpenseSchema = z.object({
  amount: z
    .number({ error: 'Vui lòng nhập số tiền' })
    .min(MIN_AMOUNT, 'Số tiền phải lớn hơn 0')
    .max(MAX_AMOUNT, `Số tiền không được vượt quá ${MAX_AMOUNT.toLocaleString('vi-VN')} đ`),

  categoryCode: z
    .string({ error: 'Vui lòng chọn danh mục' })
    .refine((val) => CATEGORY_CODES.includes(val), 'Danh mục không hợp lệ'),

  expenseDate: z
    .string({ error: 'Vui lòng chọn ngày' })
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'Ngày không hợp lệ'
    )
    .refine(
      (val) => !isAfter(startOfDay(new Date(val)), startOfDay(new Date())),
      'Ngày chi tiêu không được trong tương lai'
    ),

  note: z
    .string()
    .max(MAX_NOTE_LENGTH, `Ghi chú không được vượt quá ${MAX_NOTE_LENGTH} ký tự`)
    .optional()
    .transform((val) => val?.trim() || undefined),
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
