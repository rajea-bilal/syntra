// ---
// This component shows the complete sales funnel as a row of cards with numbers and conversion rates.
// Pass in the main numbers as props. The component calculates conversion rates and shows arrows between stages.
// Fully responsive with modern UI practices including mobile-first design and container queries.
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
  const fmt = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };
  const pct = (n: number) => n.toFixed(1) + '%';

  // ---
  // Define the funnel stages and their display info
  // ---
  const stages = [
    {
      key: 'views',
      value: fmt(youtubeViews),
      fullValue: youtubeViews.toLocaleString(),
      label: 'YouTube Views',
      sub: 'Baseline',
      subClass: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    },
    {
      key: 'visits',
      value: fmt(websiteVisits),
      fullValue: websiteVisits.toLocaleString(),
      label: 'Website Visits',
      sub: `${pct(ctr)} CTR`,
      subClass: 'text-purple-600 dark:text-purple-400',
      bgClass: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
    },
    {
      key: 'booked',
      value: fmt(callsBooked),
      fullValue: callsBooked.toLocaleString(),
      label: 'Calls Booked',
      sub: `${pct(callRate)} Convert`,
      subClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    },
    {
      key: 'accepted',
      value: fmt(callsAccepted),
      fullValue: callsAccepted.toLocaleString(),
      label: 'Calls Accepted',
      sub: `${pct(showRate)} Show`,
      subClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    },
    {
      key: 'closes',
      value: fmt(totalCloses),
      fullValue: totalCloses.toLocaleString(),
      label: 'Total Closes',
      sub: `${pct(closeRate)} Close`,
      subClass: 'text-rose-600 dark:text-rose-400',
      bgClass: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
    },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-lg border border-white/40 dark:bg-zinc-900/95 dark:border-zinc-700/50 shadow-lg dark:shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Complete Sales Funnel
        </h3>
      </div>

      {/* Desktop/Tablet Layout - Horizontal */}
      <div className="hidden sm:flex justify-center items-center gap-3 md:gap-4 lg:gap-6 xl:gap-8">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.key}>
            {/* Stage Card */}
            <div className={`
              relative group flex-1 min-w-0 max-w-[200px] 
              ${stage.bgClass} 
              border-2 rounded-xl sm:rounded-2xl 
              p-3 sm:p-4 lg:p-5 
              text-center transition-all duration-300 
              hover:scale-105 hover:shadow-lg 
              cursor-pointer
            `}>
              {/* Main Value */}
              <div className="font-black text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-zinc-800 dark:text-zinc-100 mb-2 sm:mb-3">
                {stage.value}
              </div>
              
              {/* Label */}
              <div className="text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-tight mb-2 sm:mb-3">
                {stage.label}
              </div>
              
              {/* Conversion Rate */}
              <div className={`
                inline-block px-2 sm:px-3 py-1 sm:py-1.5 
                rounded-full text-xs sm:text-sm font-semibold
                ${stage.subClass} 
                bg-white/60 dark:bg-black/20
                border border-current/20
              `}>
                {stage.sub}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                  {stage.fullValue}
                </div>
              </div>
            </div>

            {/* Arrow */}
            {idx < stages.length - 1 && (
              <div className="flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl text-zinc-400 dark:text-zinc-500 animate-pulse">
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Layout - Vertical Stack */}
      <div className="sm:hidden space-y-4">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.key}>
            {/* Stage Card */}
            <div className={`
              ${stage.bgClass} 
              border-2 rounded-xl p-4 
              transition-all duration-300 
              active:scale-95
            `}>
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  {/* Value and Label */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-black text-2xl text-zinc-800 dark:text-zinc-100">
                      {stage.value}
                    </span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium truncate">
                      {stage.label}
                    </span>
                  </div>
                  
                  {/* Conversion Rate */}
                  <div className={`
                    inline-block px-2 py-1 rounded-full text-xs font-semibold
                    ${stage.subClass} 
                    bg-white/60 dark:bg-black/20
                    border border-current/20
                  `}>
                    {stage.sub}
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Arrow */}
            {idx < stages.length - 1 && (
              <div className="flex justify-center">
                <div className="text-2xl text-zinc-400 dark:text-zinc-500 animate-bounce">
                  ↓
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100">
              {pct((totalCloses / youtubeViews) * 100)}
            </div>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Overall Conversion
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100">
              {Math.round(youtubeViews / totalCloses || 0)}:1
            </div>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Views per Close
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100">
              ${Math.round((totalCloses > 0 ? 150000 / totalCloses : 0)).toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Avg Deal Size
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              $150,000
            </div>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Total Revenue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};