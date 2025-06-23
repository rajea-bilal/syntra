'use client';

import { Card } from '@/components/ui/Card';
import { CombinedVideoData } from '@/types/youtube';
import Image from 'next/image';

interface TopVideoCardProps {
  video: CombinedVideoData | null;
  metricLabel: string;
  metricValue: string | number;
}

export const TopVideoCard = ({ video, metricLabel, metricValue }: TopVideoCardProps) => {
  if (!video) {
    return (
      <Card className="p-4 md:p-6">
        <div className="h-full flex items-center justify-center text-zinc-500">
          <p>No top performing video found.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-zinc-400">Top Performing Video</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          width={128}
          height={72}
          className="w-32 h-18 rounded-lg object-cover"
        />
        <div className="flex-1 text-center sm:text-left">
          <p className="font-semibold text-base leading-tight dark:text-zinc-400">{video.title}</p>
          <p className="text-sm text-zinc-500 mt-1">Published: {new Date(video.publishedAt).toLocaleDateString()}</p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-sm font-medium text-zinc-500">{metricLabel}</p>
          <p className="text-2xl font-bold text-emerald-500">{metricValue}</p>
        </div>
      </div>
    </Card>
  );
}; 