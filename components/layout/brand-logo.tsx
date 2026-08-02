import { ShieldHalf } from 'lucide-react'

import { cn } from '@/lib/utils'

interface BrandLogoProps {
  className?: string
  /** Hides the wordmark, leaving just the shield glyph. */
  compact?: boolean
}

/** KASCORE Vault wordmark. */
export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/8">
        <ShieldHalf className="size-4.5 text-primary" aria-hidden />
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg bg-primary/12 blur-md"
        />
      </span>
      {compact ? null : (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">
            KASCORE <span className="text-primary">Vault</span>
          </span>
          <span className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
            Secure Password Intelligence
          </span>
        </span>
      )}
    </span>
  )
}
