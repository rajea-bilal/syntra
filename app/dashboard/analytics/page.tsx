'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { VideoAnalyticsTable } from '@/components/youtube/VideoAnalyticsTable';
import { useQuery } from '@tanstack/react-query';

export default function AnalyticsPage() {
  const { data: videoAnalytics, isLoading, error } = useQuery({
    queryKey: ['youtubeAnalytics'],
    queryFn: async () => {
      const res = await fetch('/api/youtube/analytics');
      if (!res.ok) {
        // You might want to inspect the response to get a more specific error
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to fetch analytics data');
      }
      return res.json();
    },
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">Video Analytics</h1>
        {error ? (
          <div className="text-red-500 text-center p-8 border rounded-lg">
            <p>Error loading data:</p>
            <p className="font-mono bg-red-100 dark:bg-red-900/50 p-2 rounded mt-2">{error.message}</p>
          </div>
        ) : (
          <VideoAnalyticsTable data={videoAnalytics || []} isLoading={isLoading} />
        )}
      </div>
    </DashboardLayout>
  );
} 