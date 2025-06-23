// Dashboard Page
"use client";
import { TopVideoCard } from "@/components/youtube/TopVideoCard";
import { formatValue } from "@/lib/utils";
import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/metrics/MetricCard";
import { MonthlyMetricsTable } from "@/components/metrics/MonthlyMetricsTable";
import { VideoAnalyticsTable } from '@/components/youtube/VideoAnalyticsTable';
import { CombinedVideoData, YouTubeVideo, VideoPerformance } from '@/types/youtube';
import { generateMockVideoPerformance } from "@/mockData/generateMockVideoPerformance";
import { SingleMetricBarChart } from "@/components/metrics/SingleMetricBarChart";
import { useQuery } from "@tanstack/react-query";
import { generateMockAttribution } from "@/mockData/generateMockAttribution";
import { Card } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateMetricsWithChanges } from "@/lib/utils";
import { Youtube, Phone, DollarSign, Users, TrendingUp, Target, BadgePercent } from 'lucide-react';
import dynamic from 'next/dynamic';

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
    const mockPerformance: VideoPerformance = generateMockVideoPerformance(video.videoId);
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
  const { 
    data: videoAnalytics, 
    isLoading: isYoutubeLoading, 
    error: youtubeError 
  } = useQuery<YouTubeVideo[]>({
    queryKey: ['youtubeAnalytics'],
    queryFn: async () => {
      const response = await fetch('/api/youtube/analytics');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
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

         const combinedMetrics = calData.map((calMonth: any, index: number) => {
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
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="video">Video Performance</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Deep Dive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
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
                title="Calls Booked"
                value={latestMetrics?.totalCallsBooked || 0}
                previousValue={prevMetrics?.totalCallsBooked || 0}
                format="number"
                caption="Calls booked this month"
                variant="violet"
                Icon={Phone}
              />
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
                title="High-Ticket Closes"
                value={latestMetrics?.closes?.highTicket || 0}
                previousValue={prevMetrics?.closes?.highTicket || 0}
                format="number"
                caption="High-ticket closes this month"
                variant="violet"
                Icon={Target}
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

            <div className="mt-6 sm:mt-8">
              <div className="w-full">
                <FunnelChart totalViews={totalYoutubeViews} />
              </div>
            </div>

               <div className="mt-6 sm:mt-8">
      <TopVideoCard 
        video={topPerformer}
        metricLabel="Total Revenue"
        metricValue={formatValue(topPerformer?.revenue || 0, 'currency')}
      />
    </div>
          </TabsContent>

          <TabsContent value="video">
            <VideoAnalyticsTable data={combinedData} isLoading={isYoutubeLoading} />
          </TabsContent>

          <TabsContent value="monthly">
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

              <Card>
                <h2 className="p-4 text-lg font-semibold">Funnel Conversion Rate (%)</h2>
                <MonthlyBarChart data={metrics} />
              </Card>

              <Card>
                <h2 className="p-4 text-lg font-semibold">Monthly Metrics Breakdown</h2>
                <MonthlyMetricsTable data={metricsWithChanges} />
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
      </div>
    </DashboardLayout>
  );
}