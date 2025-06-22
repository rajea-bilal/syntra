'use client';

import { Card } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { generateMockFunnelData } from "@/mockData/generateMockFunnelData";
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from 'next-themes';

export const FunnelChart = () => {
  const { theme } = useTheme();
  const { data: funnelData, isLoading } = useQuery({
    queryKey: ['funnelData'],
    queryFn: () => generateMockFunnelData(1)[0], 
  });

  if (isLoading || !funnelData) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Funnel</h3>
        <div className="h-80 bg-gray-100 dark:bg-zinc-800 rounded-md animate-pulse" />
      </Card>
    );
  }

  // Nivo expects a flexible data structure. We map our typed data
  // to a plain object array that matches what the chart needs.
  // We also reverse it so "Views" appears at the top.
  const chartData = funnelData.map(d => ({
    stage: d.stage,
    count: d.count,
  })).reverse();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sales Funnel</h3>
      <div style={{ height: 360 }}>
        <ResponsiveBar
          data={chartData}
          keys={['count']}
          indexBy="stage"
          layout="horizontal"
          margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
          padding={0.4}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'category10' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Count',
            legendPosition: 'middle',
            legendOffset: 55,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          enableLabel={true}
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
}; 