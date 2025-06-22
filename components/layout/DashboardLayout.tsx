'use client';

import { useSession, signIn } from 'next-auth/react';
import { ReactNode } from 'react';
import { Sidebar } from '../ui/sidebar';
import { MobileSidebar } from '../ui/MobileSidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '@/components/ui/button';

// Placeholder imports for shadcn/ui components (replace with actual imports as you add them)
// import { Sidebar } from '../ui/sidebar';
// import { Header } from '../ui/header';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Main dashboard layout with sidebar, header, and content area.
 * Uses Tailwind for layout and will use shadcn/ui for sidebar/header as you build them.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 hidden md:block">
        <Sidebar />
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header with mobile sidebar and theme toggle */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-10 bg-white dark:bg-[#1a1a1a]">
          <MobileSidebar />
          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {isAuthenticated ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <h1 className="text-2xl font-bold">Connect Your Account</h1>
              <p className="max-w-md">
                To get started, please sign in with your Google account. This will allow us to fetch live data from your YouTube channel and display your analytics.
              </p>
              <Button onClick={() => signIn('google')}>
                Sign In with Google
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 