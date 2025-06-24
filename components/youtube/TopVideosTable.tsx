import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { formatValue } from '@/lib/utils';
import Image from 'next/image';

interface TopVideosTableProps {
  videos: any[];
}

export function TopVideosTable({ videos }: TopVideosTableProps) {
  return (
    <div className="w-full">
      <Card className="w-full bg-white/80 backdrop-blur-lg border border-white/30 dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-100 mb-4">Top Performing Videos</h2>
          <a href="/dashboard/videos" className="text-blue-600 text-sm font-medium hover:underline">View All</a>
        </div>
        <Table className="w-full">
          <TableHeader>
            <TableRow className="text-xs text-zinc-500 uppercase">
              <TableHead className="text-zinc-500 font-normal text-left pb-2">Video</TableHead>
              <TableHead className="text-zinc-500 font-normal text-right pb-2">Views</TableHead>
              <TableHead className="text-zinc-500 font-normal text-right pb-2">Leads</TableHead>
              <TableHead className="text-zinc-500 font-normal text-right pb-2">Closes</TableHead>
              <TableHead className="text-zinc-500 font-normal text-right pb-2">Revenue</TableHead>
              <TableHead className="text-zinc-500 font-normal text-right pb-2">$/View</TableHead>
              <TableHead className="text-zinc-500 font-normal text-right pb-2">Convert %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.videoId} className="border-t border-zinc-100 dark:border-zinc-800">
                <TableCell className="py-2 pr-2 text-zinc-700 dark:text-zinc-100 font-normal text-xs text-left max-w-[320px] truncate">
                  <div className="flex items-center gap-3">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      width={48}
                      height={40}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                    <span className="truncate">{video.title}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-right text-xs">{video.stats?.viewCount?.toLocaleString() ?? '-'}</TableCell>
                <TableCell className="py-2 text-right text-xs">{video.leadsGenerated ?? '-'}</TableCell>
                <TableCell className="py-2 text-right text-xs">{video.closedDeals ?? '-'}</TableCell>
                <TableCell className="py-2 text-right text-xs text-green-600">{formatValue(video.revenue, 'currency')}</TableCell>
                <TableCell className="py-2 text-right text-xs text-green-600">{video.revenuePerView ? formatValue(video.revenuePerView, 'currency') : '-'}</TableCell>
                <TableCell className="py-2 text-right text-xs text-blue-600">{video.viewToCloseRate ? video.viewToCloseRate.toFixed(1) + '%' : '0.0%'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 