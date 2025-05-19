
import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from './scroll-area';
import { useMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  /**
   * Whether the sidebar is open
   */
  open: boolean;
  
  /**
   * Callback to toggle the sidebar state
   */
  onToggle: () => void;
  
  /**
   * Optional CSS classes to apply to the sidebar
   */
  className?: string;
  
  /**
   * Optional CSS classes to apply to the content area
   */
  contentClassName?: string;
  
  /**
   * Optional title to display in the sidebar header
   */
  title?: string;
  
  /**
   * The content to render inside the sidebar
   */
  children: React.ReactNode;
}

/**
 * A sidebar component that can be toggled open and closed
 * Includes a header with title and toggle button
 */
export function Sidebar({
  open,
  onToggle,
  className,
  contentClassName,
  title = 'Menu',
  children
}: SidebarProps) {
  const { isMobile } = useMobile();
  
  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background transition-transform',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16',
        isMobile ? 'w-3/4 max-w-xs' : 'w-64',
        className
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {open && <h2 className="text-lg font-semibold">{title}</h2>}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          className={cn(
            'ml-auto md:ml-0',
            !open && 'md:rotate-180'
          )}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      
      <ScrollArea className={cn('flex-1 py-2', contentClassName)}>
        <div className={cn('px-4', !open && 'md:px-2')}>
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
