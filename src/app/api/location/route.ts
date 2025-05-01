import { NextResponse } from 'next/server';
import logger from '@/lib/utils/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zipCode');

    if (!zipCode) {
      return NextResponse.json(
        { error: 'Zip code is required' },
        { status: 400 }
      );
    }

    // Use Zippopotam API (free, no API key required)
    const response = await fetch(
      `https://api.zippopotam.us/us/${zipCode}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Invalid zip code' },
          { status: 400 }
        );
      }
      throw new Error('Failed to fetch zip code data');
    }

    const data = await response.json();
    
    if (!data || !data.places || data.places.length === 0) {
      return NextResponse.json(
        { error: 'Invalid zip code' },
        { status: 400 }
      );
    }

    const locationData = data.places[0];
    return NextResponse.json({
      city: locationData['place name'],
      state: locationData['state abbreviation'],
    });
  } catch (error) {
    logger.error('Failed to fetch location data', { error });
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 500 }
    );
  }
} 