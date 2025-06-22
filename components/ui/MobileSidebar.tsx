'use client';

import { useState } from 'react';
import { Home, BarChart, Video, Shuffle, Settings, Menu } from 'lucide-react';
import Link from 'next/link';

/**
 * Mobile sidebar navigation with hamburger menu.
 * Uses shadcn/ui and lucide icons. Nav items match the main sidebar.
 */
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger menu button (visible on mobile only) */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Overlay and drawer */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          />
          {/* Drawer */}
          <nav className="relative w-64 bg-white dark:bg-zinc-950 h-full shadow-lg z-50 flex flex-col p-4 animate-in slide-in-from-left">
            <div className="mb-6 font-bold text-lg tracking-tight">Dashboard</div>
            <ul className="flex-1 flex flex-col gap-2">
              <li>
                <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" onClick={() => setOpen(false)}>
                  <Home className="w-5 h-5" />
                  <span>Overview</span>
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" onClick={() => setOpen(false)}>
                  <BarChart className="w-5 h-5" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link href="/videos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" onClick={() => setOpen(false)}>
                  <Video className="w-5 h-5" />
                  <span>Videos</span>
                </Link>
              </li>
              <li>
                <Link href="/funnel" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" onClick={() => setOpen(false)}>
                  <Shuffle className="w-5 h-5" />
                  <span>Funnel</span>
                </Link>
              </li>
              <li>
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" onClick={() => setOpen(false)}>
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
            <div className="mt-auto text-xs text-zinc-400">v1.0.0</div>
          </nav>
        </div>
      )}
    </>
  );
} 