import { YouTubeVideo, YouTubeVideoStatistics } from "@/services/youtubeApi";
import { Card } from "@/components/ui/Card";
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import YouTubeApiService from '@/services/youtubeApi';

interface VideoPerformanceListProps {
  videos: YouTubeVideo[];
  isLoading: boolean;
}

const VideoStats = ({ videoId }: { videoId: string }) => {
  const { data: stats, isLoading, error } = useQuery<YouTubeVideoStatistics>({
    queryKey: ['videoStats', videoId],
    queryFn: () => YouTubeApiService.getInstance().getVideoStatistics([videoId]).then(statsMap => statsMap[videoId]),
    enabled: !!videoId,
  });

  if (isLoading) return <span className="text-sm text-gray-400">Loading stats...</span>;
  if (error) return <span className="text-sm text-red-500">Error loading stats</span>;
  if (!stats) return null;

  return (
    <div className="flex gap-4 mt-2 text-sm">
      <span>Views: {stats.viewCount}</span>
      <span>Likes: {stats.likeCount}</span>
      <span>Comments: {stats.commentCount}</span>
    </div>
  );
};

const VideoRow = ({ video }: { video: YouTubeVideo }) => (
  <Card className="flex items-center p-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
    <Image 
      src={video.thumbnailUrl} 
      alt={video.title} 
      width={120} 
      height={90} 
      className="rounded-lg"
    />
    <div className="flex-1">
      <h3 className="font-semibold">{video.title}</h3>
      <p className="text-sm text-gray-500">Published: {new Date(video.publishedAt).toLocaleDateString()}</p>
      <VideoStats videoId={video.videoId} />
    </div>
  </Card>
);

export default function VideoPerformanceList({ videos, isLoading }: VideoPerformanceListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 h-28 animate-pulse bg-gray-200 dark:bg-zinc-800">
            <div />
          </Card>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return <p>No videos found for this channel.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {videos.map((video) => (
        <VideoRow key={video.videoId} video={video} />
      ))}
    </div>
  );
} 