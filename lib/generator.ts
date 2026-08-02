/**
 * Password generation strategies. All randomness comes from the Web Crypto
 * CSPRNG via `utils/crypto` — never `Math.random`.
 */

import {
  AMBIGUOUS_CHARACTERS,
  CHARSETS,
  MEMORABLE_SYLLABLES,
  PASSPHRASE_WORDS,
} from '@/constants/password'
import type { GeneratorOptions } from '@/types/password'
import { secureRandomInt, secureRandomItem, secureShuffle } from '@/utils/crypto'

export const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  mode: 'random',
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
  words: 4,
  separator: '-',
}

function filterAmbiguous(pool: string, exclude: boolean): string {
  if (!exclude) return pool
  return pool
    .split('')
    .filter((char) => !AMBIGUOUS_CHARACTERS.includes(char))
    .join('')
}

/** Build the active alphabet from the toggled character classes. */
function buildPool(options: GeneratorOptions): { pool: string; required: string[] } {
  const groups: string[] = []

  if (options.lowercase) groups.push(filterAmbiguous(CHARSETS.lowercase, options.excludeAmbiguous))
  if (options.uppercase) groups.push(filterAmbiguous(CHARSETS.uppercase, options.excludeAmbiguous))
  if (options.numbers) groups.push(filterAmbiguous(CHARSETS.numbers, options.excludeAmbiguous))
  if (options.symbols) groups.push(filterAmbiguous(CHARSETS.symbols, options.excludeAmbiguous))

  // Always fall back to lowercase so generation can never fail.
  if (!groups.length) groups.push(CHARSETS.lowercase)

  return {
    pool: groups.join(''),
    required: groups.map((group) => secureRandomItem(group.split(''))),
  }
}

/** Fully random string that guarantees one glyph from every enabled class. */
function generateRandom(options: GeneratorOptions): string {
  const { pool, required } = buildPool(options)
  const length = Math.max(options.length, required.length)
  const characters = [...required]

  while (characters.length < length) {
    characters.push(pool[secureRandomInt(pool.length)])
  }

  return secureShuffle(characters).join('')
}

/** Pronounceable consonant-vowel password, padded with digits/symbols. */
function generateMemorable(options: GeneratorOptions): string {
  const { consonants, vowels } = MEMORABLE_SYLLABLES
  let output = ''

  while (output.length < options.length - 2) {
    const syllable = `${secureRandomItem(consonants)}${secureRandomItem(vowels)}`
    output += output.length === 0 ? syllable.toUpperCase().slice(0, 1) + syllable.slice(1) : syllable
  }

  if (options.numbers) output += String(secureRandomInt(90) + 10)
  if (options.symbols) output += secureRandomItem(CHARSETS.symbols.split(''))

  return output.slice(0, Math.max(options.length, 8))
}

/** Diceware-style passphrase: `Vortex-Kernel-8-Saffron`. */
function generatePassphrase(options: GeneratorOptions): string {
  const words = Array.from({ length: Math.max(options.words, 3) }, () => {
    const word = secureRandomItem(PASSPHRASE_WORDS)
    return options.uppercase ? word.charAt(0).toUpperCase() + word.slice(1) : word
  })

  if (options.numbers) {
    words.splice(secureRandomInt(words.length + 1), 0, String(secureRandomInt(900) + 100))
  }
  if (options.symbols) {
    words[words.length - 1] += secureRandomItem(CHARSETS.symbols.split(''))
  }

  return words.join(options.separator || '-')
}

/** Numeric-only PIN, useful for device unlock comparisons. */
function generatePin(options: GeneratorOptions): string {
  return Array.from({ length: Math.max(4, Math.min(options.length, 12)) }, () =>
    String(secureRandomInt(10)),
  ).join('')
}

/** Dispatch to the strategy selected in the generator options. */
export function generatePassword(options: GeneratorOptions): string {
  switch (options.mode) {
    case 'memorable':
      return generateMemorable(options)
    case 'passphrase':
      return generatePassphrase(options)
    case 'pin':
      return generatePin(options)
    case 'random':
    default:
      return generateRandom(options)
  }
}
