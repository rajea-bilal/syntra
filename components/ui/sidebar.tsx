"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Globe, LayoutDashboard, Video, BarChart3, Shuffle, Settings } from 'lucide-react';
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/videos', icon: Video, label: 'Videos' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/funnel', icon: Shuffle, label: 'Funnel' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("hidden lg:flex flex-col w-64 bg-zinc-50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 p-4", className)}>
      <div className="flex items-center mb-8">
        <Globe size={24} className="text-zinc-500" />
        <h1 className="ml-2 text-xl font-semibold tracking-tight text-zinc-500 dark:text-zinc-300">Syntra</h1>
      </div>
      <hr className="border-zinc-200 dark:border-zinc-800 mb-4" />
      <ul className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm relative overflow-hidden",
                  isActive 
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  isActive ? "dark:sidebar-neon" : "dark:hover:sidebar-neon"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
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