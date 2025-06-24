// ---
// Plain language: This file makes fake (mock) data showing how many leads, calls, and revenue come from each country. We use this to test our dashboard before we connect to the real Cal.com API. You can call generateMockCountryBreakdown() to get a list of countries with numbers for leads, calls, and revenue.
// ---
import { CountryBreakdown } from '../types/metrics';

// List of example countries
const COUNTRIES = [
  { country: 'United States', code: 'US', percent: 0.65 },
  { country: 'United Kingdom', code: 'GB', percent: 0.10 },
  { country: 'Canada', code: 'CA', percent: 0.08 },
  { country: 'Australia', code: 'AU', percent: 0.07 },
  { country: 'Germany', code: 'DE', percent: 0.03 },
  { country: 'India', code: 'IN', percent: 0.03 },
  { country: 'France', code: 'FR', percent: 0.02 },
  { country: 'Brazil', code: 'BR', percent: 0.02 },
];

// This function makes fake country data for a given total number of leads, calls, and revenue
export function generateMockCountryBreakdown(totalLeads = 100, totalCalls = 30, totalRevenue = 50000): CountryBreakdown[] {
  let leadsLeft = totalLeads;
  let callsLeft = totalCalls;
  let revenueLeft = totalRevenue;
  const breakdown: CountryBreakdown[] = [];

  COUNTRIES.forEach((c, i) => {
    // For the last country, give it whatever is left
    const isLast = i === COUNTRIES.length - 1;
    const leads = isLast ? leadsLeft : Math.round(totalLeads * c.percent);
    const calls = isLast ? callsLeft : Math.round(totalCalls * c.percent);
    const revenue = isLast ? revenueLeft : Math.round(totalRevenue * c.percent);
    leadsLeft -= leads;
    callsLeft -= calls;
    revenueLeft -= revenue;
    breakdown.push({
      country: c.country,
      countryCode: c.code,
      leads,
      callsBooked: calls,
      callsAccepted: Math.round(calls * 0.8), // 80% show up
      revenue,
      conversionRate: leads > 0 ? Math.round((revenue / leads) * 100) / 100 : 0,
    });
  });
  return breakdown;
} 