"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Globe, LayoutDashboard, Video, BarChart3, Shuffle, Settings } from 'lucide-react';
import { ThemeToggle } from "./ThemeToggle";
import { useState } from 'react';
import React from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/videos', icon: Video, label: 'Videos' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/funnel', icon: Shuffle, label: 'Funnel' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  // Listen for route changes to reset navigation state
  // This effect will run on every pathname change
  React.useEffect(() => {
    if (navigatingTo && pathname === navigatingTo) {
      setNavigatingTo(null);
    }
  }, [pathname, navigatingTo]);

  return (
    <aside className={cn("hidden lg:flex flex-col w-64 bg-white dark:bg-zinc-700/10 border-r border-zinc-200 dark:border-zinc-800 p-4", className)}>
      <div className="flex items-center mb-8">
        <Globe size={24} className="text-zinc-500" />
        <h1 className="ml-2 text-xl font-semibold tracking-tight text-zinc-500 dark:text-zinc-300">Syntra</h1>
      </div>
      <hr className="border-zinc-200 dark:border-zinc-800 mb-4" />
      <ul className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isNavigating = navigatingTo === item.href;
          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => {
                  if (!isActive && !isNavigating) {
                    setNavigatingTo(item.href);
                    router.push(item.href);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm relative overflow-hidden w-full text-left",
                  isActive 
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  isActive ? "dark:sidebar-neon" : "dark:hover:sidebar-neon"
                )}
                disabled={isActive || isNavigating}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex items-center gap-2">
                  {isNavigating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-zinc-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                        <path className="opacity-75" fill="currentColor" d="M15 8a7 7 0 01-7 7V13a5 5 0 005-5h2z" />
                      </svg>
                      Navigating...
                    </>
                  ) : item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-zinc-400">v1.0.0</span>
        <ThemeToggle />
      </div>
    </aside>
  );
} 