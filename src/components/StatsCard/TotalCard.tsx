// ============================================================
// Component: TotalCard - Card tổng chi tiêu (CMP-025, AC-03.4)
// ============================================================

interface TotalCardProps {
  total: number;
  totalFormatted: string;
}

/**
 * Card hiển thị tổng chi tiêu tháng
 */
export default function TotalCard({ totalFormatted }: TotalCardProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 text-white shadow-md dark:from-emerald-600 dark:to-emerald-700">
      <p className="text-sm font-medium text-emerald-100">
        Tổng chi tiêu tháng này
      </p>
      <p className="mt-1 text-2xl font-bold">{totalFormatted}</p>
    </div>
  );
}
