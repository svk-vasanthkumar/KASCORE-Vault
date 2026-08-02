'use client'

import { cn } from '@/lib/utils'

interface GlitchTextProps {
  children: string
  className?: string
}

/**
 * Chromatic-aberration glitch built from two offset pseudo-layers that only
 * animate on hover, keeping the idle page cheap to composite.
 */
export function GlitchText({ children, className }: GlitchTextProps) {
  return (
    <span className={cn('group relative inline-block', className)}>
      <span
        aria-hidden
        className="absolute inset-0 text-destructive opacity-0 transition-[opacity,transform] duration-150 group-hover:-translate-x-[3px] group-hover:opacity-70"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 text-primary opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-[3px] group-hover:opacity-70"
      >
        {children}
      </span>
      <span className="relative">{children}</span>
    </span>
  )
}
