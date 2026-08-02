'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface TypewriterProps {
  /** Phrases cycled in order, forever. */
  phrases: readonly string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  holdDuration?: number
}

/** Terminal-style typing/deleting loop with a blinking block caret. */
export function Typewriter({
  phrases,
  className,
  typeSpeed = 55,
  deleteSpeed = 28,
  holdDuration = 1800,
}: TypewriterProps) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[index % phrases.length]

    if (!isDeleting && text === phrase) {
      const timer = window.setTimeout(() => setIsDeleting(true), holdDuration)
      return () => window.clearTimeout(timer)
    }

    if (isDeleting && text === '') {
      setIsDeleting(false)
      setIndex((prev) => (prev + 1) % phrases.length)
      return
    }

    const timer = window.setTimeout(
      () => {
        setText((prev) =>
          isDeleting ? phrase.slice(0, prev.length - 1) : phrase.slice(0, prev.length + 1),
        )
      },
      isDeleting ? deleteSpeed : typeSpeed,
    )

    return () => window.clearTimeout(timer)
  }, [text, isDeleting, index, phrases, typeSpeed, deleteSpeed, holdDuration])

  return (
    <span className={cn('font-mono', className)} aria-live="polite">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.12em] bg-primary animate-caret" />
    </span>
  )
}
