// ============================================================
// Component: ExpenseForm - Container form chính (CMP-010)
// ============================================================

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useExpenseForm } from '@/src/hooks/useExpenseForm';
import { useCategories } from '@/src/hooks/useCategories';
import { createExpense } from '@/src/lib/api/expenses';
import { toISODateString } from '@/src/lib/utils/date';
import AmountInput from './AmountInput';
import CategorySelect from './CategorySelect';
import DatePicker from './DatePicker';
import NoteInput from './NoteInput';
import SubmitButton from './SubmitButton';
import type { Expense, ExpenseFormData } from '@/src/types/expense';

interface ExpenseFormProps {
  onSuccess?: (expense: Expense) => void;
  onCancel?: () => void;
  initialDate?: Date;
}

/**
 * Form thêm chi tiêu mới - Container chứa tất cả sub-components
 */
export default function ExpenseForm({
  onSuccess,
  onCancel,
  initialDate,
}: ExpenseFormProps) {
  const router = useRouter();
  const { categories } = useCategories();

  const handleFormSubmit = useCallback(
    async (data: ExpenseFormData) => {
      // Chuẩn bị request body (LGC-014)
      const requestBody = {
        amount: data.amount,
        categoryCode: data.categoryCode,
        expenseDate: toISODateString(data.expenseDate),
        note: data.note.trim() || undefined,
      };

      const response = await createExpense(requestBody);

      if (response.success && response.data) {
        onSuccess?.(response.data);
      }
    },
    [onSuccess]
  );

  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setTouched,
    handleSubmit,
  } = useExpenseForm({
    initialValues: {
      expenseDate: initialDate ?? new Date(),
    },
    onSubmit: handleFormSubmit,
  });

  // Hiển thị lỗi chỉ khi field đã được touch
  const visibleErrors = {
    amount: touched.amount ? errors.amount : undefined,
    categoryCode: touched.categoryCode ? errors.categoryCode : undefined,
    expenseDate: touched.expenseDate ? errors.expenseDate : undefined,
    note: touched.note ? errors.note : undefined,
  };

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  }, [onCancel, router]);

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <form onSubmit={onFormSubmit} noValidate className="space-y-5">
      {/* Danh mục */}
      <CategorySelect
        value={values.categoryCode}
        onChange={(code) => {
          setValue('categoryCode', code);
          setTouched('categoryCode');
        }}
        options={categories}
        error={visibleErrors.categoryCode}
      />

      {/* Số tiền */}
      <AmountInput
        value={values.amount}
        onChange={(val) => {
          setValue('amount', val);
          setTouched('amount');
        }}
        error={visibleErrors.amount}
        disabled={isSubmitting}
      />

      {/* Ngày chi tiêu */}
      <DatePicker
        value={values.expenseDate}
        onChange={(date) => {
          setValue('expenseDate', date);
          setTouched('expenseDate');
        }}
        error={visibleErrors.expenseDate}
      />

      {/* Ghi chú */}
      <NoteInput
        value={values.note}
        onChange={(val) => {
          setValue('note', val);
          setTouched('note');
        }}
        error={visibleErrors.note}
        disabled={isSubmitting}
      />

      {/* Lỗi chung từ server */}
      {errors.general && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {errors.general}
        </div>
      )}

      {/* Nút Lưu / Hủy */}
      <SubmitButton
        isSubmitting={isSubmitting}
        isValid={isValid}
        onCancel={handleCancel}
      />
    </form>
  );
}
