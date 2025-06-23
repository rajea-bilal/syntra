'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { VideoAnalyticsTable } from '@/components/youtube/VideoAnalyticsTable';
import { useQuery } from '@tanstack/react-query';
import { YouTubeVideo, CombinedVideoData, VideoPerformance } from '@/types/youtube';
import { generateMockVideoPerformance } from "@/mockData/generateMockVideoPerformance";
import { generateMockAttribution } from "@/mockData/generateMockAttribution";
import { useMemo } from 'react';

const combineWithMockPerformance = (videos: YouTubeVideo[]): CombinedVideoData[] => {
  const attributionData = generateMockAttribution(videos);
  const attributionMap = new Map(attributionData.map(attr => [attr.videoId, attr]));

  return videos.map(video => {
    const mockPerformance: VideoPerformance = generateMockVideoPerformance(video.videoId);
    const attribution = attributionMap.get(video.videoId);
    const viewCount = parseInt(video.stats?.viewCount || '0', 10);
    const revenue = attribution?.revenue || 0;
    const closedDeals = attribution?.closedDeals || 0;

    return {
      ...video,
      performance: mockPerformance,
      leadsGenerated: attribution?.leadsGenerated,
      callsBooked: attribution?.callsBooked,
      callsAccepted: attribution?.callsAccepted,
      closedDeals: closedDeals,
      revenue: revenue,
      revenuePerView: viewCount > 0 ? revenue / viewCount : 0,
      viewToCloseRate: viewCount > 0 ? (closedDeals / viewCount) * 100 : 0,
    };
  });
};


export default function VideosPage() {
  const { data: videoAnalytics, isLoading, error } = useQuery<YouTubeVideo[]>({
    queryKey: ['youtubeAnalytics'],
    queryFn: async () => {
      const res = await fetch('/api/youtube/analytics');
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to fetch analytics data');
      }
      return res.json();
    },
  });

  const combinedData = useMemo(() => {
    if (!videoAnalytics) return [];
    return combineWithMockPerformance(videoAnalytics);
  }, [videoAnalytics]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">Video Performance</h1>
        {error ? (
          <div className="text-red-500 text-center p-8 border rounded-lg">
            <p>Error loading data:</p>
            <p className="font-mono bg-red-100 dark:bg-red-900/50 p-2 rounded mt-2">{error.message}</p>
          </div>
        ) : (
          <VideoAnalyticsTable data={combinedData || []} isLoading={isLoading} />
        )}
      </div>
    </DashboardLayout>
  );
} 