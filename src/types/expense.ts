// ============================================================
// Types cho UC-02: Thêm chi tiêu mới
// ============================================================

// --- Category ---

export interface Category {
  code: string;
  name: string;
  icon: string;
  color: string;
}

// --- Form data ---

export interface ExpenseFormData {
  amount: number;
  categoryCode: string;
  expenseDate: Date;
  note: string;
}

// --- API Request ---

export interface CreateExpenseRequest {
  amount: number;
  categoryCode: string;
  expenseDate: string; // ISO string yyyy-MM-dd
  note?: string;
}

// --- API Response ---

export interface ExpenseResponse {
  success: boolean;
  data?: Expense;
  message: string;
}

// --- Expense entity ---

export interface Expense {
  id: string;
  amount: number;
  amountFormatted: string;
  categoryCode: string;
  categoryName: string;
  categoryIcon: string;
  expenseDate: string;
  expenseDateFormatted: string;
  note: string | null;
  createdAt: string;
}

// --- Form errors & touched ---

export type FormErrors = Partial<Record<keyof ExpenseFormData | 'general', string>>;
export type TouchedFields = Partial<Record<keyof ExpenseFormData, boolean>>;
