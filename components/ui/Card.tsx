import { ReactNode } from 'react';

/**
 * Reusable Card component for dashboard metric displays and panels.
 * Use for stats, charts, or any content block.
 */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  // Only add bg-card if no custom bg- class is present
  const hasCustomBg = className.includes('bg-');
  return (
    <div className={`rounded-lg dark:bg-[#202022] shadow-md shadow-black/5 p-4 ${hasCustomBg ? '' : 'bg-card'} ${className}`}>
      {children}
    </div>
  );
}