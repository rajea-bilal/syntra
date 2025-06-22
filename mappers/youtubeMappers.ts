import { YouTubeVideo, YouTubePlaylist, YouTubeComment, YouTubeVideoStatistics, YouTubeChannelStatistics } from '@/types/youtube';
import { youtube_v3 } from 'googleapis';

export class YouTubeMappers {
  public mapToYouTubeVideo(item: youtube_v3.Schema$SearchResult): YouTubeVideo {
    return {
      videoId: item.id!.videoId!,
      title: item.snippet!.title!,
      publishedAt: item.snippet!.publishedAt!,
      thumbnailUrl: item.snippet!.thumbnails!.medium!.url!,
      description: item.snippet!.description!,
    };
  }

  public mapToYouTubeVideoStatistics(item: youtube_v3.Schema$Video): YouTubeVideoStatistics {
    return {
      videoId: item.id!,
      viewCount: item.statistics!.viewCount!,
      likeCount: item.statistics!.likeCount!,
      commentCount: item.statistics!.commentCount!,
      subscribersGained: 0, // This is a simplification
    };
  }

  public mapToYouTubePlaylist(item: youtube_v3.Schema$Playlist): YouTubePlaylist {
    return {
      playlistId: item.id!,
      title: item.snippet!.title!,
      description: item.snippet!.description!,
      thumbnailUrl: item.snippet!.thumbnails!.medium!.url!,
      videoCount: item.contentDetails!.itemCount!,
    };
  }

  public mapToYouTubeComment(item: youtube_v3.Schema$CommentThread): YouTubeComment {
    const comment = item.snippet!.topLevelComment!;
    return {
      commentId: comment.id!,
      author: comment.snippet!.authorDisplayName!,
      text: comment.snippet!.textDisplay!,
      publishedAt: comment.snippet!.publishedAt!,
      likeCount: comment.snippet!.likeCount!,
    };
  }

  public mapToYouTubeChannelStatistics(item: youtube_v3.Schema$Channel): YouTubeChannelStatistics {
    return {
      channelId: item.id!,
      title: item.snippet!.title!,
      description: item.snippet!.description!,
      thumbnailUrl: item.snippet!.thumbnails!.default!.url!,
      subscriberCount: item.statistics!.subscriberCount!,
      videoCount: item.statistics!.videoCount!,
      viewCount: item.statistics!.viewCount!,
    };
  }
} 