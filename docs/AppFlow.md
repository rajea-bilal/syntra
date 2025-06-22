# YouTube Integration Flow

## The Big Picture
Think of this like logging into a website using your Google account, but specifically for YouTube. We need to:
- Ask YouTube "Hey, can we look at this user's YouTube data?"
- Have the user say "Yes, I allow this"
- Get a special pass (token) from YouTube that lets us access their data

## The Files and What They Do

### 1. `services/youtubeApi.ts`
```typescript
// This is like our main YouTube manager. It:
// 1. Knows how to talk to YouTube
// 2. Keeps track of our special pass (token)
// 3. Has methods to get YouTube data (videos, stats, etc.)

class YouTubeApiService {
  // Methods to:
  // - Get the login URL (getAuthUrl)
  // - Exchange the code for tokens (exchangeCodeForTokens)
  // - Get YouTube data (getChannelVideos, getVideoStatistics)
}
```

### 2. `api/auth/youtube/url/route.ts`
```typescript
// This creates the special YouTube login URL
// When someone clicks "Connect to YouTube", this gets called
// It's like generating a special link that says "Click here to log in to YouTube"

export async function GET() {
  const youtubeService = YouTubeApiService.initialize();
  const url = youtubeService.getAuthUrl();
  return NextResponse.json({ url });
}
```

### 3. `api/auth/youtube/callback/route.ts`
```typescript
// This handles what happens AFTER someone logs in to YouTube
// YouTube sends them back here with a special code
// We exchange this code for a token (like a permanent pass)

export async function GET(request: NextRequest) {
  // 1. Get the code from YouTube
  const code = searchParams.get('code');
  
  // 2. Exchange it for tokens
  await youtubeService.exchangeCodeForTokens(code);
  
  // 3. Send user back to dashboard
  return NextResponse.redirect('/dashboard?success=true');
}
```

## How They Work Together

Let's walk through the whole process:

```
1. User clicks "Connect YouTube" button on dashboard
   |
2. Button calls /api/auth/youtube/url
   |
3. URL route uses youtubeApi.ts to generate login URL
   |
4. User gets sent to YouTube's login page
   |
5. User logs in and approves access
   |
6. YouTube sends user back to /api/auth/youtube/callback
   |
7. Callback route uses youtubeApi.ts to exchange code for tokens
   |
8. User gets sent back to dashboard
   |
9. Now we can use youtubeApi.ts to fetch YouTube data
```

## Real World Example
Imagine going to a concert:
- `youtubeApi.ts` is like the security office that:
  - Makes tickets (tokens)
  - Checks tickets
  - Lets you into different areas (YouTube data)
- `/url` route is like the ticket booth where you get your ticket
- `/callback` route is like the entrance where they check your ticket and give you a wristband (token)

## The Flow in Action
```typescript
// 1. When user clicks "Connect YouTube":
const handleConnectYoutube = async () => {
  const response = await fetch("/api/auth/youtube/url");
  const { url } = await response.json();
  window.location.href = url;  // Send user to YouTube login
};

// 2. After login, YouTube sends them to our callback with a code
// 3. We exchange that code for tokens
// 4. Then we can make requests like:
const videos = await youtubeService.getChannelVideos('channel-id');
```

## Security Benefits
This whole system ensures:
1. Secure access to YouTube data
2. Users explicitly approve access
3. We can maintain long-term access with refresh tokens
4. We can make YouTube API calls safely

## Environment Variables Required
For this flow to work, you need these environment variables set up:
- `GOOGLE_CLIENT_ID`: Your OAuth client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: Your OAuth client secret from Google Cloud Console
- `OAUTH_REDIRECT_URI`: The callback URL (e.g., http://localhost:3000/api/auth/youtube/callback)
- `YOUTUBE_API_KEY`: Your YouTube Data API key for non-OAuth endpoints 