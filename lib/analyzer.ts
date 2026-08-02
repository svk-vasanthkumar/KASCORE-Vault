/**
 * The scoring engine. Combines entropy mathematics with pattern penalties to
 * produce a single 0-100 security score plus every derived view model the UI
 * renders (metrics, rules, suggestions, grade, risk).
 */

import {
  entropyToGuesses,
  getCharacterSets,
  getCrackTimes,
  getDiversity,
  getEffectiveEntropy,
  getPoolSize,
} from '@/lib/entropy'
import { detectPatterns } from '@/lib/patterns'
import type {
  DetectedPattern,
  Grade,
  PasswordAnalysis,
  PasswordMetric,
  RiskLevel,
  RuleResult,
  StrengthLevel,
} from '@/types/password'
import { clamp, formatCompactNumber } from '@/utils/format'

const SEVERITY_PENALTY: Record<DetectedPattern['severity'], number> = {
  low: 6,
  medium: 14,
  high: 26,
}

/** Empty-state analysis so consumers never deal with `null`. */
export const EMPTY_ANALYSIS: PasswordAnalysis = {
  password: '',
  length: 0,
  entropy: 0,
  poolSize: 0,
  uniqueCharacters: 0,
  diversity: 0,
  score: 0,
  level: 'empty',
  grade: 'F',
  risk: 'critical',
  characterSets: {
    lowercase: false,
    uppercase: false,
    numbers: false,
    symbols: false,
    extended: false,
  },
  patterns: [],
  crackTimes: [],
  rules: [],
  metrics: [],
  suggestions: [],
}

function getLevel(score: number): StrengthLevel {
  if (score >= 85) return 'very-strong'
  if (score >= 68) return 'strong'
  if (score >= 48) return 'medium'
  if (score >= 28) return 'fair'
  return 'weak'
}

function getGrade(score: number): Grade {
  if (score >= 95) return 'S'
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  if (score >= 20) return 'E'
  return 'F'
}

function getRisk(score: number): RiskLevel {
  if (score >= 88) return 'minimal'
  if (score >= 70) return 'low'
  if (score >= 50) return 'moderate'
  if (score >= 28) return 'high'
  return 'critical'
}

function buildRules(password: string): RuleResult[] {
  const sets = getCharacterSets(password)
  const unique = new Set(password).size
  const patterns = detectPatterns(password)

  return [
    {
      id: 'length',
      label: 'At least 12 characters',
      passed: password.length >= 12,
      detail: `${password.length} / 12`,
    },
    {
      id: 'uppercase',
      label: 'Contains uppercase letter',
      passed: sets.uppercase,
    },
    {
      id: 'lowercase',
      label: 'Contains lowercase letter',
      passed: sets.lowercase,
    },
    {
      id: 'number',
      label: 'Contains a number',
      passed: sets.numbers,
    },
    {
      id: 'symbol',
      label: 'Contains a special character',
      passed: sets.symbols,
    },
    {
      id: 'unique',
      label: 'At least 8 unique characters',
      passed: unique >= 8,
      detail: `${unique} unique`,
    },
    {
      id: 'patterns',
      label: 'No predictable patterns',
      passed: patterns.length === 0,
      detail: patterns.length ? `${patterns.length} found` : undefined,
    },
  ]
}

function buildSuggestions(
  password: string,
  rules: RuleResult[],
  patterns: DetectedPattern[],
  entropy: number,
): string[] {
  const suggestions: string[] = []

  if (password.length < 12) {
    suggestions.push(
      `Add ${12 - password.length} more character${12 - password.length === 1 ? '' : 's'} — length beats complexity for brute-force resistance.`,
    )
  } else if (password.length < 16 && entropy < 90) {
    suggestions.push('Push to 16+ characters to stay ahead of GPU cracking rigs.')
  }

  const missing = rules
    .filter((rule) => !rule.passed && ['uppercase', 'lowercase', 'number', 'symbol'].includes(rule.id))
    .map((rule) => rule.id)

  if (missing.length) {
    const names: Record<string, string> = {
      uppercase: 'uppercase letters',
      lowercase: 'lowercase letters',
      number: 'digits',
      symbol: 'symbols',
    }
    suggestions.push(`Mix in ${missing.map((id) => names[id]).join(', ')} to widen the keyspace.`)
  }

  for (const pattern of patterns) {
    suggestions.push(pattern.description)
  }

  if (new Set(password).size < password.length * 0.6 && password.length > 0) {
    suggestions.push('Reduce repeated characters — reuse shrinks the effective search space.')
  }

  if (!suggestions.length) {
    suggestions.push('Strong credential. Store it in a password manager and enable MFA on the account.')
  }

  return suggestions.slice(0, 6)
}

