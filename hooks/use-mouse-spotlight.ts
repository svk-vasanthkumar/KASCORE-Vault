'use client'

import { useCallback, useRef } from 'react'

/**
 * Tracks the pointer inside an element and writes its position to CSS custom
 * properties (`--mx`, `--my`). Writing to CSS vars avoids React re-renders on
 * every mouse move, so the hover glow stays at 60fps.
 */
export function useMouseSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)

  const onPointerMove = useCallback((event: React.PointerEvent<T>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    node.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }, [])

  const onPointerLeave = useCallback(() => {
    const node = ref.current
    if (!node) return
    node.style.setProperty('--mx', '50%')
    node.style.setProperty('--my', '50%')
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
