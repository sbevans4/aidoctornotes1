
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the skeleton. Defaults to true.
   */
  visible?: boolean;
}

/**
 * Skeleton component for loading states
 */
function Skeleton({
  className,
  visible = true,
  ...props
}: SkeletonProps) {
  if (!visible) return null;
  
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
      role="status"
      aria-label="Loading"
      aria-busy="true"
      aria-live="polite"
    />
  )
}

export { Skeleton }
