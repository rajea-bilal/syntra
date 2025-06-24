'use client';

/**
 * Funnel Drop-off Visualization Component
 * 
 * What this component does:
 * - Shows a detailed breakdown of the sales funnel with drop-off percentages
 * - Helps identify where customers are leaving the sales process
 * - Provides actionable insights for improvement
 * 
 * Data Sources:
 * - YouTube Views: REAL DATA from YouTube API (TheLastCodebender channel)
 * - Website Visits: MOCK DATA (simulated analytics)
 * - Calls Booked: MOCK DATA (simulated Cal.com data)
 * - Calls Accepted: MOCK DATA (simulated Cal.com data)
 * - Sales Closed: MOCK DATA (simulated Kajabi data)
 */

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FunnelDropoffChartProps {
  totalViews: number;
}

const CONVERSION_RATES = {
  viewToVisit: 0.05,
  visitToBook: 0.10,
  bookToAccept: 0.80,
  acceptToClose: 0.25,
};

interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
  dropoffRate: number;
  color: string;
}

export const FunnelDropoffChart = ({ totalViews }: FunnelDropoffChartProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isExpanded && detailsRef.current) {
      setMaxHeight(detailsRef.current.scrollHeight + 'px');
    } else {
      setMaxHeight('0px');
    }
  }, [isExpanded]);

  // Calculate funnel stages using mock conversion rates
  const visits = totalViews * CONVERSION_RATES.viewToVisit;
  const callsBooked = visits * CONVERSION_RATES.visitToBook;
  const callsAccepted = callsBooked * CONVERSION_RATES.bookToAccept;
  const closed = callsAccepted * CONVERSION_RATES.acceptToClose;

  const funnelStages: FunnelStage[] = [
    {
      name: 'YouTube Views',
      count: Math.round(totalViews),
      conversionRate: 100,
      dropoffRate: 0,
      color: theme === 'dark' ? '#6A8E79' : '#A8D8B9'
    },
    {
      name: 'Website Visits',
      count: Math.round(visits),
      conversionRate: CONVERSION_RATES.viewToVisit * 100,
      dropoffRate: (1 - CONVERSION_RATES.viewToVisit) * 100,
      color: theme === 'dark' ? '#927E9F' : '#C3A9D1'
    },
    {
      name: 'Calls Booked',
      count: Math.round(callsBooked),
      conversionRate: CONVERSION_RATES.visitToBook * 100,
      dropoffRate: (1 - CONVERSION_RATES.visitToBook) * 100,
      color: theme === 'dark' ? '#B5927F' : '#F5CBA7'
    },
    {
      name: 'Calls Accepted',
      count: Math.round(callsAccepted),
      conversionRate: CONVERSION_RATES.bookToAccept * 100,
      dropoffRate: (1 - CONVERSION_RATES.bookToAccept) * 100,
      color: theme === 'dark' ? '#7C93A6' : '#A9CCE3'
    },
    {
      name: 'Sales Closed',
      count: Math.round(closed),
      conversionRate: CONVERSION_RATES.acceptToClose * 100,
      dropoffRate: (1 - CONVERSION_RATES.acceptToClose) * 100,
      color: theme === 'dark' ? '#5A7A8C' : '#8BB8D4'
    }
  ];

  if (!mounted) return null;

  return (
    <Card className="dark:bg-[#222224] shadow-lg bg-white/60 backdrop-blur-lg border border-white/30 dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl p-4 mt-4">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-500 dark:text-zinc-300">Funnel Drop-off Analysis</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Details
              </>
            )}
          </Button>
        </div>

        {/* Animated Details Section */}
        <div
          style={{
            maxHeight,
            opacity: isExpanded ? 1 : 0,
            transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s',
            overflow: 'hidden',
          }}
        >
          <div ref={detailsRef}>
            {isExpanded && (
              <div className="space-y-6">
                {/* Visual Funnel with Drop-off Indicators */}
                <div className="relative">
                  <div className="flex items-center justify-between space-x-4">
                    {funnelStages.map((stage, index) => (
                      <div key={stage.name} className="flex-1 text-center">
                        <div className="relative">
                          {/* Stage Circle with Count */}
                          <div
                            className="w-18 h-18 shadow-md shadow-black/5 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: stage.color }}
                          >
                            {stage.count.toLocaleString()}
                          </div>
                          <p className="text-xs font-normal tracking-tight text-zinc-500 dark:text-zinc-300 mb-1 mt-2">{stage.name}</p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-normal">
                            {stage.conversionRate.toFixed(1)}% conversion
                          </p>
                        </div>
                        {index < funnelStages.length - 1 && (
                          <div className="flex items-center justify-center mt-4">
                            <div className="flex items-center space-x-1">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              <span className="text-xs text-red-600 dark:text-red-400 font-normal">
                                {stage.dropoffRate.toFixed(1)}% drop-off
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Metrics Table using shadcn Table */}
                <div className="mt-8">
                  <h4 className="text-md font-semibold mb-4 text-zinc-500 dark:text-zinc-200">Detailed Metrics</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-normal text-left text-zinc-500">Stage</TableHead>
                          <TableHead className="font-normal text-right text-zinc-500">Count</TableHead>
                          <TableHead className="font-normal text-right text-zinc-500">Conversion Rate</TableHead>
                          <TableHead className="font-normal text-right text-zinc-500">Drop-off Rate</TableHead>
                          <TableHead className="font-normal text-right text-zinc-500">Action Needed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {funnelStages.map((stage, index) => (
                          <TableRow key={stage.name}>
                            <TableCell className="font-normal text-zinc-600 dark:text-zinc-200">{stage.name}</TableCell>
                            <TableCell className="text-right text-zinc-600 dark:text-zinc-200">
                              {stage.count.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-green-600 dark:text-green-400 font-normal">
                                {stage.conversionRate.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {index > 0 ? (
                                <span className="text-red-600 dark:text-red-400 font-normal">
                                  {stage.dropoffRate.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-zinc-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {index > 0 && stage.dropoffRate > 50 ? (
                                <span className="text-red-600 dark:text-red-400 text-xs font-normal">
                                  High Priority
                                </span>
                              ) : index > 0 && stage.dropoffRate > 20 ? (
                                <span className="text-yellow-600 dark:text-yellow-400 text-xs font-normal">
                                  Medium Priority
                                </span>
                              ) : index > 0 ? (
                                <span className="text-green-600 dark:text-green-400 text-xs font-normal">
                                  Good
                                </span>
                              ) : (
                                <span className="text-zinc-400 text-xs">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};