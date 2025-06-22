'use client';

import { ResponsiveBar } from '@nivo/bar';
import { Card } from '../ui/Card';
import { MonthlyMetrics } from '../../types/metrics';

interface MonthlyBarChartProps {
  data: MonthlyMetrics[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  // Map month numbers to names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = data.map((d) => {
    const monthIndex = parseInt(d.month.substring(5), 10) - 1;
    return {
      month: monthNames[monthIndex],
      'YouTube Views': d.youtubeTotalViews,
      'Website Visitors': d.uniqueWebsiteVisitors,
      'Calls Booked': d.totalCallsBooked,
      'Cash Collected': d.totalCashCollected,
    };
  });

  return (
    <Card className="h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Monthly Metrics</h3>
      <div style={{ height: 320 }}>
        <ResponsiveBar
          data={chartData}
          keys={['YouTube Views', 'Website Visitors', 'Calls Booked', 'Cash Collected']}
          indexBy="month"
          margin={{ top: 20, right: 30, bottom: 50, left: 100 }}
          padding={0.3}
          groupMode="grouped"
          colors={{ scheme: 'nivo' }}
          axisBottom={{
            legend: 'Month',
            legendPosition: 'middle',
            legendOffset: 60,
          }}
          axisLeft={{
            legend: 'Count',
            legendPosition: 'middle',
            legendOffset: -70,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          animate={true}
        />
      </div>
    </Card>
  );
} 