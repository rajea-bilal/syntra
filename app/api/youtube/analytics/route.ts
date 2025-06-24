import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { YouTubeApiService } from '@/services/youtubeApi';

// Simple in-memory cache for YouTube analytics
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check cache
  const now = Date.now();
  if (cachedData && (now - cacheTimestamp < CACHE_TTL)) {
    return NextResponse.json(cachedData, { status: 200 });
  }

  try {
    // Manually construct the credentials object from the session's properties
    const credentials = {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      scope: session.scope,
      expiry_date: session.expiresAt,
      token_type: 'Bearer',
    };

    const youtubeService = YouTubeApiService.getInstance(credentials);
    
    // Hardcoded channel ID for "TheLastCodebender"
    const channelId = 'UCjEXry5mjyhACMxTxCu7VWg'; 
    
    const videos = await youtubeService.getVideosWithStats(channelId);

    // Store in cache
    cachedData = videos;
    cacheTimestamp = Date.now();

    return NextResponse.json(videos, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch YouTube analytics:', error);
    // Propagate a more specific error message if available
    const errorMessage = error.response?.data?.error?.message || error.message || 'Internal Server Error';
    const status = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
} 