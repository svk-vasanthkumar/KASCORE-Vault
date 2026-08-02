/**
 * Shared domain types for password analysis, generation and breach lookups.
 */

export type StrengthLevel = 'empty' | 'weak' | 'fair' | 'medium' | 'strong' | 'very-strong'

export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'minimal'

export type Grade = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export interface CharacterSets {
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
  /** Non-ASCII / extended unicode characters. */
  extended: boolean
}

export type PatternType =
  | 'common-password'
  | 'dictionary'
  | 'sequential'
  | 'repeated'
  | 'keyboard'
  | 'date'
  | 'leetspeak'

export interface DetectedPattern {
  type: PatternType
  label: string
  /** The offending substring found inside the password. */
  match: string
  severity: 'low' | 'medium' | 'high'
  description: string
}

export interface CrackTimeEstimate {
  id: string
  label: string
  description: string
  /** Guesses per second the attacker model can perform. */
  hashesPerSecond: number
  seconds: number
  human: string
}

export interface RuleResult {
  id: string
  label: string
  passed: boolean
  /** Optional detail such as "12 / 8 characters". */
  detail?: string
}

export interface PasswordMetric {
  id: string
  label: string
  value: string
  hint: string
  /** 0-1 fill level used for the mini meter, when relevant. */
  ratio?: number
  tone: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}

export interface PasswordAnalysis {
  password: string
  length: number
  /** Shannon-style entropy in bits, derived from effective pool size. */
  entropy: number
  poolSize: number
  uniqueCharacters: number
  /** 0-1 measure of character-class coverage. */
  diversity: number
  score: number
  level: StrengthLevel
  grade: Grade
  risk: RiskLevel
  characterSets: CharacterSets
  patterns: DetectedPattern[]
  crackTimes: CrackTimeEstimate[]
  rules: RuleResult[]
  metrics: PasswordMetric[]
  suggestions: string[]
  /** zxcvbn guesses (log10) when the estimator has loaded. */
  guessesLog10?: number
}

export type BreachState = 'idle' | 'checking' | 'safe' | 'compromised' | 'error'

export interface BreachResult {
  state: BreachState
  count: number
  /** Prefix sent to the range API — proof no full hash left the device. */
  prefix?: string
  suffix?: string
  checkedAt?: number
  message?: string
}

export type GeneratorMode = 'random' | 'memorable' | 'passphrase' | 'pin'

export interface GeneratorOptions {
  mode: GeneratorMode
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
  words: number
  separator: string
}
