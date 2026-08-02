'use client'

import { useEffect, useRef, useState } from 'react'

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Tween a numeric value with requestAnimationFrame.
 * Used by the security score ring and metric counters.
 */
export function useAnimatedNumber(target: number, duration = 700): number {
  const [value, setValue] = useState(target)
  const frame = useRef<number | null>(null)
  const origin = useRef(target)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(target)
      return
    }

    const from = origin.current
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const next = from + (target - from) * easeOutCubic(progress)
      setValue(next)
      origin.current = next

      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      } else {
        origin.current = target
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration])

  return value
}
