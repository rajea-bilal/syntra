import { NextResponse } from 'next/server';
import { generateMockMonthlyMetrics } from '@/mockData/generateMockMonthlyMetrics';

export async function GET(request: Request) {
  try {
    const mockData = generateMockMonthlyMetrics();
    // The Kajabi API needs a different subset of the full metrics data
    const kajabiData = mockData.map(month => ({
      month: month.month,
      new_cash_collected: {
        pif: month.newCashCollected.paidInFull,
        installments: month.newCashCollected.installments,
        by_product: month.newCashCollected.byProduct,
      },
      total_cash_collected: month.totalCashCollected,
      closes: month.closes,
    }));
    return NextResponse.json(kajabiData, { status: 200 });
  } catch (error) {
    console.error('Failed to generate mock Kajabi data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 