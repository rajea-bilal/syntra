'use client';

import { ResponsiveLine } from '@nivo/line';
import { Card } from '../ui/Card';
import { MonthlyMetrics } from '../../types/metrics';

interface MonthlyLineChartProps {
  data: MonthlyMetrics[];
  metricKey: keyof MonthlyMetrics;
  title: string;
  yLabel?: string;
}

export function MonthlyLineChart({ data, metricKey, title, yLabel }: MonthlyLineChartProps) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const lineData = [
    {
      id: title,
      data: data.map((d) => {
        const monthIndex = parseInt(d.month.substring(5), 10) - 1;
        return {
          x: monthNames[monthIndex],
          y: d[metricKey] as number,
        };
      }),
    },
  ];

  return (
    <Card className="h-[350px] pb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height: 320 }}>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 32, right: 30, bottom: 50, left: 80 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
          axisBottom={{
            legend: 'Month',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            legend: yLabel || title,
            legendPosition: 'middle',
            legendOffset: -60,
            format: (v: number) => v.toLocaleString(),
          }}
          colors={{ scheme: 'category10' }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableArea={true}
          enableGridX={false}
          enableGridY={true}
          useMesh={true}
          animate={true}
        />
      </div>
    </Card>
  );
} 