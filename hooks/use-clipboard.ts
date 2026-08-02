'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copy-to-clipboard with a transient `copied` flag for success animations.
 * Falls back to a hidden textarea when the async Clipboard API is blocked.
 */
export function useClipboard(resetAfter = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const copy = useCallback(
    async (value: string) => {
      if (!value) return false

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value)
        } else {
          const textarea = document.createElement('textarea')
          textarea.value = value
          textarea.setAttribute('readonly', '')
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
        }

        setCopied(true)
        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), resetAfter)
        return true
      } catch {
        return false
      }
    },
    [resetAfter],
  )

  return { copied, copy }
}
