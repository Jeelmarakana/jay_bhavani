import { NextResponse } from 'next/server';
import { getGoldRates } from '@/lib/db';

export async function GET() {
  try {
    const baseRates = await getGoldRates();
    
    // Add small random fluctuations to simulate a live ticker
    const randomShift = (max) => (Math.random() - 0.5) * max;
    
    const liveRates = {
      gold24k: Math.round(baseRates.gold24k + randomShift(30)),
      gold22k: Math.round(baseRates.gold22k + randomShift(25)),
      gold18k: Math.round(baseRates.gold18k + randomShift(20)),
      silver: Math.round((baseRates.silver + randomShift(1.5)) * 10) / 10,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ success: true, rates: liveRates }, { status: 200 });
  } catch (error) {
    console.error('API Error in /api/gold-rate:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
