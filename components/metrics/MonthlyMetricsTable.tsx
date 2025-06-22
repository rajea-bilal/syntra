import { useState } from "react";
import { MonthlyMetrics } from "../../types/metrics";
import { Card } from "../ui/Card";
import { formatValue, getMonthName } from "../../lib/utils";

interface MonthlyMetricsTableProps {
  data: MonthlyMetrics[];
}

const columns = [
  { key: "month", label: "Month" },
  { key: "youtubeTotalViews", label: "YouTube Views" },
  { key: "uniqueWebsiteVisitors", label: "Unique Website Visitors" },
  { key: "totalCallsBooked", label: "Calls Booked" },
  { key: "totalCashCollected", label: "Cash Collected" },
];

// MonthlyMetricsTable Component
//
// What this file does:
// - Shows a table of monthly metrics (like views, visitors, calls, money)
// - Lets you sort the table by clicking on column headers
// - Shows all the data for each month in rows
//
// What data it expects:
// - An array of monthly metrics objects (one for each month)
//
// Use this table to see all your stats in detail, month by month.

export function MonthlyMetricsTable({ data }: MonthlyMetricsTableProps) {
  const [sortKey, setSortKey] = useState<string>("month");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const sortedData = [...data].sort((a, b) => {
    if (sortKey === "month") {
      return sortAsc
        ? a.month.localeCompare(b.month)
        : b.month.localeCompare(a.month);
    }
    // @ts-ignore
    return sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
  });

  return (
    <Card className="overflow-x-auto p-6">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-left font-semibold cursor-pointer select-none whitespace-nowrap"
                onClick={() => {
                  if (sortKey === col.key) setSortAsc((asc) => !asc);
                  else {
                    setSortKey(col.key);
                    setSortAsc(true);
                  }
                }}
              >
                {col.label}
                {sortKey === col.key ? (sortAsc ? " ▲" : " ▼") : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-zinc-400">
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr key={row.month} className={i % 2 === 0 ? "bg-zinc-50 dark:bg-zinc-900" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">{getMonthName(row.month)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatValue(row.youtubeTotalViews, "number")}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatValue(row.uniqueWebsiteVisitors, "number")}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatValue(row.totalCallsBooked, "number")}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatValue(row.totalCashCollected, "currency")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
} 