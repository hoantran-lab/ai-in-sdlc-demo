import { z } from 'zod';

// Zod schema cho xác thực mã PIN (Zod v4)
export const VerifyPinSchema = z.object({
  pin: z
    .string({ message: 'Vui lòng nhập mã PIN' })
    .length(4, 'Mã PIN phải gồm 4 chữ số')
    .regex(/^\d{4}$/, 'Mã PIN chỉ được chứa số'),
});

export type VerifyPinInput = z.infer<typeof VerifyPinSchema>;
