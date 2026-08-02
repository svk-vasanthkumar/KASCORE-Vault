'use client'

import { useEffect, useMemo, useState } from 'react'

import { analyzePassword, EMPTY_ANALYSIS } from '@/lib/analyzer'
import type { PasswordAnalysis } from '@/types/password'

type Estimator = (password: string) => { guessesLog10: number }

/** Module-level cache so the dictionary bundle is only downloaded once. */
let estimatorPromise: Promise<Estimator> | null = null

/**
 * Lazily import zxcvbn-ts and its English dictionaries.
 * Uses ZxcvbnFactory class from @zxcvbn-ts/core v4+.
 */
function loadEstimator(): Promise<Estimator> {
  if (!estimatorPromise) {
    estimatorPromise = Promise.all([
      import('@zxcvbn-ts/core'),
      import('@zxcvbn-ts/language-common'),
      import('@zxcvbn-ts/language-en'),
    ]).then(([core, common, en]) => {
      const zxcvbn = new core.ZxcvbnFactory({
        dictionary: { ...common.dictionary, ...en.dictionary },
        graphs: common.adjacencyGraphs,
        translations: en.translations,
      })
      return (password: string) => zxcvbn.check(password)
    })
  }
  return estimatorPromise
}

/**
 * Realtime password analysis.
 *
 * Runs the synchronous local engine on every keystroke, then refines the
 * score with the zxcvbn research model once its dictionaries are available.
 */
export function usePasswordAnalysis(password: string): {
  analysis: PasswordAnalysis
  isRefined: boolean
} {
  const [estimator, setEstimator] = useState<Estimator | null>(null)

  useEffect(() => {
    if (!password || estimator) return
    let active = true
    loadEstimator().then((loaded) => {
      if (active) setEstimator(() => loaded)
    })
    return () => {
      active = false
    }
  }, [password, estimator])

  const analysis = useMemo(() => {
    if (!password) return EMPTY_ANALYSIS

    let guessesLog10: number | undefined
    if (estimator) {
      try {
        guessesLog10 = estimator(password).guessesLog10
      } catch {
        guessesLog10 = undefined
      }
    }

    return analyzePassword(password, guessesLog10)
  }, [password, estimator])

  return { analysis, isRefined: Boolean(estimator) && password.length > 0 }
}
