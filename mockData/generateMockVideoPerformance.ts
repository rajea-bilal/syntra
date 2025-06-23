import { VideoPerformance, YouTubeVideo } from '../types/youtube';

/**
 * Generates a single mock video performance data object for a given video.
 * @param video The YouTubeVideo object to generate mock performance for.
 */
export function generateMockVideoPerformance(video: YouTubeVideo): VideoPerformance {
  // Helper to generate a random float between min and max
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  // Use the video's actual stats where available, otherwise use random numbers.
  const views = parseInt(video.stats?.viewCount || '0', 10) || Math.floor(rand(100, 10000));
  
  // Simulate leads and revenue based on a hash of the videoId for consistency
  const hash = video.videoId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const leadsGenerated = Math.floor(views * (0.01 + (hash % 5) / 100)); // 1-6% of views
  const callsBooked = Math.floor(leadsGenerated * rand(0.3, 0.7));
  const callsAccepted = Math.floor(callsBooked * rand(0.5, 0.9));
  const revenue = Math.floor(callsAccepted * rand(500, 3000) * (1 + (hash % 15) / 10));
  const conversionRate = views > 0 ? callsAccepted / views : 0;
  const revenuePerView = views > 0 ? revenue / views : 0;

  return {
    videoId: video.videoId,
    title: video.title,
    views: views,
    leadsGenerated: leadsGenerated,
    callsBooked: callsBooked,
    callsAccepted: callsAccepted,
    revenue: revenue,
    conversionRate: conversionRate,
    revenuePerView: revenuePerView,
  };
}