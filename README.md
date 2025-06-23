# Syntra Dashboard: From Views to Revenue

![Syntra Dashboard Landing Page](dashboard/public/dashboard-header.png)

## Stop Guessing. Start Growing.

You spend hours creating YouTube videos, pouring your expertise into content for your coaching business. But let's be honest, you're asking the big questions:

*   "Are my videos *actually* making me money?"
*   "Which content brings in high-ticket clients"
*   "Where are people dropping off in my funnel?"

Answering these feels like guesswork. You're stuck digging through separate analytics on YouTube, your calendar, and your payment processor, trying to connect the dots.

**Syntra is the bridge between your content and your cash flow.** It's a dashboard that connects the dots for you, giving you a single, clear view of your entire high-ticket funnel.

## Key Features ✨

*   📊 **See Your Entire Funnel:** From YouTube views to website visitors, booked calls, and closed deals, you get a complete picture of your customer's journey. No more switching between ten different tabs.

*   🎥 **Pinpoint Your Best Content:** Discover exactly which videos are your money-makers. Syntra attributes every sale back to the specific YouTube video that brought them in, so you can double down on what works.

*   📈 **Track Real Growth:** Watch your business evolve with simple, beautiful charts. See month-over-month trends for revenue, calls, and conversion rates to make data-driven decisions, not gut-feel guesses.

## How It Works (The Tech Stuff)

This dashboard is built with a modern, fast, and interactive stack:

*   **Framework:** [Next.js](https://nextjs.org/) (React)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Data Fetching:** [Tanstack Query (React Query)](https://tanstack.com/query/latest)
*   **Charts:** [Recharts](https://recharts.org/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)

## Getting Started

Want to run the project locally?

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/syntra-dashboard.git
    cd syntra-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
    
3.  **Set up your environment variables:**
    Create a `.env.local` file in the `dashboard` directory and add your API keys for Google (YouTube), Cal.com, etc.
    ```env
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    # ... and other keys
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result. 