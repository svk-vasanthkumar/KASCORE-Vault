/**
 * Cryptographic primitives built on the Web Crypto API.
 * Everything here runs locally in the browser — no password material is
 * ever serialised to the network by these helpers.
 */

/** SHA-1 hex digest, uppercase. Required by the HIBP range endpoint. */
export async function sha1Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-1', bytes)
  return bufferToHex(digest).toUpperCase()
}

export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Uniformly random integer in [0, max) using rejection sampling so the
 * modulo bias present in `random % max` is eliminated.
 */
export function secureRandomInt(max: number): number {
  if (max <= 0) throw new Error('max must be greater than zero')
  const limit = Math.floor(0xffffffff / max) * max
  const buffer = new Uint32Array(1)
  let value = 0
  do {
    crypto.getRandomValues(buffer)
    value = buffer[0]
  } while (value >= limit)
  return value % max
}

/** Pick a single random element from a non-empty list. */
export function secureRandomItem<T>(items: readonly T[]): T {
  return items[secureRandomInt(items.length)]
}

/** Fisher-Yates shuffle driven by the CSPRNG. */
export function secureShuffle<T>(items: T[]): T[] {
  const output = [...items]
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1)
    ;[output[i], output[j]] = [output[j], output[i]]
  }
  return output
}
