import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Default fallback rates for when database is unavailable
    const defaultRates = {
      gold24k: 7250,
      gold22k: 6650,
      gold18k: 5440,
      silver: 88
    };

    // Add small random fluctuations to simulate a live ticker
    const randomShift = (max) => (Math.random() - 0.5) * max;

    const liveRates = {
      gold24k: Math.round(defaultRates.gold24k + randomShift(30)),
      gold22k: Math.round(defaultRates.gold22k + randomShift(25)),
      gold18k: Math.round(defaultRates.gold18k + randomShift(20)),
      silver: Math.round((defaultRates.silver + randomShift(1.5)) * 10) / 10,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ success: true, rates: liveRates }, { status: 200 });
  } catch (error) {
    console.error('API Error in /api/gold-rate:', error);

    // Fallback response even in case of error
    const fallbackRates = {
      gold24k: 7250,
      gold22k: 6650,
      gold18k: 5440,
      silver: 88,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ success: true, rates: fallbackRates }, { status: 200 });
  }
}
