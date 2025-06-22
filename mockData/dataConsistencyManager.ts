import { MonthlyMetrics, VideoPerformance, FunnelStage } from '../types/metrics';

/**
 * Ensures consistency and realistic relationships between different mock data types.
 * For example, it can adjust monthly metrics so that video stats and funnel data add up correctly.
 */
export class DataConsistencyManager {
  monthlyMetrics: MonthlyMetrics[];
  videoPerformance: VideoPerformance[];
  funnelData: FunnelStage[][];

  constructor(
    monthlyMetrics: MonthlyMetrics[],
    videoPerformance: VideoPerformance[],
    funnelData: FunnelStage[][]
  ) {
    this.monthlyMetrics = monthlyMetrics;
    this.videoPerformance = videoPerformance;
    this.funnelData = funnelData;
  }

  /**
   * Adjusts monthly metrics so that the sum of video views matches the total YouTube views for each month.
   * Also ensures that funnel data is consistent with monthly metrics.
   */
  enforceConsistency() {
    // For each month, adjust the total YouTube views to match the sum of video views
    this.monthlyMetrics.forEach((month, i) => {
      // For simplicity, distribute video views evenly across months
      const videosPerMonth = this.videoPerformance.length / this.monthlyMetrics.length;
      const startIdx = Math.floor(i * videosPerMonth);
      const endIdx = Math.floor((i + 1) * videosPerMonth);
      const videos = this.videoPerformance.slice(startIdx, endIdx);
      const sumViews = videos.reduce((sum, v) => sum + v.views, 0);
      month.youtubeTotalViews = sumViews;
      month.youtubeUniqueViews = Math.floor(sumViews * 0.8);
    });

    // Optionally, adjust funnel data to match monthly metrics
    this.funnelData.forEach((funnel, i) => {
      if (this.monthlyMetrics[i]) {
        funnel[0].count = this.monthlyMetrics[i].youtubeTotalViews;
      }
    });
  }
} 