import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MonthlyMetrics, MonthlyMetricsWithChanges } from "@/types/metrics";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility: Format a value as number, currency, or percentage
export function formatValue(
  value: number | string | null | undefined,
  format: 'number' | 'currency' | 'percentage' = 'number'
): string {
  if (value === null || value === undefined || value === '') return '—';
  if (format === 'currency') return `$${Number(value).toLocaleString()}`;
  if (format === 'percentage') return `${Number(value).toFixed(1)}%`;
  return Number(value).toLocaleString();
}

// Utility: Calculate percent change, handling edge cases
export function percentChange(
  current: number | string | null | undefined,
  previous: number | string | null | undefined
): number | null {
  if (
    current === null ||
    previous === null ||
    current === undefined ||
    previous === undefined ||
    previous === 0 ||
    previous === '' ||
    current === ''
  )
    return null;
  const c = Number(current);
  const p = Number(previous);
  if (isNaN(c) || isNaN(p) || p === 0) return null;
  return ((c - p) / p) * 100;
}

// Utility: Get abbreviated month name from YYYY-MM string
export function getMonthName(yyyyMM: string): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = parseInt(yyyyMM.substring(5), 10) - 1;
  return monthNames[monthIndex] ?? yyyyMM;
}

export function calculateMetricsWithChanges(
  metrics: MonthlyMetrics[]
): MonthlyMetricsWithChanges[] {
  return metrics.map((monthData, index) => {
    if (index === 0) {
      return { ...monthData, changes: {} };
    }

    const prevMonthData = metrics[index - 1];

    const totalNewCashCollectedCurrent =
      (monthData.newCashCollected?.paidInFull ?? 0) +
      (monthData.newCashCollected?.installments ?? 0);
    const totalNewCashCollectedPrevious =
      (prevMonthData.newCashCollected?.paidInFull ?? 0) +
      (prevMonthData.newCashCollected?.installments ?? 0);

    const changes = {
      youtubeTotalViews: percentChange(
        monthData.youtubeTotalViews,
        prevMonthData.youtubeTotalViews
      ),
      youtubeUniqueViews: percentChange(
        monthData.youtubeUniqueViews,
        prevMonthData.youtubeUniqueViews
      ),
      uniqueWebsiteVisitors: percentChange(
        monthData.uniqueWebsiteVisitors,
        prevMonthData.uniqueWebsiteVisitors
      ),
      totalCallsBooked: percentChange(
        monthData.totalCallsBooked,
        prevMonthData.totalCallsBooked
      ),
      acceptedCalls: percentChange(
        monthData.acceptedCalls,
        prevMonthData.acceptedCalls
      ),
      newCashCollected: {
        total: percentChange(
          totalNewCashCollectedCurrent,
          totalNewCashCollectedPrevious
        ),
        paidInFull: percentChange(
          monthData.newCashCollected?.paidInFull,
          prevMonthData.newCashCollected?.paidInFull
        ),
        installments: percentChange(
          monthData.newCashCollected?.installments,
          prevMonthData.newCashCollected?.installments
        ),
      },
    };

    return { ...monthData, changes };
  });
}
