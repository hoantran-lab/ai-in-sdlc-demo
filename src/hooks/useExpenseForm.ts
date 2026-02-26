// ============================================================
// Hook: useExpenseForm - Quản lý form chi tiêu (HK-010)
// ============================================================

'use client';

import { useState, useCallback, useMemo } from 'react';
import { startOfDay, isAfter } from 'date-fns';
import { CATEGORY_CODES } from '@/src/constants/categories';
import { MAX_AMOUNT, MAX_NOTE_LENGTH } from '@/src/constants/expense';
import type { ExpenseFormData, FormErrors, TouchedFields } from '@/src/types/expense';

interface UseExpenseFormOptions {
  initialValues?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
}

interface UseExpenseFormReturn {
  values: ExpenseFormData;
  errors: FormErrors;
  touched: TouchedFields;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: <K extends keyof ExpenseFormData>(field: K, value: ExpenseFormData[K]) => void;
  setTouched: (field: keyof ExpenseFormData) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

function getDefaultValues(initial?: Partial<ExpenseFormData>): ExpenseFormData {
  return {
    amount: initial?.amount ?? 0,
    categoryCode: initial?.categoryCode ?? '',
    expenseDate: initial?.expenseDate ?? startOfDay(new Date()),
    note: initial?.note ?? '',
  };
}

/** Validate toàn bộ form (LGC-013) */
function validate(values: ExpenseFormData): FormErrors {
  const errors: FormErrors = {};

  // Rule 1: Số tiền (AC-02.1)
  if (values.amount <= 0) {
    errors.amount = 'Vui lòng nhập số tiền';
  } else if (values.amount > MAX_AMOUNT) {
    errors.amount = 'Số tiền không được vượt quá 999.999.999 đ';
  }

  // Rule 2: Danh mục (AC-02.2)
  if (!values.categoryCode) {
    errors.categoryCode = 'Vui lòng chọn danh mục';
  } else if (!CATEGORY_CODES.includes(values.categoryCode)) {
    errors.categoryCode = 'Danh mục không hợp lệ';
  }

  // Rule 3: Ngày chi tiêu (AC-02.3)
  if (!values.expenseDate) {
    errors.expenseDate = 'Vui lòng chọn ngày';
  } else {
    const today = startOfDay(new Date());
    const selected = startOfDay(values.expenseDate);
    if (isAfter(selected, today)) {
      errors.expenseDate = 'Ngày chi tiêu không được trong tương lai';
    }
  }

  // Rule 4: Ghi chú (Optional)
  if (values.note && values.note.length > MAX_NOTE_LENGTH) {
    errors.note = `Ghi chú không được vượt quá ${MAX_NOTE_LENGTH} ký tự`;
  }

  return errors;
}

export function useExpenseForm({
  initialValues,
  onSubmit,
}: UseExpenseFormOptions): UseExpenseFormReturn {
  const defaultValues = useMemo(() => getDefaultValues(initialValues), [initialValues]);

  const [values, setValues] = useState<ExpenseFormData>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouchedState] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    const currentErrors = validate(values);
    return Object.keys(currentErrors).length === 0;
  }, [values]);

  const setValue = useCallback(
    <K extends keyof ExpenseFormData>(field: K, value: ExpenseFormData[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Xóa lỗi khi user sửa field
      setErrors((prev) => {
        if (prev[field]) {
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const setTouched = useCallback((field: keyof ExpenseFormData) => {
    setTouchedState((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Bước 1: Validate form
    const validationErrors = validate(values);
    setErrors(validationErrors);

    // Bước 2: Nếu có lỗi, mark tất cả field có lỗi là touched
    if (Object.keys(validationErrors).length > 0) {
      const touchedUpdate: TouchedFields = {};
      for (const field of Object.keys(validationErrors) as (keyof ExpenseFormData)[]) {
        touchedUpdate[field] = true;
      }
      setTouchedState((prev) => ({ ...prev, ...touchedUpdate }));
      return;
    }

    // Bước 3: Bật loading
    setIsSubmitting(true);

    try {
      // Bước 4: Gọi callback onSubmit
      await onSubmit(values);
    } finally {
      // Bước 5: Tắt loading
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(getDefaultValues(initialValues));
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setTouched,
    handleSubmit,
    resetForm,
  };
}
