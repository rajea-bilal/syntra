'use client';

import { useState } from "react";
import { MonthlyMetrics } from "../../types/metrics";
import { Card } from "../ui/Card";
import { formatValue, getMonthName } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MonthlyMetricsTableProps {
  data: MonthlyMetrics[];
}

const columns = [
  { key: "month", label: "Month" },
  { key: "youtubeTotalViews", label: "YouTube Views" },
  { key: "youtubeUniqueViews", label: "YouTube Unique Views" },
  { key: "uniqueWebsiteVisitors", label: "Unique Website Visitors" },
  { key: "totalCallsBooked", label: "Total Calls Booked" },
  { key: "acceptedCalls", label: "Accepted Calls" },
  { key: "newCashCollected.paidInFull", label: "New - Paid in Full" },
  { key: "newCashCollected.installments", label: "New - Installments" },
  { key: "totalCashCollected", label: "Total Cash Collected" },
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
    
    const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => (o || {})[k], obj);

    const valA = getNestedValue(a, sortKey);
    const valB = getNestedValue(b, sortKey);

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  const ChangeCell = ({ value }: { value: number | undefined }) => {
    if (value === undefined || !isFinite(value)) {
      return <span className="text-xs text-gray-400 ml-2">-</span>;
    }
    const color = value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-gray-500';
    const sign = value > 0 ? '+' : '';
    return (
      <span className={`text-xs font-medium ml-2 ${color}`}>
        {sign}{value.toFixed(1)}%
      </span>
    );
  };

  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-zinc-500">No monthly data available.</div>;
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead 
                  key={col.key} 
                  className="text-right cursor-pointer select-none"
                  onClick={() => {
                    if (sortKey === col.key) setSortAsc(asc => !asc);
                    else {
                      setSortKey(col.key);
                      setSortAsc(true);
                    }
                  }}
                >
                  {col.label}
                  {sortKey === col.key ? (sortAsc ? " ▲" : " ▼") : null}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((metric) => (
              <TableRow key={metric.month} className="even:bg-zinc-50 dark:even:bg-zinc-900">
                <TableCell className="font-medium text-left">{metric.month}</TableCell>
                <TableCell className="text-right">
                    {formatValue(metric.youtubeTotalViews, 'number')}
                    <ChangeCell value={metric.changes?.youtubeTotalViews} />
                </TableCell>
                <TableCell className="text-right">
                    {formatValue(metric.youtubeUniqueViews, 'number')}
                    <ChangeCell value={metric.changes?.youtubeUniqueViews} />
                </TableCell>
                <TableCell className="text-right">
                    {formatValue(metric.uniqueWebsiteVisitors, 'number')}
                    <ChangeCell value={metric.changes?.uniqueWebsiteVisitors} />
                </TableCell>
                <TableCell className="text-right">
                    {formatValue(metric.totalCallsBooked, 'number')}
                    <ChangeCell value={metric.changes?.totalCallsBooked} />
                </TableCell>
                <TableCell className="text-right">
                    {formatValue(metric.acceptedCalls, 'number')}
                    <ChangeCell value={metric.changes?.acceptedCalls} />
                </TableCell>
                <TableCell className="text-right">
                    {formatValue(metric.newCashCollected.paidInFull, 'currency')}
                    <ChangeCell value={metric.changes?.paidInFull} />
                </TableCell>
                <TableCell className="text-right">
                    {formatValue(metric.newCashCollected.installments, 'currency')}
                    <ChangeCell value={metric.changes?.installments} />
                </TableCell>
                <TableCell className="text-right">
                    {formatValue(metric.totalCashCollected, 'currency')}
                    <ChangeCell value={metric.changes?.totalCashCollected} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
} 