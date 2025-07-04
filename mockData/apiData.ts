// This file holds the mock data for our fake Cal.com and Kajabi APIs.

// Data simulating what we'd get from Cal.com
export const mockCalData = [
  {
    month: "2025-04",
    calls_booked: 35,
    calls_accepted: 30,
    calls_showed: 28,
    youtube_views: 18500,
    unique_visitors: 4200,
    video_breakdown: [
      { video_id: "abc123", booked: 10, accepted: 8, showed: 7 },
      { video_id: "def456", booked: 25, accepted: 22, showed: 21 },
    ],
  },
  {
    month: "2025-05",
    calls_booked: 45,
    calls_accepted: 38,
    calls_showed: 35,
    youtube_views: 22300,
    unique_visitors: 5100,
    video_breakdown: [
      { video_id: "abc123", booked: 15, accepted: 12, showed: 11 },
      { video_id: "def456", booked: 30, accepted: 26, showed: 24 },
    ],
  },
  {
    month: "2025-06",
    calls_booked: 55,
    calls_accepted: 48,
    calls_showed: 45,
    youtube_views: 25000,
    unique_visitors: 5800,
    video_breakdown: [
      { video_id: "abc123", booked: 20, accepted: 18, showed: 17 },
      { video_id: "def456", booked: 35, accepted: 30, showed: 28 },
    ],
  },
];

// Data simulating what we'd get from Kajabi
export const mockKajabiData = [
    {
        month: "2025-04",
        new_cash_collected: { pif: 15000, installments: 6000 },
        total_cash_collected: 29000,
        high_ticket_closes: { pif: 2, installments: 1 },
        discount_closes: { pif: 1, installments: 0 },
    },
    {
        month: "2025-05",
        new_cash_collected: { pif: 20000, installments: 8000 },
        total_cash_collected: 36000,
        high_ticket_closes: { pif: 3, installments: 2 },
        discount_closes: { pif: 1, installments: 1 },
    },
    {
        month: "2025-06",
        new_cash_collected: { pif: 25000, installments: 10000 },
        total_cash_collected: 45000,
        high_ticket_closes: { pif: 4, installments: 2 },
        discount_closes: { pif: 2, installments: 1 },
    }
];