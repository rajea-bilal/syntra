// Core Metrics Model
export interface MonthlyMetrics {
  month: string;
  youtubeTotalViews: number;
  youtubeUniqueViews: number;
  uniqueWebsiteVisitors: number;
  totalCallsBooked: number;
  acceptedCalls: number;
  newCashCollected: {
    paidInFull: number;
    installments: number;
  };
  totalCashCollected: number;
}

// Video Attribution Model
export interface VideoPerformance {
  videoId: string;
  title: string;
  views: number;
  leadsGenerated: number;
  callsBooked: number;
  callsAccepted: number;
  revenue: number;
  conversionRate: number;
  revenuePerView: number;
}

// Funnel Stage Model
export interface FunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
  dropoffRate: number;
}

// Utility Types
export type SortOrder = 'asc' | 'desc';

export type Filter<T> = {
  [K in keyof T]?: T[K] | ((value: T[K]) => boolean);
}; 