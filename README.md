# Syntra Analytics Dashboard

This dashboard provides a comprehensive overview of a high-ticket coaching business's sales funnel, with a primary focus on tracking performance from YouTube video views to final sales. It's designed to help identify top-performing content, analyze conversion rates at each stage of the funnel, and make data-driven decisions to optimize marketing efforts.

## ✨ Features

- **Live YouTube Channel Stats**: Fetches and displays real-time analytics for "TheLastCodebender" YouTube channel.
- **Funnel Overview**: A top-level view of the entire sales funnel, using a combination of live and mock data.
- **Video Performance Analysis**: Detailed attribution to track which YouTube videos are generating leads, calls, and sales.
- **Monthly Trend Analysis**: Track key metrics over time to understand growth and identify patterns.
- **Revenue Deep Dive**: Break down revenue by source, product, and payment type.
- **Glassmorphism UI**: A modern, clean, and aesthetically pleasing user interface.

## ⚙️ How It Works

### Current State: Hybrid Live & Mock Data

The application is currently running in a **live demo mode**, showcasing the core architecture for fetching live data.

- **Live YouTube Data**: The dashboard authenticates a user via their Google account and is built to fetch real-time analytics for the **logged-in user's YouTube channel**. For the purpose of this public-facing demo, it currently defaults to "TheLastCodebender" channel, but the underlying functionality uses the user's session to make authenticated API calls.
- **Mock Funnel Data**: To complete the funnel for the demo, data for calls and revenue is currently simulated. This allows for a full demonstration of the dashboard's features without requiring access to a user's private sales data.

This setup provides a powerful demonstration of the dashboard's potential, combining live, real-world channel performance with a simulated sales funnel.

### Future State: Full Live Data Integration

The primary goal is to expand the live data integration to the rest of the funnel, providing a fully personalized analytics experience. This will involve:

1.  **Dynamic Channel Fetching**: Removing the hardcoded fallback and exclusively using the authenticated user's channel information.
2.  **Cal.com (or other scheduling tool) API Integration**: To pull the user's data on booked calls, accepted calls, and show-up rates.
3.  **Kajabi (or other payment/course platform) API Integration**: To get accurate data on the user's sales, revenue, and product performance.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Charting**: [Recharts](https://recharts.org/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Deployment**: [Vercel](https://vercel.com/)

## 🔧 Setup and Installation

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the `dashboard` directory and add the following variables.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Environment Variables

To connect to the Google API for future live data integration, you will need the following credentials from the [Google Cloud Console](https://console.cloud.google.com/).

```
# Google / YouTube API Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a_random_string_for_session_encryption
```

- `NEXTAUTH_URL`: Should be set to your application's public URL. For local development, it's `http://localhost:3000`.
- `NEXTAUTH_SECRET`: A secret key used to encrypt session data. You can generate one using `openssl rand -base64 32`.

## 部署 (Deployment)

The application is configured for easy deployment on [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Connect your repository to Vercel.
3.  Set the **Root Directory** to `dashboard` in the Vercel project settings.
4.  Add the environment variables listed above to your Vercel project.
5.  Deploy! 