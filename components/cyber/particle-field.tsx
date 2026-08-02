'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const DENSITY = 12_000 // one particle per N square pixels
const MAX_PARTICLES = 90
const LINK_DISTANCE = 130

/**
 * Canvas particle mesh with proximity linking — the "network" motif used by
 * security vendors. Pauses when off-screen and respects reduced-motion.
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frame = 0
    let running = true

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const seed = () => {
      const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / DENSITY))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.6 + 0.6,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = 'rgba(0, 245, 255, 0.55)'
        context.fill()
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.hypot(dx, dy)
          if (distance > LINK_DISTANCE) continue

          context.beginPath()
          context.moveTo(particles[i].x, particles[i].y)
          context.lineTo(particles[j].x, particles[j].y)
          context.strokeStyle = `rgba(0, 245, 255, ${0.16 * (1 - distance / LINK_DISTANCE)})`
          context.lineWidth = 0.7
          context.stroke()
        }
      }

      if (running) frame = requestAnimationFrame(draw)
    }

    resize()
    frame = requestAnimationFrame(draw)

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    // Stop the loop when the canvas scrolls out of view.
    const visibility = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running) frame = requestAnimationFrame(draw)
      else cancelAnimationFrame(frame)
    })
    visibility.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      visibility.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
