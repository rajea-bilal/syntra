// Dashboard Page
"use client";
   import React from 'react';
import { TopVideoCard } from "@/components/youtube/TopVideoCard";
import { formatValue } from "@/lib/utils";
import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/metrics/MetricCard";
import { MonthlyMetricsTable } from "@/components/metrics/MonthlyMetricsTable";
import { VideoAnalyticsTable } from '@/components/youtube/VideoAnalyticsTable';
import { CombinedVideoData, YouTubeVideo, VideoPerformance } from '@/types/youtube';
import { generateMockVideoPerformance } from "@/mockData/generateMockVideoPerformance";
import { useQuery } from "@tanstack/react-query";
import { generateMockAttribution } from "@/mockData/generateMockAttribution";
import { Card } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateMetricsWithChanges } from "@/lib/utils";
import { Youtube, Phone, DollarSign, Users, TrendingUp, Target, BadgePercent } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CountryBreakdownTable } from '@/components/metrics/CountryBreakdownTable';
import { SalesFunnelSummary } from '@/components/metrics/SalesFunnelSummary';
import { TopVideosTable } from '@/components/youtube/TopVideosTable';
import NotAuthenticated from '@/components/layout/NotAuthenticated';

const MonthlyLineChart = dynamic(
  () => import('@/components/metrics/MonthlyLineChart').then((mod) => mod.MonthlyLineChart),
  { ssr: false, loading: () => <p>Loading chart...</p> }
);

const MonthlyBarChart = dynamic(
  () => import('@/components/metrics/MonthlyBarChart').then((mod) => mod.MonthlyBarChart),
  { ssr: false, loading: () => <p>Loading chart...</p> }
);

const FunnelChart = dynamic(
  () => import('@/components/metrics/FunnelChart').then((mod) => mod.FunnelChart),
  { ssr: false, loading: () => <p>Loading funnel...</p> }
);

const RevenuePieChart = dynamic(
  () => import('@/components/metrics/RevenuePieChart').then((mod) => mod.RevenuePieChart),
  { ssr: false, loading: () => <p>Loading chart...</p> }
);

const combineWithMockPerformance = (videos: YouTubeVideo[]): CombinedVideoData[] => {
  const attributionData = generateMockAttribution(videos);
  const attributionMap = new Map(attributionData.map(attr => [attr.videoId, attr]));

  return videos.map(video => {
    const mockPerformance: VideoPerformance = generateMockVideoPerformance(video);
    const attribution = attributionMap.get(video.videoId);
    const viewCount = parseInt(video.stats?.viewCount || '0', 10);
    const revenue = attribution?.revenue || 0;
    const closedDeals = attribution?.closedDeals || 0;

    return {
      ...video,
      performance: mockPerformance,
      leadsGenerated: attribution?.leadsGenerated,
      callsBooked: attribution?.callsBooked,
      callsAccepted: attribution?.callsAccepted,
      closedDeals: closedDeals,
      revenue: revenue,
      revenuePerView: viewCount > 0 ? revenue / viewCount : 0,
      viewToCloseRate: viewCount > 0 ? (closedDeals / viewCount) * 100 : 0,
    };
  });
};

