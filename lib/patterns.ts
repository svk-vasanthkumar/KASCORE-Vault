/**
 * Heuristic pattern detectors. These model the cheap, high-yield rules a
 * real cracking rig applies before falling back to brute force.
 */

import {
  COMMON_PASSWORDS,
  DICTIONARY_WORDS,
  KEYBOARD_ROWS,
  LEET_MAP,
} from '@/constants/password'
import type { DetectedPattern } from '@/types/password'

/** Normalise leetspeak substitutions so `P@ssw0rd` matches `password`. */
export function unleet(value: string): string {
  return value
    .toLowerCase()
    .split('')
    .map((char) => LEET_MAP[char] ?? char)
    .join('')
}

function detectCommonPassword(password: string): DetectedPattern | null {
  const lower = password.toLowerCase()
  const normalised = unleet(password)

  const exact = COMMON_PASSWORDS.find((entry) => entry === lower || entry === normalised)
  if (exact) {
    return {
      type: 'common-password',
      label: 'Known leaked password',
      match: password,
      severity: 'high',
      description: `"${exact}" appears in the most-used credential lists and is cracked instantly.`,
    }
  }

  // Substring match: "password123" still inherits nearly all of the risk.
  const embedded = COMMON_PASSWORDS.find(
    (entry) => entry.length >= 5 && (lower.includes(entry) || normalised.includes(entry)),
  )
  if (embedded) {
    return {
      type: 'common-password',
      label: 'Contains a leaked password',
      match: embedded,
      severity: 'high',
      description: `The base word "${embedded}" is in every attacker wordlist — suffixes add almost no cost.`,
    }
  }

  return null
}

function detectDictionaryWord(password: string): DetectedPattern | null {
  const normalised = unleet(password)
  const found = DICTIONARY_WORDS.find((word) => word.length >= 4 && normalised.includes(word))
  if (!found) return null

  return {
    type: 'dictionary',
    label: 'Dictionary word',
    match: found,
    severity: 'medium',
    description: `"${found}" is a common word; dictionary attacks try it with mangling rules first.`,
  }
}

function detectLeetspeak(password: string): DetectedPattern | null {
  const substituted = password.split('').filter((char) => char in LEET_MAP).length
  if (substituted === 0) return null

  const normalised = unleet(password)
  const hidesWord = [...COMMON_PASSWORDS, ...DICTIONARY_WORDS].some(
    (word) => word.length >= 4 && normalised.includes(word),
  )
  if (!hidesWord) return null

  return {
    type: 'leetspeak',
    label: 'Predictable character swaps',
    match: password.split('').filter((char) => char in LEET_MAP).join(''),
    severity: 'medium',
    description: 'Swaps like a→@ and o→0 are built into standard cracking rulesets.',
  }
}

function detectSequential(password: string): DetectedPattern | null {
  const lower = password.toLowerCase()
  let run = 1
  let best = ''

  for (let i = 1; i < lower.length; i += 1) {
    const delta = lower.charCodeAt(i) - lower.charCodeAt(i - 1)
    if (delta === 1 || delta === -1) {
      run += 1
      if (run >= 3 && run > best.length) best = lower.slice(i - run + 1, i + 1)
    } else {
      run = 1
    }
  }

  if (!best) return null

  return {
    type: 'sequential',
    label: 'Sequential run',
    match: best,
    severity: best.length >= 4 ? 'high' : 'medium',
    description: `"${best}" is a straight run through the alphabet or number line.`,
  }
}

function detectRepeated(password: string): DetectedPattern | null {
  // Same character three or more times, e.g. "aaa".
  const charRun = /(.)\1{2,}/.exec(password)
  if (charRun) {
    return {
      type: 'repeated',
      label: 'Repeated character',
      match: charRun[0],
      severity: 'medium',
      description: `"${charRun[0]}" collapses to a single guess for a repetition-aware attacker.`,
    }
  }

  // Repeated multi-character block, e.g. "abcabcabc".
  const blockRun = /(.{2,4})\1{1,}/.exec(password)
  if (blockRun) {
    return {
      type: 'repeated',
      label: 'Repeated block',
      match: blockRun[0],
      severity: 'medium',
      description: `The chunk "${blockRun[1]}" repeats, so the real length is much shorter than it looks.`,
    }
  }

  return null
}

function detectKeyboardWalk(password: string): DetectedPattern | null {
  const lower = password.toLowerCase()

  for (const row of KEYBOARD_ROWS) {
    for (let start = 0; start + 3 <= row.length; start += 1) {
      for (let end = row.length; end - start >= 3; end -= 1) {
        const slice = row.slice(start, end)
        const reversed = slice.split('').reverse().join('')
        if (lower.includes(slice) || lower.includes(reversed)) {
          return {
            type: 'keyboard',
            label: 'Keyboard walk',
            match: lower.includes(slice) ? slice : reversed,
            severity: slice.length >= 5 ? 'high' : 'medium',
            description: 'Adjacent-key runs such as "qwerty" or "asdf" are exhausted in seconds.',
          }
        }
      }
    }
  }

  return null
}

function detectDate(password: string): DetectedPattern | null {
  const year = /(19[5-9]\d|20[0-4]\d)/.exec(password)
  if (year) {
    return {
      type: 'date',
      label: 'Year or date',
      match: year[0],
      severity: 'medium',
      description: `Years like ${year[0]} are appended so often that crackers try them by default.`,
    }
  }

  const dmy = /\b(\d{2})[-/.](\d{2})[-/.](\d{2,4})\b/.exec(password)
  if (dmy) {
    return {
      type: 'date',
      label: 'Calendar date',
      match: dmy[0],
      severity: 'high',
      description: 'Birthdays and anniversaries are among the first candidates in targeted attacks.',
    }
  }

  return null
}

const DETECTORS = [
  detectCommonPassword,
  detectDictionaryWord,
  detectLeetspeak,
  detectSequential,
  detectRepeated,
  detectKeyboardWalk,
  detectDate,
] as const

/** Run every detector and return the patterns that matched. */
export function detectPatterns(password: string): DetectedPattern[] {
  if (!password) return []
  return DETECTORS.map((detector) => detector(password)).filter(
    (result): result is DetectedPattern => result !== null,
  )
}
