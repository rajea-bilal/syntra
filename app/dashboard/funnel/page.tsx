'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { FunnelDropoffChart } from '@/components/metrics/FunnelDropoffChart';

import { FunnelChart } from '@/components/metrics/FunnelChart';
import { useQuery } from '@tanstack/react-query';
import { YouTubeVideo } from '@/types/youtube';
import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';

export default function FunnelPage() {
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
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 25 * 60 * 60 * 1000, // 25 hours
  });

  const totalYoutubeViews = useMemo(() => {
    if (!videoAnalytics) return 0;
    return videoAnalytics.reduce((acc, video) => acc + parseInt(video.stats?.viewCount || '0', 10), 0);
  }, [videoAnalytics]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl tracking-tight text-zinc-500 dark:text-zinc-300 font-normal mb-6">Sales Funnel</h1>
        {error ? (
          <div className="text-red-500 text-center p-8 border rounded-lg">
            <p>Error loading data:</p>
            <p className="font-mono bg-red-100 dark:bg-red-900/50 p-2 rounded mt-2">{error.message}</p>
          </div>
        ) : isLoading ? (
          <Card className="p-4 md:p-6 shadow-lg w-full h-[400px] flex items-center justify-center">
            Loading Funnel Data...
          </Card>
        ) : (
          <>
          {/* ---
            Plain language: Removed the old FunnelChart bar chart. Only showing FunnelDropoffChart or other components you want.
          --- */}
          {/* <FunnelChart totalViews={totalYoutubeViews} /> */}
          <FunnelDropoffChart totalViews={totalYoutubeViews} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
} 