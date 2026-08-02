/** Entropy, pool-size and crack-time mathematics. */

import { ATTACK_MODELS, POOL_SIZES } from '@/constants/password'
import type { CharacterSets, CrackTimeEstimate } from '@/types/password'
import { formatDuration } from '@/utils/format'

/** Which character classes the password draws from. */
export function getCharacterSets(password: string): CharacterSets {
  return {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^\w\s]|_/.test(password),
    // eslint-disable-next-line no-control-regex
    extended: /[^\x00-\x7F]/.test(password),
  }
}

/** Total alphabet an attacker must sweep given the observed classes. */
export function getPoolSize(sets: CharacterSets): number {
  return (Object.keys(POOL_SIZES) as Array<keyof typeof POOL_SIZES>).reduce(
    (total, key) => (sets[key] ? total + POOL_SIZES[key] : total),
    0,
  )
}

/**
 * Ideal entropy for a uniformly random string of this length and pool:
 * `length * log2(poolSize)`.
 */
export function getRawEntropy(password: string, poolSize: number): number {
  if (!password || poolSize <= 1) return 0
  return password.length * Math.log2(poolSize)
}

/**
 * Effective entropy after penalising repeated characters. Real passwords
 * reuse glyphs, which reduces the search space an attacker must cover.
 */
export function getEffectiveEntropy(password: string, poolSize: number): number {
  const raw = getRawEntropy(password, poolSize)
  if (raw === 0) return 0

  const unique = new Set(password).size
  const repetitionFactor = 0.75 + 0.25 * (unique / password.length)
  return raw * repetitionFactor
}

/**
 * Convert entropy bits into an expected guess count. On average an attacker
 * finds the secret halfway through the keyspace, hence the 0.5 factor.
 */
export function entropyToGuesses(entropy: number): number {
  return Math.pow(2, entropy) * 0.5
}

/** Run the guess count through each attacker model. */
export function getCrackTimes(guesses: number): CrackTimeEstimate[] {
  return ATTACK_MODELS.map((model) => {
    const seconds = guesses / model.hashesPerSecond
    return {
      id: model.id,
      label: model.label,
      description: model.description,
      hashesPerSecond: model.hashesPerSecond,
      seconds,
      human: formatDuration(seconds),
    }
  })
}

/** Share of the five character classes that are represented (0-1). */
export function getDiversity(sets: CharacterSets): number {
  const active = Object.values(sets).filter(Boolean).length
  return Math.min(active / 4, 1)
}
