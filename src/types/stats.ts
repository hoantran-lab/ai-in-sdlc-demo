// ============================================================
// Types cho UC-03: Xem biểu đồ thống kê
// ============================================================

// --- API Response ---

export interface MonthlyStatsResponse {
  success: boolean;
  data: MonthlyStats;
  message?: string;
}

export interface MonthlyStats {
  month: string;
  monthDisplay: string;
  categories: CategoryStat[];
  total: number;
  totalFormatted: string;
}

export interface CategoryStat {
  code: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  totalFormatted: string;
  percentage: number;
}

// --- Chart data ---

export interface ChartData {
  name: string;
  value: number;
  color: string;
  displayValue: string;
}
