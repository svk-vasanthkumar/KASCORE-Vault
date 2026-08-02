'use client'

import { clamp } from '@/utils/format'
import type { CrackTimeEstimate } from '@/types/password'

const YEAR = 31_536_000

/** Colour a duration by how comfortable it is: >100y good, >1y ok, else bad. */
function toneFor(seconds: number): string {
  if (seconds >= YEAR * 100) return 'success'
  if (seconds >= YEAR) return 'primary'
  if (seconds >= 86_400) return 'warning'
  return 'destructive'
}

interface CrackTimeTableProps {
  estimates: CrackTimeEstimate[]
  active: boolean
}

/**
 * Time-to-crack across escalating attacker capabilities. Bar widths use a
 * log10 scale because the underlying values span ~30 orders of magnitude.
 */
export function CrackTimeTable({ estimates, active }: CrackTimeTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-primary/70">
          Time to crack
        </h3>
        <span className="font-mono text-xs text-muted-foreground">log₁₀ scale</span>
      </div>

      {!active ? (
        <p className="rounded-lg border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
          Estimates appear once a password is entered.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {estimates.map((estimate) => {
            const token = toneFor(estimate.seconds)
            // Normalise log10(seconds) into 0-1 across 1s … 1e20s.
            const ratio = clamp(Math.log10(Math.max(estimate.seconds, 1)) / 20, 0.02, 1)

            return (
              <li key={estimate.id} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-sm font-medium text-foreground">{estimate.label}</span>
                  <span
                    className="font-mono text-sm font-semibold tabular-nums"
                    style={{ color: `var(--${token})` }}
                  >
                    {estimate.human}
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: `${ratio * 100}%`,
                      background: `var(--${token})`,
                      boxShadow: `0 0 8px color-mix(in oklch, var(--${token}) 45%, transparent)`,
                    }}
                  />
                </div>

                <p className="text-xs leading-snug text-muted-foreground">{estimate.description}</p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
