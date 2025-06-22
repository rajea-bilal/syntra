import { VideoPerformance } from '../types/youtube';

// generateMockVideoPerformance
//
// What this file does:
// - Makes fake data for YouTube video performance (views, leads, calls, revenue, etc.)
// - Used for testing and building the dashboard before real data is ready
//
// What kind of data:
// - Makes up numbers for each video (like how many views, how much money, etc.)
//
// Use this to fill your dashboard with sample video data while you work.

/**
 * Generates a single mock video performance data object for a given video ID.
 * @param videoId The ID of the video to generate mock performance for.
 */
export function generateMockVideoPerformance(videoId: string): VideoPerformance {
  // Helper to generate a random float between min and max
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  // Simulate leads and revenue based on a hash of the videoId for consistency
  const hash = videoId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const leadsGenerated = Math.floor(rand(5, 50) * (1 + (hash % 10) / 10)); // 5-100
  const revenue = Math.floor(rand(100, 2000) * (1 + (hash % 15) / 10)); // 100-5000

  return {
    revenue: revenue,
    leadsGenerated: leadsGenerated,
  };
} 