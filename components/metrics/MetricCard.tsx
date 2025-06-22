import { ArrowUpRight, ArrowDownLeft, Minus } from "lucide-react";
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

interface MetricCardProps {
  title: string;
  value: number | string | null;
  previousValue?: number | string | null;
  format?: "number" | "currency" | "percentage";
  caption?: string;
}

export function MetricCard({ title, value, previousValue, format = "number", caption }: MetricCardProps) {
  const change = percentChange(value, previousValue ?? null);
  const isPositive = change !== null && change >= 0;
  const isNegative = change !== null && change < 0;
  const ArrowIcon = isPositive ? ArrowUpRight : isNegative ? ArrowDownLeft : Minus;
  const changeColor = isPositive ? "text-green-600" : isNegative ? "text-red-500" : "text-zinc-400";

  return (
    <Card className="relative min-h-[120px] flex flex-col justify-between p-4">
      <ArrowIcon className={`absolute top-3 left-3 w-4 h-4 ${changeColor}`} />
      <div className="flex items-baseline gap-2 mt-4">
        <span className="text-3xl font-semibold tracking-tight">{formatValue(value, format)}</span>
        {change !== null && (
          <span className={`text-sm font-medium ml-2 ${changeColor}`}>
            {isPositive ? "+" : ""}{change.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="text-zinc-500 text-base mt-1">{title}</div>
      {caption && <div className="text-zinc-400 text-xs mt-0.5">{caption}</div>}
    </Card>
  );
} 