function buildMetrics(analysis: Omit<PasswordAnalysis, 'metrics'>): PasswordMetric[] {
  const { entropy, length, uniqueCharacters, diversity, crackTimes, risk, grade } = analysis
  const offline = crackTimes.find((time) => time.id === 'offline-gpu')

  return [
    {
      id: 'entropy',
      label: 'Entropy',
      value: `${entropy.toFixed(1)} bits`,
      hint: entropy >= 90 ? 'Exceeds NIST guidance' : 'Target 75+ bits',
      ratio: clamp(entropy / 128, 0, 1),
      tone: entropy >= 90 ? 'success' : entropy >= 60 ? 'primary' : entropy >= 40 ? 'warning' : 'danger',
    },
    {
      id: 'length',
      label: 'Length',
      value: `${length} chars`,
      hint: length >= 16 ? 'Excellent length' : 'Aim for 16+',
      ratio: clamp(length / 24, 0, 1),
      tone: length >= 16 ? 'success' : length >= 12 ? 'primary' : length >= 8 ? 'warning' : 'danger',
    },
    {
      id: 'unique',
      label: 'Unique chars',
      value: String(uniqueCharacters),
      hint: `${length ? Math.round((uniqueCharacters / length) * 100) : 0}% of total`,
      ratio: length ? uniqueCharacters / length : 0,
      tone: uniqueCharacters >= 12 ? 'success' : uniqueCharacters >= 8 ? 'primary' : 'warning',
    },
    {
      id: 'diversity',
      label: 'Char diversity',
      value: `${Math.round(diversity * 100)}%`,
      hint: diversity === 1 ? 'All classes present' : 'Add missing classes',
      ratio: diversity,
      tone: diversity === 1 ? 'success' : diversity >= 0.75 ? 'primary' : 'warning',
    },
    {
      id: 'crack-time',
      label: 'GPU crack time',
      value: offline?.human ?? '—',
      hint: '8× RTX 4090 · SHA-256',
      tone: (offline?.seconds ?? 0) > 3.15e9 ? 'success' : (offline?.seconds ?? 0) > 31_536_000 ? 'primary' : 'danger',
    },
    {
      id: 'keyspace',
      label: 'Keyspace',
      value: entropy > 0 ? `2^${entropy.toFixed(0)}` : '—',
      hint: entropy > 0 ? `${formatCompactNumber(entropy / 8)} bytes of randomness` : 'Awaiting input',
      ratio: clamp(entropy / 128, 0, 1),
      tone: 'neutral',
    },
    {
      id: 'grade',
      label: 'Grade',
      value: grade,
      hint: `Risk level: ${risk}`,
      tone: ['S', 'A'].includes(grade) ? 'success' : ['B', 'C'].includes(grade) ? 'primary' : 'danger',
    },
  ]
}

/**
 * Analyse a password end to end.
 *
 * @param password    The candidate secret (never leaves the client).
 * @param guessesLog10 Optional zxcvbn estimate; when supplied it caps the
 *                     score so dictionary-heavy passwords cannot score high
 *                     purely on length.
 */
export function analyzePassword(password: string, guessesLog10?: number): PasswordAnalysis {
  if (!password) return EMPTY_ANALYSIS

  const characterSets = getCharacterSets(password)
  const poolSize = getPoolSize(characterSets)
  const entropy = getEffectiveEntropy(password, poolSize)
  const patterns = detectPatterns(password)
  const uniqueCharacters = new Set(password).size
  const diversity = getDiversity(characterSets)

  // Base score maps 0-100 bits of entropy onto 0-82 points.
  let score = clamp((entropy / 100) * 82, 0, 82)

  // Reward class coverage and unique-character density.
  score += diversity * 10
  score += clamp(uniqueCharacters / 16, 0, 1) * 8

  // Apply pattern penalties.
  for (const pattern of patterns) {
    score -= SEVERITY_PENALTY[pattern.severity]
  }

  // Hard ceilings for short passwords, regardless of composition.
  if (password.length < 8) score = Math.min(score, 30)
  if (password.length < 6) score = Math.min(score, 16)

  // Blend in the zxcvbn estimate when available (log10 guesses → 0-100).
  if (typeof guessesLog10 === 'number') {
    const zxcvbnScore = clamp((guessesLog10 / 14) * 100, 0, 100)
    score = score * 0.55 + zxcvbnScore * 0.45
  }

  score = Math.round(clamp(score, 0, 100))

  const guesses = entropyToGuesses(entropy)
  const crackTimes = getCrackTimes(
    typeof guessesLog10 === 'number' ? Math.min(guesses, Math.pow(10, guessesLog10)) : guesses,
  )
  const rules = buildRules(password)

  const base: Omit<PasswordAnalysis, 'metrics'> = {
    password,
    length: password.length,
    entropy,
    poolSize,
    uniqueCharacters,
    diversity,
    score,
    level: getLevel(score),
    grade: getGrade(score),
    risk: getRisk(score),
    characterSets,
    patterns,
    crackTimes,
    rules,
    suggestions: buildSuggestions(password, rules, patterns, entropy),
    guessesLog10,
  }

  return { ...base, metrics: buildMetrics(base) }
}
