'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
}

interface RevealProps {
  children: ReactNode
  className?: string
  /** Slide-in direction. */
  direction?: Direction
  delay?: number
  /** Adds a blur-in for a "materialising" feel. */
  blur?: boolean
}

/** Scroll-triggered entrance animation with a blur-reveal option. */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  blur = true,
}: RevealProps) {
  const prefersReduced = useReducedMotion()
  const offset = OFFSETS[direction]

  // IMPORTANT: render the same element tree on the server and client regardless
  // of the reduced-motion preference. `useReducedMotion()` is `null` on the
  // server, so branching to a plain <div> here would produce different markup
  // on a reduced-motion client, causing a hydration mismatch that React does
  // not patch up — leaving the server's `opacity: 0` style stuck on the DOM and
  // the whole page body invisible. Instead we keep one motion.div and simply
  // make the reveal instant when reduced motion is requested.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y, filter: blur ? 'blur(10px)' : 'none' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  )
}
