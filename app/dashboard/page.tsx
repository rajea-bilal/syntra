// Dashboard Page
//
// This is now at /dashboard

"use client";
import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/metrics/MetricCard";
import { MonthlyMetricsTable } from "@/components/metrics/MonthlyMetricsTable";
import { FunnelChart } from "@/components/metrics/FunnelChart";
import { VideoAnalyticsTable } from '@/components/youtube/VideoAnalyticsTable';
import { CombinedVideoData, YouTubeVideo, VideoPerformance } from '@/types/youtube';
import { generateMockVideoPerformance } from "@/mockData/generateMockVideoPerformance";
import { SingleMetricBarChart } from "@/components/metrics/SingleMetricBarChart";
import { apiMock } from "@/mockData/apiMock";
import { useQuery } from "@tanstack/react-query";
import { generateMockAttribution } from "@/mockData/generateMockAttribution";
import { RevenuePieChart } from "@/components/metrics/RevenuePieChart";
import { Card } from '@/components/ui/Card';

const combineWithMockPerformance = (videos: YouTubeVideo[]): CombinedVideoData[] => {
  const attributionData = generateMockAttribution(videos);
  const attributionMap = new Map(attributionData.map(attr => [attr.videoId, attr]));

  return videos.map(video => {
    const mockPerformance: VideoPerformance = generateMockVideoPerformance(video.videoId);
    const attribution = attributionMap.get(video.videoId);

    return {
      ...video,
      performance: mockPerformance,
      callsBooked: attribution?.callsBooked,
      revenue: attribution?.revenue,
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
    queryFn: () => apiMock.getMonthlyMetrics(),
  });

  const combinedData = useMemo(() => {
    if (!videoAnalytics) return [];
    return combineWithMockPerformance(videoAnalytics);
  }, [videoAnalytics]);
  
  const totalYoutubeViews = useMemo(() => {
    if (!videoAnalytics) return 0;
    return videoAnalytics.reduce((acc, video) => acc + parseInt(video.stats?.viewCount || '0', 10), 0);
  }, [videoAnalytics]);

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
        {/* Key Metrics Cards */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          <MetricCard
            title="YouTube Views"
            value={totalYoutubeViews}
            previousValue={prevMetrics?.youtubeTotalViews || 0}
            format="number"
            caption="YouTube views this month"
          />
          <MetricCard
            title="Calls Booked"
            value={latestMetrics?.totalCallsBooked || 0}
            previousValue={prevMetrics?.totalCallsBooked || 0}
            format="number"
            caption="Calls booked this month"
          />
          <MetricCard
            title="Monthly Recurring Revenue"
            value={latestMetrics?.totalCashCollected || 0}
            previousValue={prevMetrics?.totalCashCollected || 0}
            format="currency"
            caption="Total cash collected"
          />
          <MetricCard
            title="Unique Website Visitors"
            value={latestMetrics?.uniqueWebsiteVisitors || 0}
            previousValue={prevMetrics?.uniqueWebsiteVisitors || 0}
            format="number"
            caption="Unique visitors this month"
          />
        </div>

        {/* Funnel Chart */}
        <div className="mt-6 sm:mt-8">
          <div className="w-full overflow-hidden">
            <FunnelChart />
          </div>
        </div>

        {/* Video Performance Section */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 px-1">
            Video Performance
          </h2>
          <div className="w-full overflow-auto">
            <div className="min-w-[600px] sm:min-w-0">
              <VideoAnalyticsTable data={combinedData} isLoading={isYoutubeLoading} />
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        {metrics && (
          <>
            {/* Bar Charts Grid */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="w-full min-h-[300px]">
                <SingleMetricBarChart
                  data={metrics}
                  metricKey="youtubeTotalViews"
                  title="YouTube Views"
                />
              </div>
              <div className="w-full min-h-[300px]">
                <SingleMetricBarChart
                  data={metrics}
                  metricKey="uniqueWebsiteVisitors"
                  title="Unique Website Visitors"
                />
              </div>
              <div className="w-full min-h-[300px]">
                <SingleMetricBarChart
                  data={metrics}
                  metricKey="totalCallsBooked"
                  title="Calls Booked"
                />
              </div>
              <div className="w-full min-h-[300px]">
                <SingleMetricBarChart
                  data={metrics}
                  metricKey="totalCashCollected"
                  title="Cash Collected"
                  yLabel="USD"
                />
              </div>
              <div className="w-full min-h-[300px]">
                <Card className="p-4 md:p-6 w-full max-w-lg lg:mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
                  <RevenuePieChart data={metrics} />
                </Card>
              </div>
            </div>

            {/* Monthly Metrics Table */}
            <div className="mt-6 sm:mt-8 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 px-1">
                Monthly Metrics
              </h2>
              <div className="w-full overflow-auto">
                <div className="min-w-[800px] sm:min-w-0">
                  <MonthlyMetricsTable data={metrics} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}