'use client';

import { ResponsiveBar } from '@nivo/bar';
import { Card } from '../ui/Card';
import { MonthlyMetrics } from '../../types/metrics';
import { useTheme } from 'next-themes';

interface SingleMetricBarChartProps {
  data: MonthlyMetrics[];
  metricKey: keyof MonthlyMetrics;
  title: string;
  yLabel?: string;
}

export function SingleMetricBarChart({ data, metricKey, title, yLabel }: SingleMetricBarChartProps) {
  const { theme } = useTheme();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = data.map((d) => {
    const monthIndex = parseInt(d.month.substring(5), 10) - 1;
    return {
      month: monthNames[monthIndex],
      value: d[metricKey] as number,
    };
  });

  return (
    <Card className="p-4 md:p-6 w-full max-w-lg lg:mx-auto">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-72">
        <ResponsiveBar
          data={chartData}
          keys={["value"]}
          indexBy="month"
          margin={{ top: 32, right: 30, bottom: 80, left: 80 }}
          padding={0.3}
          colors={['#6366F1']}
          axisBottom={{
            legend: 'Month',
            legendPosition: 'middle',
            legendOffset: 48,
          }}
          axisLeft={{
            legend: yLabel || title,
            legendPosition: 'middle',
            legendOffset: -60,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={'#ffffff'}
          animate={true}
          theme={{
            axis: {
              ticks: { text: { fill: theme === 'dark' ? '#fff' : '#333' } },
              legend: { text: { fill: theme === 'dark' ? '#fff' : '#333' } },
            },
            tooltip: {
              container: {
                background: theme === 'dark' ? '#333' : '#fff',
                color: theme === 'dark' ? '#fff' : '#333',
              },
            },
          }}
        />
      </div>
    </Card>
  );
} 