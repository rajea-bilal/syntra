// ---
// This component shows the complete sales funnel as a row of cards with numbers and conversion rates.
// Pass in the main numbers as props. The component calculates conversion rates and shows arrows between stages.
// ---
import React from 'react';

interface SalesFunnelSummaryProps {
  youtubeViews: number;
  websiteVisits: number;
  callsBooked: number;
  callsAccepted: number;
  totalCloses: number;
}

export const SalesFunnelSummary: React.FC<SalesFunnelSummaryProps> = ({
  youtubeViews,
  websiteVisits,
  callsBooked,
  callsAccepted,
  totalCloses,
}) => {
  // ---
  // Calculate conversion rates for each step
  // ---
  const ctr = youtubeViews > 0 ? (websiteVisits / youtubeViews) * 100 : 0;
  const callRate = websiteVisits > 0 ? (callsBooked / websiteVisits) * 100 : 0;
  const showRate = callsBooked > 0 ? (callsAccepted / callsBooked) * 100 : 0;
  const closeRate = callsAccepted > 0 ? (totalCloses / callsAccepted) * 100 : 0;

  // Format helpers
  const fmt = (n: number) => n.toLocaleString();
  const pct = (n: number) => n.toFixed(1) + '%';

  // ---
  // Define the funnel stages and their display info
  // ---
  const stages = [
    {
      key: 'views',
      value: fmt(youtubeViews),
      label: 'YouTube Views',
      sub: 'Baseline',
      subClass: 'text-blue-500',
    },
    {
      key: 'visits',
      value: fmt(websiteVisits),
      label: 'Website Visits',
      sub: `${pct(ctr)} CTR`,
      subClass: 'text-purple-500',
    },
    {
      key: 'booked',
      value: fmt(callsBooked),
      label: 'Calls Booked',
      sub: `${pct(callRate)} Convert`,
      subClass: 'text-purple-500',
    },
    {
      key: 'accepted',
      value: fmt(callsAccepted),
      label: 'Calls Accepted',
      sub: `${pct(showRate)} Show`,
      subClass: 'text-purple-500',
    },

    {
      key: 'closes',
      value: fmt(totalCloses),
      label: 'Total Closes',
      sub: `${pct(closeRate)} Close`,
      subClass: 'text-purple-500',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center mt-8 bg-white/80 backdrop-blur-lg border border-white/30 dark:bg-[#202022] dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-left mb-4 text-zinc-700 dark:text-zinc-200">
      <span>Complete Sales Funnel</span>
      </h3>
      <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.key}>
            <div className="flex-1 min-w-[140px] rounded-xl p-4  text-center">
              <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-200">{stage.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{stage.label}</div>
              <div className={`text-xs mt-2 ${stage.subClass}`}>{stage.sub}</div>
            </div>
            {idx < stages.length - 1 && (
              <div className="flex items-center justify-center mx-2 text-2xl text-zinc-400 select-none">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}; 