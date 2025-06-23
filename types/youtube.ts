// dashboard/types/youtube.ts

// What this file does:
// - Defines the shape of data related to the YouTube API.
// - Provides consistent TypeScript types for videos, stats, playlists, etc.
// - Centralizes type definitions to be used across services, components, and mock data generators.

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  stats?: YouTubeVideoStatistics;
  performance?: VideoPerformance;
}

export interface YouTubeChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  videoCount: string;
}

export interface YouTubePlaylist {
  playlistId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
}

export interface YouTubeComment {
  commentId: string;
  author: string;
  text: string;
  publishedAt: string;
  likeCount: number;
}

export interface YouTubeVideoStatistics {
  videoId: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  subscribersGained: number;
}

export interface VideoPerformance {
  revenue: number;
  leadsGenerated: number;
}

/**
 * @deprecated Use CombinedVideoData instead.
 */
export type VideoAnalyticsData = YouTubeVideo & { stats?: YouTubeVideoStatistics };

/**
 * A unified data structure that combines:
 * - Core video information from the YouTube API (`YouTubeVideo`)
 * - Video statistics from the YouTube API (`YouTubeVideoStatistics`)
 * - Simulated performance/sales metrics (`VideoPerformance`)
 */
export interface CombinedVideoData extends YouTubeVideo {
  stats?: YouTubeVideoStatistics;
  performance?: VideoPerformance;
  leadsGenerated?: number;
  callsBooked?: number;
  callsAccepted?: number;
  closedDeals?: number;
  revenue?: number;
  revenuePerView?: number;
  viewToCloseRate?: number;
} 