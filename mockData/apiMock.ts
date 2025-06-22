// apiMock
//
// What this file does:
// - Pretends to be an API for your dashboard while you build and test
// - Gives back fake data for metrics, video performance, and funnel info
// - Lets you build the dashboard before you connect to real APIs
//
// Note: This is only for development/testing. It does NOT use real data.

import { generateMockMonthlyMetrics } from './generateMockMonthlyMetrics';
import { generateMockVideoPerformance } from './generateMockVideoPerformance';
import { generateMockFunnelData } from './generateMockFunnelData';
import { MonthlyMetrics, VideoPerformance, FunnelStage } from '../types/metrics';
import { generateMockVideoAnalytics } from './generateMockVideoAnalytics';
import { VideoAnalyticsData } from '@/types/youtube';

/**
 * Simulates API endpoints for dashboard development.
 * Returns mock data for monthly metrics, video performance, and funnel data.
 * Includes simulated latency and error handling for realistic testing.
 */
export const apiMock = {
  /**
   * Simulate fetching monthly metrics data from an API.
   */
  async getMonthlyMetrics(): Promise<MonthlyMetrics[]> {
    await simulateLatency();
    return generateMockMonthlyMetrics();
  },

  /**
   * Simulate fetching video performance data from an API.
   */
  async getVideoPerformance(): Promise<VideoPerformance[]> {
    await simulateLatency();
    return generateMockVideoPerformance();
  },

  /**
   * Simulate fetching funnel data from an API.
   */
  async getFunnelData(): Promise<FunnelStage[][]> {
    await simulateLatency();
    return generateMockFunnelData();
  },

  /**
   * Simulate fetching video analytics data from an API.
   */
  async getVideoAnalytics(): Promise<VideoAnalyticsData[]> {
    await simulateLatency();
    return generateMockVideoAnalytics();
  },

  /**
   * Simulate an API error for testing error handling in the UI.
   */
  async getWithError(): Promise<never> {
    await simulateLatency();
    throw new Error('Simulated API error');
  }
};

/**
 * Simulates network latency for API calls (100-400ms delay).
 */
async function simulateLatency() {
  const delay = Math.random() * 300 + 100;
  return new Promise((resolve) => setTimeout(resolve, delay));
} 