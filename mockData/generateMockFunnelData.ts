import { FunnelStage } from '../types/metrics';

/**
 * Generates mock funnel data for a given number of months.
 * Simulates user progression through funnel stages (e.g., View, Visit, Book Call, Accept Call, Close).
 * Each stage has a count, conversion rate, and dropoff rate.
 * @param months Number of months to generate data for
 */
export function generateMockFunnelData(months = 12): FunnelStage[][] {
  // Define the funnel stages in order
  const stages = ['View', 'Visit', 'Book Call', 'Accept Call', 'Close'];

  // Helper to generate a random float between min and max
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  return Array.from({ length: months }).map(() => {
    // Start with a large number of views
    let count = Math.floor(rand(10000, 30000));
    const funnel: FunnelStage[] = [];

    stages.forEach((stage, i) => {
      // Conversion rate drops at each stage
      const conversionRate = i === 0 ? 1 : rand(0.1, 0.7 - i * 0.1);
      const nextCount = i === 0 ? count : Math.floor(count * conversionRate);
      const dropoffRate = i === 0 ? 0 : 1 - conversionRate;

      funnel.push({
        stage,
        count: nextCount,
        conversionRate: i === 0 ? 1 : conversionRate,
        dropoffRate: i === 0 ? 0 : dropoffRate,
      });
      count = nextCount;
    });
    return funnel;
  });
} 