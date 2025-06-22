import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import YouTubeApiService from '@/services/youtubeApi';
import { Credentials } from 'google-auth-library';
import { YouTubeVideo } from '@/types/youtube';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const youtubeService = YouTubeApiService.getInstance({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      scope: session.scope,
      token_type: 'Bearer',
      expiry_date: session.expiresAt,
    } as Credentials);

    const channelId = "UCjEXry5mjyhACMxTxCu7VWg"; // @TheLastCodebender Channel ID
    
    const { videos } = await youtubeService.getChannelVideos(channelId);

    if (videos.length === 0) {
      console.log('No videos found for channel ID:', channelId);
      return NextResponse.json([]);
    }

    const videoIds = videos.map((v: YouTubeVideo) => v.videoId);
    const stats = await youtubeService.getVideoStatistics(videoIds);

    const videosWithStats = videos.map((video: YouTubeVideo) => ({
      ...video,
      stats: stats[video.videoId],
    }));

    return NextResponse.json(videosWithStats);
  } catch (error) {
    console.error('Error fetching YouTube analytics:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: 'Failed to fetch YouTube analytics', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch YouTube analytics' }, { status: 500 });
  }
} 