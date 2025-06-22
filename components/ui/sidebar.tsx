import { Home, BarChart, Video, Shuffle, Settings } from 'lucide-react';
import Link from 'next/link';

/**
 * Sidebar navigation for the dashboard.
 * Uses shadcn/ui and lucide icons. Add or update nav items as needed.
 */
export function Sidebar() {
  return (
    <nav className="h-full flex flex-col gap-2 p-4 bg-white dark:bg-[#1a1a1a] dark:border-zinc-800 shadow shadow-black/20">
      {/* Logo or title */}
      <div className="mb-6 font-bold text-lg tracking-tight">Dashboard</div>
      {/* Navigation links */}
      <ul className="flex-1 flex flex-col gap-2">
        <li>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <Home className="w-5 h-5" />
            <span>Overview</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <BarChart className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/videos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <Video className="w-5 h-5" />
            <span>Videos</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/funnel" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <Shuffle className="w-5 h-5" />
            <span>Funnel</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
      {/* Footer or version info */}
      <div className="mt-auto text-xs text-zinc-400">v1.0.0</div>
    </nav>
  );
} 