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
    const highTicketCloses = Math.floor(acceptedCalls * (0.4 + Math.random() * 0.2));
    const discountCloses = Math.floor(acceptedCalls * (0.1 + Math.random() * 0.1));
    
    return {
      month: date.toISOString().substring(0, 7),
      youtubeTotalViews: views,
      youtubeUniqueViews: Math.floor(views * 0.8),
      uniqueWebsiteVisitors: visitors,
      totalCallsBooked: callsBooked,
      acceptedCalls,
      closes: {
        highTicket: highTicketCloses,
        discount: discountCloses,
      },
      newCashCollected: {
        paidInFull,
        installments,
        byProduct: {
          'Main Course': paidInFull * 0.7,
          'Mini Course': paidInFull * 0.3,
        },
      },
      totalCashCollected: paidInFull + installments
    };
  });
}