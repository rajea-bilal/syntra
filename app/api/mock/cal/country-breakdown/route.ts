// ---
// Plain language: This API route gives us country breakdown data for the dashboard. When the frontend asks for country data, it comes here. Right now, it gives back fake (mock) data, but later it will give real data from Cal.com. You don't need to change the frontend when we switch.
// ---
import { NextResponse } from 'next/server';
import { getCountryBreakdown } from '@/services/calComService';

export async function GET() {
  try {
    const data = await getCountryBreakdown();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // If something goes wrong, send an error message
    return NextResponse.json({ error: 'Failed to get country breakdown data' }, { status: 500 });
  }
} 