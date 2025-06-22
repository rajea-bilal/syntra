"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import YouTubeApiService from "@/services/youtubeApi";
import ConnectedChannelStatsHeader from '@/components/youtube/ChannelStatsHeader';
import VideoPerformanceList from '@/components/youtube/VideoPerformanceList';
import { YouTubeVideo } from '@/services/youtubeApi';

export default function VideosPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/youtube/videos');
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        setVideos(data.videos);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold">Video Performance</h1>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Channel Overview</h2>
          <ConnectedChannelStatsHeader />
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Video Performance</h2>
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <VideoPerformanceList videos={videos} isLoading={isLoading} />
          )}
        </section>
      </div>
    </DashboardLayout>
  );
} 