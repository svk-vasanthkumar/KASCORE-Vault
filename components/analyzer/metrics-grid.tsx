'use client'

import { cn } from '@/lib/utils'
import type { PasswordMetric } from '@/types/password'

const TONE_TOKEN: Record<PasswordMetric['tone'], string> = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'destructive',
  neutral: 'muted-foreground',
}

interface MetricsGridProps {
  metrics: PasswordMetric[]
}

/** Compact stat tiles, each with an optional mini fill bar. */
export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics.length) return null

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const token = TONE_TOKEN[metric.tone]
        return (
          <div
            key={metric.id}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-primary/12 bg-card/50 p-4',
              'transition-all duration-300 hover:border-primary/30 hover:bg-card/80',
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              {metric.label}
            </dt>
            <dd
              className="mt-2 font-mono text-lg font-semibold leading-none tabular-nums"
              style={{ color: `var(--${token})` }}
            >
              {metric.value}
            </dd>
            <p className="mt-2 text-xs leading-snug text-muted-foreground">{metric.hint}</p>

            {typeof metric.ratio === 'number' ? (
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border/60">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{
                    width: `${Math.max(metric.ratio * 100, 2)}%`,
                    background: `var(--${token})`,
                  }}
                />
              </div>
            ) : null}
          </div>
        )
      })}
    </dl>
  )
}
