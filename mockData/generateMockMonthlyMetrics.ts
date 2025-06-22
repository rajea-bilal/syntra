// generateMockMonthlyMetrics
//
// What this file does:
// - Makes fake data for each month (views, visitors, calls, money, etc.)
// - Used for testing and building the dashboard before real data is ready
//
// What kind of data:
// - Makes up numbers for each metric for 12 months
//
// Use this to fill your dashboard with sample data while you work.

import { MonthlyMetrics } from '../types/metrics';

export function generateMockMonthlyMetrics(months = 12): MonthlyMetrics[] {
  const currentDate = new Date();
  return Array.from({ length: months }).map((_, index) => {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - (months - 1) + index);
    
    const views = Math.floor(10000 + Math.random() * 15000);
    const visitors = Math.floor(views * (0.1 + Math.random() * 0.1));
    const callsBooked = Math.floor(visitors * (0.05 + Math.random() * 0.05));
    const acceptedCalls = Math.floor(callsBooked * (0.3 + Math.random() * 0.4));
    const paidInFull = Math.floor(acceptedCalls * (0.2 + Math.random() * 0.3) * 2000);
    const installments = Math.floor(acceptedCalls * (0.3 + Math.random() * 0.3) * 500);
    
    return {
      month: date.toISOString().substring(0, 7),
      youtubeTotalViews: views,
      youtubeUniqueViews: Math.floor(views * 0.8),
      uniqueWebsiteVisitors: visitors,
      totalCallsBooked: callsBooked,
      acceptedCalls,
      newCashCollected: {
        paidInFull,
        installments
      },
      totalCashCollected: paidInFull + installments
    };
  });
} 