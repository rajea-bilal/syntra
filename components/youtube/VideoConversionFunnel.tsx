'use client';

import { CombinedVideoData } from '@/types/youtube';
import { ArrowRight } from 'lucide-react';

interface FunnelStepProps {
  label: string;
  value: number;
  isFirst?: boolean;
}

const FunnelStep = ({ label, value, isFirst = false }: FunnelStepProps) => (
  <div className={`flex items-center ${isFirst ? '' : 'ml-4'}`}>
    {!isFirst && <ArrowRight className="h-4 w-4 text-zinc-400 mr-4" />}
    <div className="text-center">
      <p className="font-bold text-lg">{value.toLocaleString()}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  </div>
);

interface VideoConversionFunnelProps {
  video: CombinedVideoData;
}

export const VideoConversionFunnel = ({ video }: VideoConversionFunnelProps) => {
  const views = parseInt(video.stats?.viewCount || '0', 10);
  const leads = video.leadsGenerated || 0;
  const booked = video.callsBooked || 0;
  const accepted = video.callsAccepted || 0;
  const closed = video.closedDeals || 0;

  const getRate = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0);

  return (
    <div className="p-4 bg-white dark:bg-zinc-950 rounded-lg">
      <h4 className="font-semibold mb-4 text-base">Conversion Funnel</h4>
      <div className="flex flex-wrap items-center gap-y-4">
        <FunnelStep label="Views" value={views} isFirst />
        <FunnelStep label="Leads" value={leads} />
        <FunnelStep label="Calls Booked" value={booked} />
        <FunnelStep label="Calls Accepted" value={accepted} />
        <FunnelStep label="Deals Closed" value={closed} />
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="font-medium">View → Lead</p>
          <p className="text-emerald-500 font-semibold">{getRate(leads, views).toFixed(2)}%</p>
        </div>
        <div>
          <p className="font-medium">Lead → Booked</p>
          <p className="text-emerald-500 font-semibold">{getRate(booked, leads).toFixed(2)}%</p>
        </div>
        <div>
          <p className="font-medium">Booked → Accepted</p>
          <p className="text-emerald-500 font-semibold">{getRate(accepted, booked).toFixed(2)}%</p>
        </div>
        <div>
          <p className="font-medium">Accepted → Closed</p>
          <p className="text-emerald-500 font-semibold">{getRate(closed, accepted).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}; 