import { ReactNode } from 'react';

/**
 * Reusable Card component for dashboard metric displays and panels.
 * Use for stats, charts, or any content block.
 */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-zinc-200 dark:border-zinc-800 bg-card shadow-md shadow-black/5 dark:shadow-lg dark:shadow-black/30 p-4 ${className}`}>
      {children}
    </div>
  );
} 