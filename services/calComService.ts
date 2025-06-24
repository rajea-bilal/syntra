// ---
// This file is where we get country breakdown data for our dashboard.
// Right now, it just gives us fake (mock) data for testing.
// When you want to use real data from Cal.com, you will:
//   1. Make an API request to Cal.com to get all bookings/leads.
//   2. Go through each booking and figure out which country it came from.
//   3. Count up the leads, calls, and revenue for each country.
//   4. Return the list of countries with their numbers.
// You only need to change the getCountryBreakdown() function below.
// ---
import { generateMockCountryBreakdown } from '../mockData/generateMockCountryData';
import { CountryBreakdown } from '../types/metrics';

// This function gives us country breakdown data. It uses mock data for now.
export async function getCountryBreakdown(): Promise<CountryBreakdown[]> {
  // ---
  // his is the mock version. It just makes up numbers for testing.
  // ---
  return generateMockCountryBreakdown(100, 30, 50000);

  // ---
  // Plain language: When you want to use real data from Cal.com, use code like this:
  // ---
  /*
  // 1. Make a request to Cal.com API to get all bookings/leads
  const response = await fetch('https://api.cal.com/v1/bookings', {
    headers: {
      'Authorization': 'Bearer YOUR_CAL_COM_API_KEY',
      'Content-Type': 'application/json',
    },
  });
  const bookings = await response.json();

  // 2. Go through each booking and figure out the country
  //    (Assume each booking has a 'country' field, or you infer it from IP/phone)
  const countryMap: { [code: string]: CountryBreakdown } = {};
  for (const booking of bookings) {
    const country = booking.country || 'Unknown';
    const countryCode = booking.countryCode || 'XX';
    if (!countryMap[countryCode]) {
      countryMap[countryCode] = {
        country,
        countryCode,
        leads: 0,
        callsBooked: 0,
        callsAccepted: 0,
        revenue: 0,
        conversionRate: 0,
      };
    }
    countryMap[countryCode].leads += 1;
    countryMap[countryCode].callsBooked += 1; // or use real logic
    countryMap[countryCode].callsAccepted += booking.accepted ? 1 : 0;
    countryMap[countryCode].revenue += booking.amount || 0;
  }

  // 3. Calculate conversion rate for each country
  for (const code in countryMap) {
    const c = countryMap[code];
    c.conversionRate = c.leads > 0 ? Math.round((c.revenue / c.leads) * 100) / 100 : 0;
  }

  // 4. Return the list
  return Object.values(countryMap);
  */
} 