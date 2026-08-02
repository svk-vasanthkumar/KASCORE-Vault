'use client'

import { useEffect } from 'react'

type ShortcutMap = Record<string, () => void>

/**
 * Global single-key shortcuts. Handlers are skipped while the user is typing
 * in a field so the analyzer input keeps working normally.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return

      const action = shortcuts[event.key.toLowerCase()] ?? shortcuts[event.key]
      if (action) {
        event.preventDefault()
        action()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts, enabled])
}
