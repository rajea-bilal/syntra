import { VideoAnalyticsData } from '@/types/youtube';

// generateMockVideoAnalytics
//
// What this file does:
// - Creates realistic mock data for the main video analytics table.
// - Simulates the data structure that would come from combining YouTube video info and stats.
//
// Why this is useful:
// - Allows for UI development and testing without needing live YouTube API credentials.
// - Ensures the table component can handle the expected data shape.

/**
 * Generates an array of mock video analytics data.
 * @param count - The number of video records to generate.
 * @returns An array of mock video analytics data.
 */
export function generateMockVideoAnalytics(count = 20): VideoAnalyticsData[] {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  return Array.from({ length: count }, (_, i) => {
    const videoId = `mock_video_${i + 1}`;
    const publishedDate = new Date();
    publishedDate.setDate(publishedDate.getDate() - rand(1, 365));

    const viewCount = rand(1000, 100000);
    const likeCount = Math.floor(viewCount * (rand(10, 50) / 1000));
    const commentCount = Math.floor(viewCount * (rand(1, 10) / 1000));

    return {
      videoId,
      title: `YouTube Video Title ${i + 1}`,
      publishedAt: publishedDate.toISOString(),
      thumbnailUrl: `https://picsum.photos/seed/${videoId}/120/90`,
      description: `This is a mock description for video ${i + 1}. It's a great video.`,
      stats: {
        videoId,
        viewCount: viewCount.toString(),
        likeCount: likeCount.toString(),
        commentCount: commentCount.toString(),
        subscribersGained: Math.floor(viewCount / rand(50, 150)),
      },
    };
  });
} 