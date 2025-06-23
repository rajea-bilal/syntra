import { Home, BarChart, Video, Shuffle, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
} from 'lucide-react';

/**
 * Sidebar navigation for the dashboard.
 * Uses shadcn/ui and lucide icons. Add or update nav items as needed.
 */
interface SidebarProps {
  className?: string;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/videos', icon: Video, label: 'Videos' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <nav className={cn(
      "h-full flex flex-col gap-2 p-4 bg-white dark:bg-[#151517] dark:border-zinc-800 shadow shadow-black/20",
      className
    )}>
      {/* Logo or title */}
      <div className="mb-2 px-3 font-bold text-lg tracking-tight">Syntra</div>
      <hr className="border-zinc-200 dark:border-zinc-800" />
      {/* Navigation links */}
      <ul className="flex-1 flex flex-col gap-2">
        <li>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <Home className="w-4 h-4  dark:text-gray-400" />
            <span className="text-sm dark:text-gray-400">Overview</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/videos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <Video className="w-4 h-4  dark:text-gray-400" />
            <span className="text-sm  dark:text-gray-400">Videos</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <BarChart className="w-4 h-4  dark:text-gray-400" />
            <span className="text-sm  dark:text-gray-400">Analytics</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/funnel" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <Shuffle className="w-4 h-4  dark:text-gray-400" />
            <span className="text-sm  dark:text-gray-400">Funnel</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
            <Settings className="w-4 h-4  dark:text-gray-400" />
            <span className="text-sm  dark:text-gray-400">Settings</span>
          </Link>
        </li>
      </ul>
      {/* Footer or version info */}
      <div className="mt-auto text-xs text-zinc-400">v1.0.0</div>
    </nav>
  );
} 