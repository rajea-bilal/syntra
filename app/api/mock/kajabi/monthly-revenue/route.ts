import { NextResponse } from 'next/server';
import { mockKajabiData } from '@/mockData/apiData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (month) {
    const monthData = mockKajabiData.find(d => d.month === month);
    if (monthData) {
      return NextResponse.json(monthData);
    } else {
      return NextResponse.json({ error: `No data found for month: ${month}` }, { status: 404 });
    }
  }

  return NextResponse.json(mockKajabiData);
} 