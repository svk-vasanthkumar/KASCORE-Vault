'use client'

import { CircleAlert, DatabaseZap, Loader2, ShieldCheck, ShieldQuestion } from 'lucide-react'

import { formatCount } from '@/utils/format'
import type { BreachResult } from '@/types/password'

const STATE_META = {
  idle: {
    token: 'muted-foreground',
    title: 'Breach check idle',
    icon: ShieldQuestion,
  },
  checking: {
    token: 'primary',
    title: 'Querying breach corpus…',
    icon: Loader2,
  },
  safe: {
    token: 'success',
    title: 'Not found in any known breach',
    icon: ShieldCheck,
  },
  compromised: {
    token: 'destructive',
    title: 'Found in known breaches',
    icon: CircleAlert,
  },
  error: {
    token: 'warning',
    title: 'Breach service unavailable',
    icon: ShieldQuestion,
  },
} as const

interface BreachPanelProps {
  result: BreachResult
}

/**
 * Surfaces the k-anonymity breach lookup. Only the first five characters of
 * the SHA-1 hash are sent upstream, which we display as proof.
 */
export function BreachPanel({ result }: BreachPanelProps) {
  const meta = STATE_META[result.state]
  const Icon = meta.icon

  return (
    <div
      className="flex flex-col gap-4 rounded-xl border p-5 transition-colors duration-500"
      style={{
        borderColor: `color-mix(in oklch, var(--${meta.token}) 25%, transparent)`,
        background: `color-mix(in oklch, var(--${meta.token}) 5%, transparent)`,
      }}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in oklch, var(--${meta.token}) 14%, transparent)` }}
          aria-hidden="true"
        >
          <Icon
            className={result.state === 'checking' ? 'size-4 animate-spin' : 'size-4'}
            style={{ color: `var(--${meta.token})` }}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">{meta.title}</h3>
            {result.state === 'compromised' ? (
              <span
                className="font-mono text-lg font-bold leading-none tabular-nums"
                style={{ color: `var(--${meta.token})` }}
              >
                {formatCount(result.count)}
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {result.state === 'compromised'
              ? `This exact password appears ${formatCount(result.count)} times across public credential dumps. Attackers try it first — replace it everywhere it is used.`
              : result.state === 'safe'
                ? 'No match in the Have I Been Pwned corpus of over 900 million leaked credentials.'
                : result.state === 'error'
                  ? (result.message ?? 'Could not reach the range API. Local analysis is unaffected.')
                  : result.state === 'checking'
                    ? 'Comparing a partial hash prefix against the breach range index.'
                    : 'Enter a password of at least four characters to run a privacy-preserving lookup.'}
          </p>
        </div>
      </div>

      {result.prefix ? (
        <div className="flex items-center gap-2 border-t border-border/50 pt-3">
          <DatabaseZap className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="font-mono text-[0.6875rem] leading-relaxed text-muted-foreground">
            {'sent: '}
            <span className="text-primary">{result.prefix}</span>
            {'… · withheld: '}
            <span className="text-muted-foreground/60">{'•'.repeat(35)}</span>
          </p>
        </div>
      ) : null}
    </div>
  )
}
