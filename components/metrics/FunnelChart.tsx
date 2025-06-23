'use client';

import { Card } from '@/components/ui/Card';
import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useState, useEffect } from 'react';

interface FunnelChartProps {
  totalViews: number;
}

// More realistic and simplified conversion rates based on a typical online funnel.
const CONVERSION_RATES = {
  viewToVisit: 0.05,    // 5% of viewers visit the site.
  visitToBook: 0.10,    // 10% of visitors book a call.
  bookToAccept: 0.80,   // 80% of booked calls are accepted.
  acceptToClose: 0.25,  // 25% of accepted calls close.
};

const LIGHT_COLORS = ['#A8D8B9', '#C3A9D1', '#F5CBA7', '#A9CCE3'];
const DARK_COLORS = ['#6A8E79', '#927E9F', '#B5927F', '#7C93A6'];

export const FunnelChart = ({ totalViews }: FunnelChartProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentColors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  // Simplified funnel stages as per new requirements.
  const visits = totalViews * CONVERSION_RATES.viewToVisit;
  const callsBooked = visits * CONVERSION_RATES.visitToBook;
  const callsAccepted = callsBooked * CONVERSION_RATES.bookToAccept;
  const closed = callsAccepted * CONVERSION_RATES.acceptToClose;
  
  const funnelData = [
    { name: 'Views', value: Math.max(1, Math.round(totalViews)) },
    { name: 'Visits', value: Math.max(1, Math.round(visits)) },
    { name: 'Calls Booked', value: Math.max(1, Math.round(callsBooked)) },
    { name: 'Closed', value: Math.max(1, Math.round(closed)) },
  ].reverse(); // Reverse for top-to-bottom display

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
    return (
        <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm">
          <p className="font-bold">{`${data.name}: ${data.value.toLocaleString()}`}</p>
        </div>
          );
    }
    return null;
  };

  if (!mounted) {
    return (
      <Card className="dark:bg-[#222224]">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-zinc-300">Sales Funnel</h3>
          <div style={{ height: 360, width: '100%' }} className="flex items-center justify-center">
            <p className="text-zinc-500">Loading chart...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-[#222224] shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-zinc-300">Sales Funnel</h3>
        <div style={{ height: 360, width: '100%' }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={funnelData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                scale="log" 
                domain={[1, 'dataMax']} 
                allowDataOverflow 
                stroke={theme === 'dark' ? '#888' : '#aaa'} 
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke={theme === 'dark' ? '#888' : '#aaa'}
                fontSize={12}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={currentColors[index % currentColors.length]} />
                ))}
                <LabelList dataKey="value" position="right" formatter={(value: number) => value.toLocaleString()} style={{ fill: theme === 'dark' ? '#d4d4d8' : '#374151', fontSize: '12px' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}; 