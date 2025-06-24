// ---
// Plain language: These types help us keep track of how many leads, calls, and revenue come from each country. We use them to show a table or map of where our customers are from. The countryBreakdown field will be filled with this info for each month.
// ---
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
  countryBreakdown?: CountryBreakdown[]; // Info about leads/calls/revenue by country for this month
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

export interface CountryBreakdown {
  country: string; // The country name, like 'United States'
  countryCode: string; // The country code, like 'US'
  leads: number; // How many leads from this country
  callsBooked: number; // How many calls were booked from this country
  callsAccepted: number; // How many calls were accepted from this country
  revenue: number; // How much money came from this country
  conversionRate: number; // What percent of leads turned into revenue
} 