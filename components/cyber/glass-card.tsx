'use client'

import type { ReactNode } from 'react'

import { useMouseSpotlight } from '@/hooks/use-mouse-spotlight'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  /** Adds a pointer-following radial highlight. */
  spotlight?: boolean
  /** Uses the heavier, more opaque surface treatment. */
  elevated?: boolean
  as?: 'div' | 'section' | 'article' | 'aside'
}

/**
 * The core surface of the app: frosted glass, gradient hairline border and an
 * optional mouse-tracked spotlight driven by CSS custom properties.
 */
export function GlassCard({
  children,
  className,
  spotlight = false,
  elevated = false,
  as: Tag = 'div',
}: GlassCardProps) {
  const { ref, onPointerMove, onPointerLeave } = useMouseSpotlight<HTMLDivElement>()

  return (
    <Tag
      ref={spotlight ? ref : undefined}
      onPointerMove={spotlight ? onPointerMove : undefined}
      onPointerLeave={spotlight ? onPointerLeave : undefined}
      className={cn(
        'group/card relative overflow-hidden rounded-2xl gradient-border',
        elevated ? 'glass-strong' : 'glass',
        'transition-[box-shadow,border-color,transform] duration-500',
        'hover:shadow-[0_0_60px_-24px_color-mix(in_oklab,var(--primary)_55%,transparent)]',
        className,
      )}
    >
      {spotlight ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{
            background:
              'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--primary) 12%, transparent), transparent 70%)',
          }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </Tag>
  )
}
