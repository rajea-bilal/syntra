import React from 'react';

interface SalesFunnelSummaryProps {
  youtubeViews: number;
  websiteVisits: number;
  callsBooked: number;
  callsAccepted: number;
  totalCloses: number;
}

interface FunnelStage {
  key: string;
  value: string;
  fullValue: string;
  label: string;
  conversionRate: string;
  borderColor: string;
}

const STAGE_COLORS = [
  '#F5E1D4', // Warm beige
  '#EDDEE8', // Soft pink
  '#E9DFED', // Light lavender
  '#D9DFF2', // Pale blue
  '#D1E2F2'  // Light blue
] as const;

export const SalesFunnelSummary: React.FC<SalesFunnelSummaryProps> = ({
  youtubeViews,
  websiteVisits,
  callsBooked,
  callsAccepted,
  totalCloses,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatPercentage = (num: number): string => `${num.toFixed(1)}%`;

  const calculateConversionRates = () => {
    const ctr = youtubeViews > 0 ? (websiteVisits / youtubeViews) * 100 : 0;
    const callRate = websiteVisits > 0 ? (callsBooked / websiteVisits) * 100 : 0;
    const showRate = callsBooked > 0 ? (callsAccepted / callsBooked) * 100 : 0;
    const closeRate = callsAccepted > 0 ? (totalCloses / callsAccepted) * 100 : 0;

    return { ctr, callRate, showRate, closeRate };
  };

  const { ctr, callRate, showRate, closeRate } = calculateConversionRates();

  const stages: FunnelStage[] = [
    {
      key: 'views',
      value: formatNumber(youtubeViews),
      fullValue: youtubeViews.toLocaleString(),
      label: 'YouTube Views',
      conversionRate: 'Baseline',
      borderColor: STAGE_COLORS[0],
    },
    {
      key: 'visits',
      value: formatNumber(websiteVisits),
      fullValue: websiteVisits.toLocaleString(),
      label: 'Website Visits',
      conversionRate: `${formatPercentage(ctr)} CTR`,
      borderColor: STAGE_COLORS[1],
    },
    {
      key: 'booked',
      value: formatNumber(callsBooked),
      fullValue: callsBooked.toLocaleString(),
      label: 'Calls Booked',
      conversionRate: `${formatPercentage(callRate)} Convert`,
      borderColor: STAGE_COLORS[2],
    },
    {
      key: 'accepted',
      value: formatNumber(callsAccepted),
      fullValue: callsAccepted.toLocaleString(),
      label: 'Calls Accepted',
      conversionRate: `${formatPercentage(showRate)} Show`,
      borderColor: STAGE_COLORS[3],
    },
    {
      key: 'closes',
      value: formatNumber(totalCloses),
      fullValue: totalCloses.toLocaleString(),
      label: 'Total Closes',
      conversionRate: `${formatPercentage(closeRate)} Close`,
      borderColor: STAGE_COLORS[4],
    },
  ];

  const calculateSummaryStats = () => {
    const overallConversion = youtubeViews > 0 ? (totalCloses / youtubeViews) * 100 : 0;
    const viewsPerClose = totalCloses > 0 ? Math.round(youtubeViews / totalCloses) : 0;
    const avgDealSize = totalCloses > 0 ? Math.round(150000 / totalCloses) : 0;
    
    return { overallConversion, viewsPerClose, avgDealSize };
  };

  const { overallConversion, viewsPerClose, avgDealSize } = calculateSummaryStats();

  return (
    <div className="w-full bg-white/95 backdrop-blur-lg border border-white/40 dark:bg-zinc-700/30 dark:border-zinc-700/50 shadow-lg rounded-2xl p-6 mt-6 ">
      <FunnelHeader />
      <DesktopFunnelView stages={stages} />
      <MobileFunnelView stages={stages} />
      <SummaryStats 
        overallConversion={overallConversion}
        viewsPerClose={viewsPerClose}
        avgDealSize={avgDealSize}
      />
    </div>
  );
};

const FunnelHeader: React.FC = () => (
  <div className="flex items-start justify-start mb-8">
    <h3 className="text-lg font-semibold text-left text-zinc-700 dark:text-zinc-100">
      Complete Sales Funnel
    </h3>
  </div>
);

const DesktopFunnelView: React.FC<{ stages: FunnelStage[] }> = ({ stages }) => (
  <div className="hidden sm:flex justify-center items-center gap-4 lg:gap-6">
    {stages.map((stage, index) => (
      <React.Fragment key={stage.key}>
        <StageCard stage={stage} />
        {index < stages.length - 1 && <FunnelArrow />}
      </React.Fragment>
    ))}
  </div>
);

const MobileFunnelView: React.FC<{ stages: FunnelStage[] }> = ({ stages }) => (
  <div className="sm:hidden space-y-4">
    {stages.map((stage, index) => (
      <React.Fragment key={stage.key}>
        <MobileStageCard stage={stage} />
        {index < stages.length - 1 && <MobileArrow />}
      </React.Fragment>
    ))}
  </div>
);

const StageCard: React.FC<{ stage: FunnelStage }> = ({ stage }) => (
  <div 
    className="relative group flex-1 min-w-0 max-w-[180px] bg-white dark:bg-zinc-900/80 border-2 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
    style={{ borderColor: stage.borderColor }}
  >
    <div className="font-semibold text-xl lg:text-2xl text-zinc-600 dark:text-zinc-200 mb-3">
      {stage.value}
    </div>
    
    <div className="text-xs text-zinc-600 dark:text-zinc-300/80 font-normal mb-3">
      {stage.label}
    </div>
    
    <div className="inline-block px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
      {stage.conversionRate}
    </div>

    <Tooltip content={stage.fullValue} />
  </div>
);

const MobileStageCard: React.FC<{ stage: FunnelStage }> = ({ stage }) => (
  <div 
    className="bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 transition-all duration-300 active:scale-95"
    style={{ borderColor: stage.borderColor }}
  >
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-xl text-zinc-500">
            {stage.value}
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400 font-normal">
            {stage.label}
          </span>
        </div>
        
        <div className="inline-block px-2 py-1 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          {stage.conversionRate}
        </div>
      </div>
    </div>
  </div>
);

const FunnelArrow: React.FC = () => (
  <div className="flex items-center justify-center text-2xl lg:text-3xl text-zinc-400 dark:text-zinc-500 animate-pulse">
    →
  </div>
);

const MobileArrow: React.FC = () => (
  <div className="flex justify-center">
    <div className="text-2xl text-zinc-400 dark:text-zinc-500 animate-bounce">
      ↓
    </div>
  </div>
);

const Tooltip: React.FC<{ content: string }> = ({ content }) => (
  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
    <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-2 py-1 rounded whitespace-nowrap">
      {content}
    </div>
  </div>
);

const SummaryStats: React.FC<{
  overallConversion: number;
  viewsPerClose: number;
  avgDealSize: number;
}> = ({ overallConversion, viewsPerClose, avgDealSize }) => (
  <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      <SummaryStat 
        value={`${overallConversion.toFixed(1)}%`}
        label="Overall Conversion"
      />
      <SummaryStat 
        value={`${viewsPerClose}:1`}
        label="Views per Close"
      />
      <SummaryStat 
        value={`$${avgDealSize.toLocaleString()}`}
        label="Avg Deal Size"
      />
      <SummaryStat 
        value="$150,000"
        label="Total Revenue"
        isRevenue
      />
    </div>
  </div>
);

const SummaryStat: React.FC<{
  value: string;
  label: string;
  isRevenue?: boolean;
}> = ({ value, label, isRevenue = false }) => (
  <div>
    <div className={`text-lg ${isRevenue ? 'text-emerald-600 dark:text-emerald-400 dark:text-emerald-400 font-semibold' : 'text-zinc-700 font-semibold dark:text-zinc-200'}`}>
      {value}
    </div>
    <div className="text-xs text-zinc-700 dark:text-zinc-300/70  font-normal">
      {label}
    </div>
  </div>
);
