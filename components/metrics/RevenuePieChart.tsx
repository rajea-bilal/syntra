'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { useTheme } from 'next-themes';
import { MonthlyMetrics } from '@/types/metrics';
import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';

interface RevenuePieChartProps {
  data: MonthlyMetrics[];
}

const LIGHT_COLORS = ['#A8D8B9', '#C3A9D1', '#F5CBA7', '#A9CCE3', '#F7DC6F', '#F5B7B1'];
const DARK_COLORS = ['#6A8E79', '#927E9F', '#B5927F', '#7C93A6', '#B7A45A', '#B58B87'];

export function RevenuePieChart({ data }: RevenuePieChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentColors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const productRevenue = data.reduce((acc, month) => {
    const products = month.newCashCollected.byProduct || {};
    for (const productName in products) {
      if (Object.prototype.hasOwnProperty.call(products, productName)) {
        acc[productName] = (acc[productName] || 0) + products[productName];
      }
    }
    return acc;
  }, {} as { [key: string]: number });

  const pieData = Object.keys(productRevenue).map((productName, index) => ({
    name: productName,
    value: productRevenue[productName],
    fill: currentColors[index % currentColors.length],
  }));

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      if (data && data.payload && data.name && data.value) {
        return (
          <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm shadow-lg">
            <p style={{ color: (data.payload as any).fill }}>
              {`${data.name}: ${data.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  const legendTextColor = theme === 'dark' ? '#fff' : '#333';

  if (!mounted) {
    return (
      <Card>
        <div className="h-72 flex items-center justify-center">
          <p className="text-zinc-500">Loading chart...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ color: legendTextColor, fontSize: '12px' }}
          />
          <Pie
        data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 