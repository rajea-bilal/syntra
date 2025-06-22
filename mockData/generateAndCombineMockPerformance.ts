import { YouTubeVideo, CombinedVideoData, VideoAnalyticsData } from '@/types/youtube';

// generateAndCombineMockPerformance
//
// What this file does:
// - This is the "connector" that merges REAL YouTube data with FAKE sales data.
// - It takes a list of actual videos from the YouTube API.
// - For each real video, it generates a set of mock performance metrics (revenue, leads, etc.).
// - It returns a single, combined list of data that has everything needed for the analytics table.

/**
 * Takes an array of YouTube videos and enriches them with mock performance data.
 * @param videos - An array of `YouTubeVideo` objects from the live API, with stats.
 * @returns An array of `CombinedVideoData` objects with both real and mock data.
 */
export function generateAndCombineMockPerformance(videos: VideoAnalyticsData[]): CombinedVideoData[] {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  return videos.map((video) => {
    // We use the real view count from the video's stats to make the mock data more realistic.
    // The `|| 1` is a safeguard in case stats are missing, to avoid dividing by zero.
    const views = parseInt(video.stats?.viewCount || '1000', 10);
    
    // The rest of the metrics are faked, but based on the real view count.
    const leadsGenerated = Math.floor(views * rand(0.01, 0.05));
    const callsBooked = Math.floor(leadsGenerated * rand(0.3, 0.7));
    const callsAccepted = Math.floor(callsBooked * rand(0.5, 0.9));
    const revenue = Math.floor(callsAccepted * rand(500, 3000));
    const conversionRate = views ? callsAccepted / views : 0;
    const revenuePerView = views ? revenue / views : 0;

    return {
      ...video, // Spread in the real video data
      performance: { // Attach the fake performance data
        leadsGenerated,
        callsBooked,
        callsAccepted,
        revenue,
        conversionRate,
        revenuePerView,
      },
    };
  });
} 