export default function Dashboard() {
  // TODO: Replace with real authentication logic
  const isAuthenticated = true; // <--- Set to false to test unauthenticated UI

  // Always call hooks at the top level
  const { 
    data: videoAnalytics, 
    isLoading: isYoutubeLoading, 
    error: youtubeError 
  } = useQuery<YouTubeVideo[]>({
    queryKey: ['youtubeAnalytics'],
    queryFn: async () => {
      const response = await fetch('/api/youtube/analytics');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || 'Network response was not ok');
      }
      return response.json();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 25 * 60 * 60 * 1000, // 25 hours
    enabled: isAuthenticated,
  });

  const { 
    data: metrics, 
    isLoading: isMetricsLoading, 
    error: metricsError 
  } = useQuery({
    queryKey: ['monthlyMetrics'],
    queryFn: async () => {
      const [calRes, kajabiRes] = await Promise.all([
        fetch('/api/mock/cal/monthly-calls'),
        fetch('/api/mock/kajabi/monthly-revenue')
      ]);

      if (!calRes.ok || !kajabiRes.ok) {
        throw new Error('Failed to fetch mock metrics data');
      }

      const calData = await calRes.json();
      const kajabiData = await kajabiRes.json();

      type CalMonth = {
        month: string;
        youtube_views: number;
        youtube_unique_views: number;
        unique_visitors: number;
        calls_booked: number;
        calls_accepted: number;
      };

      const combinedMetrics = calData.map((calMonth: CalMonth, index: number) => {
        const kajabiMonth = kajabiData[index];
        return {
          month: calMonth.month,
          youtubeTotalViews: calMonth.youtube_views,
          youtubeUniqueViews: calMonth.youtube_unique_views,
          uniqueWebsiteVisitors: calMonth.unique_visitors,
          totalCallsBooked: calMonth.calls_booked,
          acceptedCalls: calMonth.calls_accepted,
          closes: {
            highTicket: kajabiMonth.closes.high_ticket,
            discount: kajabiMonth.closes.discount,
          },
          totalCashCollected: kajabiMonth.total_cash_collected,
          newCashCollected: {
            paidInFull: kajabiMonth.new_cash_collected.pif,
            installments: kajabiMonth.new_cash_collected.installments,
            byProduct: kajabiMonth.new_cash_collected.by_product,
          },
        };
      });

      return combinedMetrics;
    },
    enabled: isAuthenticated,
  });

  const combinedData = useMemo(() => {
    if (!videoAnalytics) return [];
    return combineWithMockPerformance(videoAnalytics);
  }, [videoAnalytics]);
  
  const totalYoutubeViews = useMemo(() => {
    if (!videoAnalytics) return 0;
    return videoAnalytics.reduce((acc, video) => acc + parseInt(video.stats?.viewCount || '0', 10), 0);
  }, [videoAnalytics]);

  const metricsWithChanges = useMemo(() => {
    return calculateMetricsWithChanges(metrics || []);
  }, [metrics]);

  const topPerformer = useMemo(() => {
    if (!combinedData || combinedData.length === 0) return null;
    return [...combinedData].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))[0];
  }, [combinedData]);

  const isLoading = isYoutubeLoading || isMetricsLoading;
  const error = youtubeError || metricsError;

  // Only now, after all hooks, do conditional returns
  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh] sm:h-[70vh] lg:h-[80vh] text-base sm:text-lg text-zinc-400 px-4">
          Loading Dashboard Data...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh] sm:h-[70vh] lg:h-[80vh] text-base sm:text-lg text-red-500 px-4 text-center">
          Error loading data. Please try again later.
        </div>
      </DashboardLayout>
    );
  }

  const latestMetrics = metrics?.[metrics.length - 1];
  const prevMetrics = metrics?.[metrics.length - 2] || latestMetrics;

  return (
    <DashboardLayout>
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 flex flex-col gap-2">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 shadow shadow-black/10 dark:shadow-black/30">
            <TabsTrigger className="text-zinc-500 dark:text-zinc-400" value="overview">Overview</TabsTrigger>
            <TabsTrigger className="text-zinc-500 dark:text-zinc-400" value="video">Video Performance</TabsTrigger>
            <TabsTrigger  className="text-zinc-500 dark:text-zinc-400" value="monthly">Monthly Trends</TabsTrigger>
            <TabsTrigger className="text-zinc-500 dark:text-zinc-400" value="revenue">Revenue Deep Dive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {/* ---
              Two rows of metric cards, each with three cards, all the same size (no spanning), matching the reference image layout.
            --- */}
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <MetricCard
                title="Monthly Recurring Revenue"
                value={latestMetrics?.totalCashCollected || 0}
                previousValue={prevMetrics?.totalCashCollected || 0}
                format="currency"
                caption="Total cash collected"
                variant="teal"
                Icon={DollarSign}
              />
              <MetricCard
                title="High-Ticket Closes"
                value={latestMetrics?.closes?.highTicket || 0}
                previousValue={prevMetrics?.closes?.highTicket || 0}
                format="number"
                caption="High-ticket closes this month"
                variant="violet"
                Icon={Target}
              />
              <MetricCard
                title="Calls Booked"
                value={latestMetrics?.totalCallsBooked || 0}
                previousValue={prevMetrics?.totalCallsBooked || 0}
                format="number"
                caption="Calls booked this month"
                variant="violet"
                Icon={Phone}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <MetricCard
                title="YouTube Views"
                value={totalYoutubeViews}
                previousValue={prevMetrics?.youtubeTotalViews || 0}
                format="number"
                caption="YouTube views this month"
                variant="sky"
                Icon={Youtube}
              />
              <MetricCard
                title="Unique Website Visitors"
                value={latestMetrics?.uniqueWebsiteVisitors || 0}
                previousValue={prevMetrics?.uniqueWebsiteVisitors || 0}
                format="number"
                caption="Unique visitors this month"
                variant="amber"
                Icon={Users}
              />
              <MetricCard
                title="Show-up Rate"
                value={
                  latestMetrics?.totalCallsBooked && latestMetrics?.acceptedCalls
                    ? (latestMetrics.acceptedCalls / latestMetrics.totalCallsBooked) * 100
                    : 0
                }
                previousValue={
                  prevMetrics?.totalCallsBooked && prevMetrics?.acceptedCalls
                    ? (prevMetrics.acceptedCalls / prevMetrics.totalCallsBooked) * 100
                    : 0
                }
                format="percentage"
                caption="Call show-up rate this month"
                variant="sky"
                Icon={TrendingUp}
              />
              <MetricCard
                title="Discount Closes"
                value={latestMetrics?.closes?.discount || 0}
                previousValue={prevMetrics?.closes?.discount || 0}
                format="number"
                caption="Discount closes this month"
                variant="teal"
                Icon={BadgePercent}
              />
            </div>
            {/* --- End of metric cards layout --- */}
            {/* ---
              Funnel summary row, each card shows a funnel stage and a calculated conversion rate label.
              Now includes a title and arrows between cards.
            --- */}
            <SalesFunnelSummary
              youtubeViews={totalYoutubeViews}
              websiteVisits={latestMetrics?.uniqueWebsiteVisitors || 0}
              callsBooked={latestMetrics?.totalCallsBooked || 0}
              callsAccepted={latestMetrics?.acceptedCalls || 0}
              totalCloses={(latestMetrics?.closes?.highTicket || 0) + (latestMetrics?.closes?.discount || 0)}
            />
           
          </TabsContent>

          <TabsContent value="video">
             <VideoAnalyticsTable data={combinedData} isLoading={isYoutubeLoading} />
          </TabsContent>

          <TabsContent value="monthly">
            <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
              <MonthlyLineChart
                title="Revenue Over Time ($)"
                data={metrics || []}
                metricKey="totalCashCollected"
              />
              <MonthlyLineChart
                title="Calls Booked Over Time"
                data={metrics || []}
                metricKey="totalCallsBooked"
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:mt-6 lg:gap-6">
              <Card className="bg-white/60 backdrop-blur-lg border border-white/30 dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl p-4">
                 <h3 className="text-lg font-semibold mb-2">Funnel Conversion Rate (%)</h3>
                 <FunnelChart totalViews={totalYoutubeViews} />

                 <h3 className="text-lg font-semibold mb-2 mt-4">Monthly Metrics</h3>
                 <MonthlyBarChart data={metrics || []} />
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="revenue">
             {metrics && (
                <div className="mt-6 sm:mt-8 grid grid-cols-1">
                    <div className="w-full min-h-[300px]">
                        <Card className="p-4 md:p-6 w-full max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
                        <RevenuePieChart data={metrics} />
                        </Card>
                    </div>
                </div>
             )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 sm:mt-8">
           <TopVideosTable videos={[...combinedData].sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 5)} />
        </div>

     

        {/* ---
          This is where we show the country breakdown table.
          The table is now left-aligned with the rest of the dashboard content.
        --- */}
        
        <CountryBreakdownTable />
       
      </div>
    </DashboardLayout>
  );
}