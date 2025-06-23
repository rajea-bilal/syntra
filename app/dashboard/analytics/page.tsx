"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MonthlyMetricsTable } from "@/components/metrics/MonthlyMetricsTable";
import { apiMock } from "@/mockData/apiMock";
import type { MonthlyMetrics } from "@/types/metrics";
import dynamic from "next/dynamic";

const MonthlyLineChart = dynamic(
  () => import('@/components/metrics/MonthlyLineChart').then((mod) => mod.MonthlyLineChart),
  { ssr: false, loading: () => <p>Loading chart...</p> }
);

const MonthlyBarChart = dynamic(
  () => import('@/components/metrics/MonthlyBarChart').then((mod) => mod.MonthlyBarChart),
  { ssr: false, loading: () => <p>Loading chart...</p> }
);

export default function AnalyticsPage() {
  const { data: metrics, isLoading } = useQuery<MonthlyMetrics[]>({
    queryKey: ["monthlyMetrics"],
    queryFn: apiMock.getMonthlyMetrics,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-2xl font-semibold">Loading Analytics...</h1>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-2xl font-semibold">
            No analytics data available.
          </h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Performance Trends
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track your month-over-month growth for key funnel metrics.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <MonthlyLineChart
            title="Revenue Over Time ($)"
            data={metrics || []}
            metricKey="totalCashCollected"
          />
          <MonthlyLineChart
            title="Calls Booked Over Time"
            data={metrics || []}
            metricKey="totalCallsBooked"
          />
        </div>

        <Card>
          <h2 className="p-4 text-lg font-semibold">
            Funnel Conversion Rate (%)
          </h2>
          <MonthlyBarChart data={metrics} />
        </Card>

        <Card>
          <h2 className="p-4 text-lg font-semibold">
            Monthly Metrics Breakdown
          </h2>
          <MonthlyMetricsTable data={metrics} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
