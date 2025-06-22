import { YouTubeVideo } from '@/types/youtube';

export interface VideoAttribution {
  videoId: string;
  callsBooked: number;
  revenue: {
    total: number;
    paidInFull: number;
    installments: number;
  };
}

/**
 * Generates mock attribution data (calls, revenue) for a list of videos.
 * The "better" a video performs on YouTube (views, likes), the higher the
 * chance of it getting better business metrics.
 */
export const generateMockAttribution = (videos: YouTubeVideo[]): VideoAttribution[] => {
  if (!videos) return [];

  return videos.map(video => {
    const viewCount = parseInt(video.stats?.viewCount || '0', 10);
    const likeCount = parseInt(video.stats?.likeCount || '0', 10);

    // Base conversion rate
    let callBookingRate = 0.0005; // 0.05% of viewers book a call

    // Boost rate for high-performing videos
    if (viewCount > 50000) {
      callBookingRate *= 1.5;
    }
    if (likeCount > 1000) {
      callBookingRate *= 1.2;
    }
    if (video.title.toLowerCase().includes('case study')) {
      callBookingRate *= 2; // Case studies convert well
    }

    const callsBooked = Math.floor(viewCount * callBookingRate);

    // Assume a 20% close rate on calls, at a $5000 price point
    const closeRate = 0.2;
    const closedDeals = callsBooked * closeRate;

    // Assume 70% pay in full
    const pifDeals = Math.floor(closedDeals * 0.7);
    const installmentDeals = closedDeals - pifDeals;

    const revenueFromPif = pifDeals * 5000;
    // Assume first installment is $1000 for installment plans
    const revenueFromInstallments = installmentDeals * 1000;

    return {
      videoId: video.videoId,
      callsBooked,
      revenue: {
        total: revenueFromPif + revenueFromInstallments,
        paidInFull: revenueFromPif,
        installments: revenueFromInstallments,
      },
    };
  });
}; 