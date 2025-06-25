'use client';

import { useSession, signIn } from 'next-auth/react';
import { Sidebar } from '../ui/sidebar';
import { MobileSidebar } from '../ui/MobileSidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '@/components/ui/button';
import NotAuthenticated from './NotAuthenticated';
import Image from 'next/image';

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
    return <NotAuthenticated />;
  }

  return (
    <div className="flex h-screen text-foreground ">
      <Sidebar className="hidden lg:flex lg:w-60 shadow-lg" />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-y-auto dashboard-gradient-bg">
        <header className="flex h-[60px] shrink-0 items-center justify-between px-6 lg:hidden">
          <MobileSidebar />
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div
            className="relative mb-8 flex items-center justify-between backdrop-blur-lg  shadow-sm shadow-black/15 rounded-2xl bg-cover bg-center p-6 text-white sm:p-8 "
            // style={{ backgroundImage: "url('/dashboard-header.png')" }}
          >
            <div className="absolute inset-0 rounded-2xl" />
            <div className="relative z-10">
             
              <h1 className="text-2xl font-normal sm:text-3xl tracking-tight text-zinc-600/70 dark:text-zinc-100 flex items-center">
                Your Empire is Growing,
                <span className="font-semibold text-zinc-600/70 dark:text-zinc-400 ml-2">
                  {session?.user?.name ? session.user.name.split(' ')[0] : 'there'}
                </span>
                
                <Image
                  src="/rocket.png"
                  alt="Rocket"
                  width={80}
                  height={70}
                  className="inline-block align-middle"
                />
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Here&apos;s how your business performed this month.</p>
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