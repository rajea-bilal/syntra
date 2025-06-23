'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { Card } from '../ui/Card';
import { MonthlyMetrics } from '../../types/metrics';
import { useState, useEffect } from 'react';

interface MonthlyBarChartProps {
  data: MonthlyMetrics[];
}

const BAR_COLORS = {
  light: {
    views: '#A9CCE3',
    visitors: '#A8D8B9',
    calls: '#C3A9D1',
    revenue: '#F5CBA7',
  },
  dark: {
    views: '#7C93A6',
    visitors: '#6A8E79',
    calls: '#927E9F',
    revenue: '#B5927F',
  },
};

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const chartData = data.map((d) => {
    const monthIndex = parseInt(d.month.substring(5), 10) - 1;
    return {
      month: monthNames[monthIndex],
      'YouTube Views': d.youtubeTotalViews,
      'Visitors': d.uniqueWebsiteVisitors,
      'Calls': d.totalCallsBooked,
      'Revenue': d.totalCashCollected,
    };
  });

  const axisColor = theme === 'dark' ? '#888' : '#aaa';
  const gridColor = theme === 'dark' ? '#444' : '#eee';

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number, color: string, dataKey: string }[], label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((pld) => (
            <div key={pld.dataKey} style={{ color: pld.color }}>
              {`${pld.dataKey}: ${pld.value.toLocaleString()}`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <Card className="p-6 bg-white/60 backdrop-blur-lg border border-white/30 dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Monthly Metrics</h3>
        <div style={{ height: 320 }} className="flex items-center justify-center">
          <p className="text-zinc-500">Loading chart...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-lg border border-white/30 dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold mb-4">Monthly Metrics</h3>
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
            <YAxis stroke={axisColor} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Bar dataKey="YouTube Views" fill={theme === 'dark' ? BAR_COLORS.dark.views : BAR_COLORS.light.views} radius={[4, 4, 0, 0]}/>
            <Bar dataKey="Visitors" fill={theme === 'dark' ? BAR_COLORS.dark.visitors : BAR_COLORS.light.visitors} radius={[4, 4, 0, 0]}/>
            <Bar dataKey="Calls" fill={theme === 'dark' ? BAR_COLORS.dark.calls : BAR_COLORS.light.calls} radius={[4, 4, 0, 0]}/>
            <Bar dataKey="Revenue" fill={theme === 'dark' ? BAR_COLORS.dark.revenue : BAR_COLORS.light.revenue} radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 