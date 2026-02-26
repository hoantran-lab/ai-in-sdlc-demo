// ============================================================
// Component: ExpenseBarChart - Biểu đồ cột (CMP-022)
// ============================================================

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ChartData } from '@/src/types/stats';

interface ExpenseBarChartProps {
  data: ChartData[];
  height?: number;
}

/**
 * Biểu đồ cột hiển thị chi tiêu theo danh mục (AC-03.1, AC-03.2, AC-03.3)
 */
export default function ExpenseBarChart({
  data,
  height = 250,
}: ExpenseBarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis hide />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="displayValue"
              position="top"
              style={{ fontSize: '11px', fontWeight: 600, fill: '#71717a' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
