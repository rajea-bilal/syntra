"use client";
import { useQuery } from '@tanstack/react-query';
import { YouTubeVideo, CombinedVideoData, VideoPerformance } from '@/types/youtube';
import { generateMockVideoPerformance } from '@/mockData/generateMockVideoPerformance';

// This function combines the real video data with mock performance data.
const combineWithMockPerformance = (videos: YouTubeVideo[]): CombinedVideoData[] => {
  return videos.map(video => {
    const mockPerformance: VideoPerformance = generateMockVideoPerformance(video.videoId);
    return {
      ...video,
      performance: mockPerformance,
    };
  });
};

export const useHybridYoutubeData = () => {
  return useQuery<CombinedVideoData[], Error>({
    queryKey: ['hybridYoutubeData'],
    queryFn: async () => {
      // Step 1: Fetch the real video analytics from our API.
      const response = await fetch('/api/youtube/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube analytics data');
      }
      const videos: YouTubeVideo[] = await response.json();

      // Step 2: Combine the real video data with smart mock performance data.
      const combinedData = combineWithMockPerformance(videos);
      
      return combinedData;
    },
  });
}; 