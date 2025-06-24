// ---
// Plain language: This component shows a table of country breakdown data using shadcn UI table components.
// The table now lets users sort by revenue (and other columns if you want). Click the Revenue header to sort.
// ---
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CountryBreakdown } from '@/types/metrics';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/Card';
import { FaCircle } from 'react-icons/fa';
import Image from 'next/image';

export function CountryBreakdownTable() {
  // ---
  // Get the country data from our API.
  // ---
  const { data, isLoading, error } = useQuery<CountryBreakdown[]>({
    queryKey: ['countryBreakdown'],
    queryFn: async () => {
      const res = await fetch('/api/mock/cal/country-breakdown');
      if (!res.ok) throw new Error('Failed to fetch country data');
      return res.json();
    },
  });

  // ---
  // State for sorting: sortKey is the column, sortAsc is true for ascending, false for descending
  // ---
  const [sortKey, setSortKey] = useState<'revenue' | 'country'>('revenue');
  const [sortAsc, setSortAsc] = useState(false); // Default: sort by revenue, highest first

  // ---
  // Sort the data before showing it in the table
  // ---
  let sortedData = data || [];
  if (data) {
    sortedData = [...data].sort((a, b) => {
      if (sortKey === 'revenue') {
        return sortAsc ? a.revenue - b.revenue : b.revenue - a.revenue;
      }
      if (sortKey === 'country') {
        return sortAsc
          ? a.country.localeCompare(b.country)
          : b.country.localeCompare(a.country);
      }
      return 0;
    });
  }

  // ---
  // Calculate summary stats for the analysis bar
  // ---
  const totalMarkets = sortedData.length;
  const totalRevenue = sortedData.reduce((sum, row) => sum + row.revenue, 0);
  const avgConversion =
    sortedData.length > 0
      ? sortedData.reduce((sum, row) => sum + row.conversionRate, 0) / sortedData.length
      : 0;
  const topMarket = sortedData.reduce((max, row) => (row.revenue > max.revenue ? row : max), sortedData[0]);

  // Helper for status dot color (green, orange, red)
  function getStatusColor(row: CountryBreakdown) {
    if (row.leads > 5) return 'text-green-500';
    if (row.leads > 2) return 'text-orange-400';
    return 'text-red-500';
  }

  // Show loading message
  if (isLoading) return <div>Loading country data...</div>;
  // Show error message
  if (error) return <div style={{ color: 'red' }}>Error: {(error as Error).message}</div>;
  // Show message if no data
  if (!data || data.length === 0) return <div>No country data found.</div>;

  // ---
  // Show the table with a glassy/glassy card effect, matching MetricCard.
  // ---
  return (
    <div className="w-full">
     
      <Card className="w-full bg-white/80 backdrop-blur-lg border border-white/30 dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl p-4">
       <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-100 mb-4">Country Breakdown</h2>
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
              <TableHead
                className="font-normal text-zinc-500 px-6 py-3 cursor-pointer select-none text-left tracking-wide text-xs uppercase"
                onClick={() => {
                  if (sortKey === 'country') setSortAsc((asc) => !asc);
                  else {
                    setSortKey('country');
                    setSortAsc(true);
                  }
                }}
              >
                Country
                {sortKey === 'country' ? (sortAsc ? ' ▲' : ' ▼') : ''}
              </TableHead>
              <TableHead className="font-normal text-zinc-500 px-6 py-3 text-right tracking-wide text-xs uppercase">Leads</TableHead>
              <TableHead className="font-normal text-zinc-500 px-6 py-3 text-right tracking-wide text-xs uppercase">Calls Booked</TableHead>
              <TableHead className="font-normal text-zinc-500 px-6 py-3 text-right tracking-wide text-xs uppercase">Calls Accepted</TableHead>
              <TableHead
                className="font-normal text-zinc-500 px-6 py-3 text-right cursor-pointer select-none tracking-wide text-xs uppercase"
                onClick={() => {
                  if (sortKey === 'revenue') setSortAsc((asc) => !asc);
                  else {
                    setSortKey('revenue');
                    setSortAsc(false);
                  }
                }}
              >
                Revenue
                {sortKey === 'revenue' ? (sortAsc ? ' ▲' : ' ▼') : ''}
              </TableHead>
              <TableHead className="font-normal text-zinc-500 px-6 py-3 text-right tracking-wide text-xs uppercase">Conversion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, idx) => (
              <TableRow
                key={row.countryCode}
                className={
                  idx !== sortedData.length - 1
                    ? 'border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors'
                }
              >
                <TableCell className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-100 flex items-center gap-2">
                  <Image
                    src={`https://flagcdn.com/48x36/${row.countryCode.toLowerCase()}.png`}
                    alt={row.country}
                    width={18}
                    height={14}
                    style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', borderRadius: '2px' }}
                    unoptimized
                  />
                  <FaCircle className={getStatusColor(row)} size={8} />
                  <span>{row.country}</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-medium text-zinc-700 dark:text-zinc-100">{row.leads}</TableCell>
                <TableCell className="px-6 py-4 text-right font-medium text-zinc-700 dark:text-zinc-100">{row.callsBooked}</TableCell>
                <TableCell className="px-6 py-4 text-right font-medium text-zinc-700 dark:text-zinc-100">{row.callsAccepted}</TableCell>
                <TableCell className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">${row.revenue.toLocaleString()}</TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.conversionRate === 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>{(row.conversionRate * 100).toFixed(1)}%</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Analysis Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-6 px-2 py-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl shadow-sm">
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalMarkets}</span>
            <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Total Markets</span>
          </div>
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">${totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Total Revenue</span>
          </div>
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(avgConversion * 100).toFixed(1)}%</span>
            <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Avg Conversion</span>
          </div>
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="flex items-center gap-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              <Image
                src={`https://flagcdn.com/48x36/${topMarket.countryCode.toLowerCase()}.png`}
                alt={topMarket.country}
                width={24}
                height={18}
                style={{ borderRadius: '2px', boxShadow: '0 0 2px #ccc' }}
                unoptimized
              />
            </span>
            <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Top Market</span>
          </div>
        </div>
      </Card>
    </div>
  );
} 