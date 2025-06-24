import { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";
import { formatValue, percentChange } from "../../lib/utils";

// MetricCard Component
//
// What this file does:
// - Shows a single metric (like views, revenue, etc.) in a card
// - Displays the value, change from last time, and an arrow for trend
// - Uses color to show if the change is good or bad
//
// When to use:
// - Use this component anywhere you want to show a quick stat with a trend

type MetricCardVariant = 'sky' | 'violet' | 'teal' | 'amber' | 'default';

interface MetricCardProps {
  title: string;
  value: number | string | null;
  previousValue?: number | string | null;
  format?: "number" | "currency" | "percentage";
  caption?: string;
  variant?: MetricCardVariant;
  Icon: LucideIcon;
}

const variantStyles: Record<MetricCardVariant, {
  bg: string;
  border: string;
  iconColor: string;
}> = {
  default: {
    bg: 'bg-white dark:bg-zinc-900',
    border: 'border-zinc-500',
    iconColor: 'text-zinc-500',
  },
  sky: {
    bg: 'bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-none dark:bg-[#222224]',
    border: 'border-sky-500',
    iconColor: 'text-sky-500',
  },
  violet: {
    bg: 'bg-gradient-to-br from-violet-100 to-violet-50 dark:bg-none dark:bg-[#222224]',
    border: 'border-violet-500',
    iconColor: 'text-violet-500',
  },
  teal: {
    bg: 'bg-gradient-to-br from-teal-100 to-teal-50 dark:bg-none dark:bg-[#222224]',
    border: 'border-teal-500',
    iconColor: 'text-teal-500',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-100 to-amber-50 dark:bg-none dark:bg-[#222224]',
    border: 'border-amber-500',
    iconColor: 'text-amber-500',
  },
};

export function MetricCard({ title, value, previousValue, format = "number", caption, variant = 'default', Icon }: MetricCardProps) {
  const change = percentChange(value, previousValue ?? null);
  const isPositive = change !== null && change >= 0;
  
  const styles = variantStyles[variant];

  return (
    <Card className={`bg-white/80 backdrop-blur-lg border border-white/30 dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl dark:bg-zinc-700/30 p-2 flex items-stretch `}>
      <div className={`w-1  dark:hidden rounded-full mr-4`}></div>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs mb-2 text-zinc-500/80 dark:text-zinc-400">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-zinc-600 dark:text-zinc-100/90">{formatValue(value, format)}</p>
        {change !== null && (
            <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? "▲" : "▼"}{Math.abs(change).toFixed(1)}%
          </span>
        )}
        </div>
        {caption && <p className="text-xs text-zinc-400/80 dark:text-zinc-500 mt-1">{caption}</p>}
      </div>
     
    </Card>
  );
} 