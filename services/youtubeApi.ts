// YouTubeApiService
//
// What this file does:
// - Handles logging into YouTube (OAuth 2.0).
// - Fetches data like videos, stats, and comments.
// - Automatically retries failed API calls up to 3 times if there's a temporary network or server issue.
// - Catches and logs errors for easier debugging.
//
// How it works (in simple steps):
// 1. Your app gets a special login URL from this service.
// 2. After login, YouTube sends back a code.
// 3. This service exchanges the code for a key (token).
// 4. The service uses this key to get data from YouTube.
// 5. If an API call fails, it automatically tries again.
// 6. If it still fails, it logs a detailed error.

import { google, youtube_v3 } from 'googleapis';
import { OAuth2Client, Credentials } from 'google-auth-library';
import axios, { AxiosInstance } from 'axios';
import retry from 'axios-retry';
import { YouTubeMappers } from '@/mappers/youtubeMappers';
import {
  YouTubeVideo,
  YouTubeChannelStatistics,
  YouTubePlaylist,
  YouTubeComment,
  YouTubeVideoStatistics,
} from '@/types/youtube';

// Types for authentication
interface YouTubeAuthConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

const YOUTUBE_API_COSTS = {
  SEARCH: 100,
  CHANNELS_LIST: 1,
  PLAYLISTS_LIST: 1,
  VIDEOS_LIST: 1,
  COMMENT_THREADS_LIST: 1,
  VIDEO_LIST: 1,
};

export class YouTubeApiService {
  private static instance: YouTubeApiService;
  private oauth2Client: OAuth2Client;
  private axiosInstance: AxiosInstance;
  private quotaUsage: number = 0;
  private lastQuotaCheck: Date = new Date();
  private youtube: youtube_v3.Youtube;
  private mappers: YouTubeMappers;

