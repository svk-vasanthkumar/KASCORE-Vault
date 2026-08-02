import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  label?: string
  className?: string
}

/** Pulsing "systems online" pill shown in the navigation bar. */
export function StatusIndicator({ label = 'Online', className }: StatusIndicatorProps) {
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3 py-1',
        'font-mono text-[10px] tracking-[0.22em] text-accent uppercase',
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 rounded-full bg-accent animate-cyber-pulse" />
        <span className="relative size-1.5 rounded-full bg-accent" />
      </span>
      {label}
    </span>
  )
}
