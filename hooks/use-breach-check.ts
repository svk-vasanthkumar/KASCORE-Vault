'use client'

import { useEffect, useRef, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { checkPasswordBreach } from '@/services/breach-service'
import type { BreachResult } from '@/types/password'

const IDLE: BreachResult = { state: 'idle', count: 0 }

/**
 * Debounced, cancellable breach lookup.
 *
 * @param password Candidate secret; hashed locally before any request.
 * @param enabled  Allows the caller to gate network activity.
 */
export function useBreachCheck(password: string, enabled = true): BreachResult {
  const debounced = useDebouncedValue(password, 600)
  const [result, setResult] = useState<BreachResult>(IDLE)
  const cache = useRef(new Map<string, BreachResult>())

  useEffect(() => {
    if (!enabled || debounced.length < 4) {
      setResult(IDLE)
      return
    }

    const cached = cache.current.get(debounced)
    if (cached) {
      setResult(cached)
      return
    }

    const controller = new AbortController()
    setResult({ state: 'checking', count: 0 })

    checkPasswordBreach(debounced, controller.signal)
      .then((next) => {
        if (controller.signal.aborted) return
        cache.current.set(debounced, next)
        setResult(next)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setResult({
          state: 'error',
          count: 0,
          message: error instanceof Error ? error.message : 'Breach lookup failed.',
        })
      })

    return () => controller.abort()
  }, [debounced, enabled])

  return result
}
