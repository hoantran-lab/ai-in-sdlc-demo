// ============================================================
// Zod schema cho thống kê - UC-03
// ============================================================

import { z } from 'zod';

/** Schema validate query param month */
export const monthQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
      message: 'Định dạng tháng không hợp lệ. Yêu cầu: YYYY-MM',
    }),
});

export type MonthQueryInput = z.infer<typeof monthQuerySchema>;
