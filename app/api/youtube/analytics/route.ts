import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { YouTubeApiService } from '@/services/youtubeApi';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    return NextResponse.json(videos, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch YouTube analytics:', error);
    // Propagate a more specific error message if available
    const errorMessage = error.response?.data?.error?.message || error.message || 'Internal Server Error';
    const status = error.response?.status || 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
} 