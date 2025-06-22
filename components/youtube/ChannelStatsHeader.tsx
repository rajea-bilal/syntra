'use client';

import { Card } from "@/components/ui/Card";
import { Eye, Users, Video } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { YouTubeChannelStatistics } from '@/services/youtubeApi';
import { MetricCard } from '@/components/metrics/MetricCard';
import YouTubeApiService from '@/services/youtubeApi';

interface ChannelStatsHeaderProps {
  stats: YouTubeChannelStatistics | null;
  isLoading: boolean;
}

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <Card className="p-4 flex flex-col items-center justify-center">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

const ChannelStatsHeader: React.FC<ChannelStatsHeaderProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<Eye />} label="Total Views" value="Loading..." />
        <StatCard icon={<Users />} label="Subscribers" value="Loading..." />
        <StatCard icon={<Video />} label="Total Videos" value="Loading..." />
      </div>
    );
  }

  if (!stats) {
    return <p>Could not load channel statistics.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        icon={<Eye className="text-blue-500" />} 
        label="Total Views" 
        value={parseInt(stats.viewCount, 10).toLocaleString()} 
      />
      <StatCard 
        icon={<Users className="text-green-500" />} 
        label="Subscribers" 
        value={parseInt(stats.subscriberCount, 10).toLocaleString()} 
      />
      <StatCard 
        icon={<Video className="text-red-500" />} 
        label="Total Videos" 
        value={parseInt(stats.videoCount, 10).toLocaleString()} 
      />
    </div>
  );
};

export default function ConnectedChannelStatsHeader() {
  const channelId = "UC_x5XG1OV2P6uZZ5FSM9Ttw"; // Replace with your actual channel ID
  const { data: channelStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['youtubeChannelStats', channelId],
    queryFn: () => YouTubeApiService.getInstance().getChannelStatistics(channelId),
    enabled: !!channelId,
  });

  return <ChannelStatsHeader stats={channelStats || null} isLoading={isLoadingStats} />;
} 