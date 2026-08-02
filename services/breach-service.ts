/**
 * Have I Been Pwned "Pwned Passwords" lookup using k-Anonymity.
 *
 * Protocol:
 *  1. SHA-1 the password locally in the browser.
 *  2. Send ONLY the first 5 hex characters of the digest to the range API.
 *  3. The API returns every suffix sharing that prefix (~800 rows).
 *  4. We match the remaining 35 characters locally.
 *
 * The full hash — and therefore the password — never leaves the device.
 */

import type { BreachResult } from '@/types/password'
import { sha1Hex } from '@/utils/crypto'

const RANGE_ENDPOINT = '/api/breach'

/** Parse the `SUFFIX:COUNT` lines returned by the range endpoint. */
function findSuffixCount(body: string, suffix: string): number {
  for (const line of body.split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    if (line.slice(0, separator).trim().toUpperCase() === suffix) {
      return Number.parseInt(line.slice(separator + 1).trim(), 10) || 0
    }
  }
  return 0
}

export async function checkPasswordBreach(
  password: string,
  signal?: AbortSignal,
): Promise<BreachResult> {
  if (!password) {
    return { state: 'idle', count: 0 }
  }

  const hash = await sha1Hex(password)
  const prefix = hash.slice(0, 5)
  const suffix = hash.slice(5)

  const response = await fetch(`${RANGE_ENDPOINT}?prefix=${prefix}`, {
    signal,
    headers: { Accept: 'text/plain' },
  })

  if (!response.ok) {
    return {
      state: 'error',
      count: 0,
      prefix,
      message: `Breach service returned ${response.status}`,
    }
  }

  const body = await response.text()
  const count = findSuffixCount(body, suffix)

  return {
    state: count > 0 ? 'compromised' : 'safe',
    count,
    prefix,
    suffix: `${suffix.slice(0, 6)}…`,
    checkedAt: Date.now(),
  }
}
