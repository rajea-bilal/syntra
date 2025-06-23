'use client';

import { Card } from "@/components/ui/Card";
import { Eye, Users, Video } from "lucide-react";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { YouTubeChannelStatistics } from '@/types/youtube';

interface StatCardProps {
  icon: React.ReactElement;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
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

interface ChannelStatsHeaderProps {
  stats: YouTubeChannelStatistics | null;
  isLoading: boolean;
}

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
        value={stats.viewCount ? parseInt(stats.viewCount, 10).toLocaleString() : 'N/A'} 
      />
      <StatCard 
        icon={<Users className="text-green-500" />} 
        label="Subscribers" 
        value={stats.subscriberCount ? parseInt(stats.subscriberCount, 10).toLocaleString() : 'N/A'}
      />
      <StatCard 
        icon={<Video className="text-red-500" />} 
        label="Total Videos" 
        value={stats.videoCount ? parseInt(stats.videoCount, 10).toLocaleString() : 'N/A'} 
      />
    </div>
  );
};

export default ChannelStatsHeader; 