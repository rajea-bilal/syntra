'use client';

import { useSession, signIn } from 'next-auth/react';
import { Sidebar } from '../ui/sidebar';
import { MobileSidebar } from '../ui/MobileSidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '@/components/ui/button';

// Placeholder imports for shadcn/ui components (replace with actual imports as you add them)
// import { Sidebar } from '../ui/sidebar';
// import { Header } from '../ui/header';

/**
 * Main dashboard layout with sidebar, header, and content area.
 * Uses Tailwind for layout and will use shadcn/ui for sidebar/header as you build them.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  if (status === 'loading') {
  return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p>Loading session...</p>
          </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center bg-background text-foreground">
              <h1 className="text-2xl font-bold">Connect Your Account</h1>
              <p className="max-w-md">
                To get started, please sign in with your Google account. This will allow us to fetch live data from your YouTube channel and display your analytics.
              </p>
              <Button onClick={() => signIn('google')}>
                Sign In with Google
              </Button>
            </div>
    );
  }

  return (
    <div className="flex h-screen text-foreground ">
      <Sidebar className="hidden lg:flex lg:w-60 shadow-lg" />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gradient-to-t from-[#F5E1D8]/50 via-[#EFEAE8]/60 via-[#F1DEE5]/50 via-[#E6E3EB]/60 to-[#D1DFF0] dark:bg-[#1B1B1D]">
        <header className="flex h-[60px] shrink-0 items-center justify-between px-6 lg:hidden">
          <MobileSidebar />
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div
            className="relative mb-8 flex items-center justify-between shadow shadow-black/10 rounded-2xl bg-cover bg-center p-6 text-white sm:p-8"
            style={{ backgroundImage: "url('/dashboard-header.png')" }}
          >
            <div className="absolute inset-0 rounded-2xl bg-black/10" />
            <div className="relative z-10">
              <p className="mb-1 text-sm font-medium text-zinc-300">Dashboard</p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome back, {session?.user?.name ? session.user.name.split(' ')[0] : 'there'}
              </h1>
            </div>
            <div className="relative z-10 hidden items-center gap-4 lg:flex">
              <ThemeToggle />
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
} 