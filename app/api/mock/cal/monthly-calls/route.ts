import { NextResponse } from 'next/server';
import { generateMockMonthlyMetrics } from '@/mockData/generateMockMonthlyMetrics';

export async function GET(request: Request) {
  try {
    const mockData = generateMockMonthlyMetrics();
    // The Cal.com API needs a subset of the full metrics data
    const calData = mockData.map(month => ({
      month: month.month,
      calls_booked: month.totalCallsBooked,
      calls_accepted: month.acceptedCalls,
      youtube_views: month.youtubeTotalViews,
      unique_visitors: month.uniqueWebsiteVisitors,
    }));
    return NextResponse.json(calData, { status: 200 });
  } catch (error) {
    console.error('Failed to generate mock Cal.com data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 