  private constructor(tokens: Credentials) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google API credentials are not defined in environment variables.');
    }

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    this.oauth2Client.setCredentials(tokens);

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client,
    });
    
    this.mappers = new YouTubeMappers();

    this.axiosInstance = axios.create();
    retry(this.axiosInstance, { retries: 3 });
  }

  public static getInstance(tokens: Credentials): YouTubeApiService {
    return new YouTubeApiService(tokens);
  }

  /**
   * Initialize the service with environment variables for generating auth URL
   */
  public static initialize(): YouTubeApiService {
    throw new Error("Method not implemented");
  }
  
  /**
   * Create a service instance from an incoming request, using tokens from cookies.
   */
  public static fromRequest(req: Request): YouTubeApiService {
    throw new Error("Method not implemented");
  }

  private resetQuotaIfNewDay() {
    const now = new Date();
    if (now.getDate() !== this.lastQuotaCheck.getDate()) {
      this.quotaUsage = 0;
      this.lastQuotaCheck = now;
      console.log('YouTube API quota reset.');
    }
  }

  private async checkQuota(cost: number): Promise<void> {
    this.resetQuotaIfNewDay();
    if (this.quotaUsage + cost > 10000) {
      throw new Error(`YouTube API quota exceeded. Used: ${this.quotaUsage}, Limit: 10000`);
    }
  }

  private incrementQuota(cost: number) {
    this.quotaUsage += cost;
  }

  /**
   * Get the OAuth2 authorization URL
   */
  public getAuthUrl(): string {
    throw new Error("Method not implemented");
  }

  /**
   * Exchange authorization code for tokens
   */
  public async exchangeCodeForTokens(code: string): Promise<Credentials> {
    throw new Error("Method not implemented");
  }

  /**
   * Get the authenticated user's channel ID
   */
  public async getOwnChannelId(): Promise<string> {
    try {
      const response = await this.youtube.channels.list({
        part: ['id'],
        mine: true,
      });
      const channelId = response.data.items?.[0]?.id;
      if (!channelId) {
        throw new Error('No channel found for the authenticated user.');
      }
      return channelId;
    } catch (error) {
      console.error("Error fetching channel ID:", error);
      throw error;
    }
  }

  /**
   * Get channel statistics
   */
  public async getChannelStatistics(): Promise<YouTubeChannelStatistics> {
    const cost = YOUTUBE_API_COSTS.CHANNELS_LIST;
    if (!this.canMakeRequest(cost)) {
      throw new Error("YouTube API quota exceeded.");
    }
    this.incrementQuota(cost);

    try {
      const response = await this.youtube.channels.list({
        part: ['snippet', 'statistics'],
        mine: true,
      });
      const channel = response.data.items?.[0];
      if (!channel) {
        throw new Error('No channel found for the authenticated user.');
      }
      return channel.statistics as unknown as YouTubeChannelStatistics;
    } catch (error) {
      console.error("Error fetching channel statistics:", error);
      throw error;
    }
  }

  /**
   * Get channel videos
   */
  public async getChannelVideos(channelId: string): Promise<{ videos: YouTubeVideo[] }> {
    const response = await this.youtube.search.list({
      part: ['snippet'],
      channelId: channelId,
      maxResults: 50,
      order: 'date',
      type: ['video'],
    });

    const videos = response.data.items?.map((item: youtube_v3.Schema$SearchResult) => this.mappers.mapToYouTubeVideo(item)) ?? [];
    return { videos };
  }
  
  /**
   * Get channel videos with their statistics
   */
  public async getVideosWithStats(channelId: string): Promise<YouTubeVideo[]> {
    const { videos } = await this.getChannelVideos(channelId);
    if (videos.length === 0) {
      return [];
    }

    const videoIds = videos.map(v => v.videoId);
    const stats = await this.getVideoStatistics(videoIds);

    return videos.map(video => ({
      ...video,
      stats: stats[video.videoId],
    }));
  }

  /**
   * Get channel playlists
   */
  public async getChannelPlaylists(
    channelId: string,
    maxResults: number = 25,
    pageToken?: string
  ): Promise<{ playlists: YouTubePlaylist[]; nextPageToken?: string }> {
    const cost = YOUTUBE_API_COSTS.PLAYLISTS_LIST;
    await this.checkQuota(cost);

    try {
      const params: any = {
        part: 'snippet,contentDetails',
        channelId,
        maxResults,
      };
      if (pageToken) params.pageToken = pageToken;

      const response = await this.axiosInstance.get('/playlists', { params });

      const playlists: YouTubePlaylist[] = response.data.items.map((item: youtube_v3.Schema$Playlist) => this.mappers.mapToYouTubePlaylist(item));

      this.incrementQuota(cost);
      return {
        playlists,
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error) {
      console.error(`Error fetching playlists for channel ID ${channelId}:`, error);
      throw new Error('Failed to fetch channel playlists.');
    }
  }

  /**
   * Get comments for a specific video
   */
  public async getVideoComments(
    videoId: string,
    maxResults: number = 25,
    pageToken?: string
  ): Promise<{ comments: YouTubeComment[]; nextPageToken?: string }> {
    const cost = YOUTUBE_API_COSTS.COMMENT_THREADS_LIST;
    await this.checkQuota(cost);

    try {
      const params: any = {
        part: 'snippet',
        videoId,
        maxResults,
      };
      if (pageToken) params.pageToken = pageToken;
      
      const response = await this.axiosInstance.get('/commentThreads', { params });

      const comments: YouTubeComment[] = response.data.items.map((item: youtube_v3.Schema$CommentThread) => this.mappers.mapToYouTubeComment(item));

      this.incrementQuota(cost);
      return {
        comments,
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error) {
      console.error(`Error fetching comments for video ID ${videoId}:`, error);
      throw new Error('Failed to fetch video comments.');
    }
  }

  /**
   * Get video statistics
   */
  public async getVideoStatistics(videoIds: string[]): Promise<Record<string, YouTubeVideoStatistics>> {
    const response = await this.youtube.videos.list({
      part: ['statistics'],
      id: videoIds,
    });
    
    const stats: Record<string, YouTubeVideoStatistics> = {};
    response.data.items?.forEach((item: youtube_v3.Schema$Video) => {
      if (item.id) {
        stats[item.id] = this.mappers.mapToYouTubeVideoStatistics(item);
      }
    });

    return stats;
  }

  private canMakeRequest(cost: number): boolean {
    this.resetQuotaIfNewDay();
    return this.quotaUsage + cost <= 10000;
  }
} 