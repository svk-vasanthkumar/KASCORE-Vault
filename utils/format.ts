/** Presentation helpers shared across metric cards and dashboards. */

const TIME_UNITS: Array<{ limit: number; divisor: number; unit: string }> = [
  { limit: 60, divisor: 1, unit: 'second' },
  { limit: 3600, divisor: 60, unit: 'minute' },
  { limit: 86_400, divisor: 3600, unit: 'hour' },
  { limit: 2_592_000, divisor: 86_400, unit: 'day' },
  { limit: 31_536_000, divisor: 2_592_000, unit: 'month' },
  { limit: 3.1536e10, divisor: 31_536_000, unit: 'year' },
]

const LARGE_YEAR_SCALES: Array<{ limit: number; divisor: number; suffix: string }> = [
  { limit: 1e6, divisor: 1e3, suffix: 'thousand years' },
  { limit: 1e9, divisor: 1e6, suffix: 'million years' },
  { limit: 1e12, divisor: 1e9, suffix: 'billion years' },
  { limit: 1e15, divisor: 1e12, suffix: 'trillion years' },
  { limit: 1e18, divisor: 1e15, suffix: 'quadrillion years' },
]

/** Turn a raw duration in seconds into a compact, human sentence fragment. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return 'effectively forever'
  if (seconds < 1e-3) return 'instantly'
  if (seconds < 1) return 'under a second'

  for (const { limit, divisor, unit } of TIME_UNITS) {
    if (seconds < limit) {
      const value = Math.round(seconds / divisor)
      return `${value} ${unit}${value === 1 ? '' : 's'}`
    }
  }

  const years = seconds / 31_536_000
  for (const { limit, divisor, suffix } of LARGE_YEAR_SCALES) {
    if (years < limit) {
      return `${formatCompactNumber(years / divisor)} ${suffix}`
    }
  }

  return 'beyond the age of the universe'
}

/** Compact number with at most one decimal place (1.2, 43, 980). */
export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) return '∞'
  if (value >= 100) return Math.round(value).toLocaleString('en-US')
  if (value >= 10) return value.toFixed(0)
  return value.toFixed(1).replace(/\.0$/, '')
}

/** Abbreviate large counts for badges: 12.4K, 3.1M. */
export function formatCount(value: number): string {
  if (value < 1000) return String(value)
  if (value < 1e6) return `${(value / 1e3).toFixed(value < 1e4 ? 1 : 0)}K`
  return `${(value / 1e6).toFixed(1)}M`
}

/** Clamp a number into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
