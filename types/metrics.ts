// Core Metrics Model
export interface MonthlyMetrics {
  month: string;
  youtubeTotalViews: number;
  youtubeUniqueViews: number;
  uniqueWebsiteVisitors: number;
  totalCallsBooked: number;
  acceptedCalls: number;
  closes: {
    highTicket: number;
    discount: number;
  };
  newCashCollected: {
    paidInFull: number;
    installments: number;
    byProduct: {
      [key: string]: number;
    };
    total?: number;
  };
  totalCashCollected: number;
  changes?: MonthlyMetricChanges;
}

export interface MonthlyMetricChanges {
  youtubeTotalViews?: number | null;
  youtubeUniqueViews?: number | null;
  uniqueWebsiteVisitors?: number | null;
  totalCallsBooked?: number | null;
  acceptedCalls?: number | null;
  closes?: {
    highTicket?: number | null;
    discount?: number | null;
  };
  newCashCollected?: {
    total?: number | null;
    paidInFull?: number | null;
    installments?: number | null;
    byProduct?: {
      [key: string]: number | null;
    };
  };
}

export interface MonthlyMetricsWithChanges extends MonthlyMetrics {
  changes: MonthlyMetricChanges;
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