'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useTheme } from 'next-themes';
import { Card } from '../ui/Card';
import { MonthlyMetrics } from '../../types/metrics';
import { useState, useEffect } from 'react';

interface MonthlyLineChartProps {
  data: MonthlyMetrics[];
  metricKey: string; // Allow for nested keys like 'closes.highTicket'
  title: string;
}

type ColorMap = { [key: string]: string };

const METRIC_COLORS: { light: ColorMap, dark: ColorMap } = {
  light: {
    'youtubeTotalViews': '#A9CCE3', 
    'uniqueWebsiteVisitors': '#A8D8B9',
    'totalCallsBooked': '#C3A9D1',
    'acceptedCalls': '#F5CBA7',
    'closes.highTicket': '#F7DC6F',
    'closes.discount': '#F5B7B1',
    'totalCashCollected': '#82E0AA',
    'default': '#B2BABB'
  },
  dark: {
    'youtubeTotalViews': '#7C93A6', 
    'uniqueWebsiteVisitors': '#6A8E79',
    'totalCallsBooked': '#927E9F',
    'acceptedCalls': '#B5927F',
    'closes.highTicket': '#B7A45A',
    'closes.discount': '#B58B87',
    'totalCashCollected': '#5E9C76',
    'default': '#8D9395'
  }
};

// Helper function to safely access nested properties
function getNestedValue(obj: MonthlyMetrics, path: string): number {
  return path.split('.').reduce((acc: any, part: string) => acc && acc[part], obj) || 0;
}

export function MonthlyLineChart({ data, metricKey, title }: MonthlyLineChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = data.map((d) => {
        const monthIndex = parseInt(d.month.substring(5), 10) - 1;
        return {
      month: monthNames[monthIndex],
      value: getNestedValue(d, metricKey),
    };
  });
  
  const axisColor = theme === 'dark' ? '#888' : '#aaa';
  const gridColor = theme === 'dark' ? '#444' : '#eee';
  const currentColors = theme === 'dark' ? METRIC_COLORS.dark : METRIC_COLORS.light;
  const lineColor = currentColors[metricKey] || currentColors['default'];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      if (data && typeof data.value === 'number') {
        return (
          <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm shadow-lg">
            <p className="font-bold">{`${label}`}</p>
            <p style={{ color: lineColor }}>{`${title}: ${data.value.toLocaleString()}`}</p>
          </div>
        );
      }
    }
    return null;
  };

  if (!mounted) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div style={{ height: 300 }} className="flex items-center justify-center">
          <p className="text-zinc-500">Loading chart...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id={`color-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
            <YAxis 
              stroke={axisColor} 
              fontSize={12} 
              domain={['dataMin - 10', 'dataMax + 10']}
              tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : ''}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} fillOpacity={1} fill={`url(#color-${metricKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 