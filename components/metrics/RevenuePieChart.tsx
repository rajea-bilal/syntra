'use client';

import { ResponsivePie } from '@nivo/pie';
import { useTheme } from 'next-themes';
import { MonthlyMetrics } from '@/types/metrics';

interface RevenuePieChartProps {
  data: MonthlyMetrics[];
}

export function RevenuePieChart({ data }: RevenuePieChartProps) {
  const { theme } = useTheme();

  // Aggregate the revenue data for the entire period
  const totalPaidInFull = data.reduce((acc, month) => acc + month.newCashCollected.paidInFull, 0);
  const totalInstallments = data.reduce((acc, month) => acc + month.newCashCollected.installments, 0);

  const pieData = [
    {
      id: 'Paid in Full',
      label: 'Paid in Full',
      value: totalPaidInFull,
    },
    {
      id: 'Installments',
      label: 'Installments',
      value: totalInstallments,
    },
  ];

  return (
    <div className="h-72">
      <ResponsivePie
        data={pieData}
        margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={theme === 'dark' ? '#fff' : '#333'}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        theme={{
          tooltip: {
            container: {
              background: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#333',
            },
          },
        }}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 15,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: theme === 'dark' ? '#fff' : '#000'
                        }
                    }
                ]
            }
        ]}
      />
    </div>
  );
} 