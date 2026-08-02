'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

export type SoundName = 'key' | 'success' | 'alert' | 'generate'

interface SoundTone {
  frequency: number
  duration: number
  type: OscillatorType
  gain: number
}

/** Terse synth voices so we ship zero audio assets. */
const TONES: Record<SoundName, SoundTone> = {
  key: { frequency: 880, duration: 0.03, type: 'square', gain: 0.02 },
  success: { frequency: 1320, duration: 0.12, type: 'sine', gain: 0.05 },
  alert: { frequency: 220, duration: 0.18, type: 'sawtooth', gain: 0.04 },
  generate: { frequency: 660, duration: 0.09, type: 'triangle', gain: 0.04 },
}

interface SoundContextValue {
  enabled: boolean
  toggle: () => void
  play: (name: SoundName) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const contextRef = useRef<AudioContext | null>(null)

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled || typeof window === 'undefined') return

      try {
        const AudioContextCtor =
          window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!AudioContextCtor) return

        contextRef.current ??= new AudioContextCtor()
        const ctx = contextRef.current
        if (ctx.state === 'suspended') void ctx.resume()

        const tone = TONES[name]
        const oscillator = ctx.createOscillator()
        const amp = ctx.createGain()

        oscillator.type = tone.type
        oscillator.frequency.value = tone.frequency
        amp.gain.setValueAtTime(tone.gain, ctx.currentTime)
        amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + tone.duration)

        oscillator.connect(amp).connect(ctx.destination)
        oscillator.start()
        oscillator.stop(ctx.currentTime + tone.duration)
      } catch {
        // Audio is a non-critical enhancement — fail silently.
      }
    },
    [enabled],
  )

  const value = useMemo<SoundContextValue>(
    () => ({ enabled, toggle: () => setEnabled((prev) => !prev), play }),
    [enabled, play],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound(): SoundContextValue {
  const context = useContext(SoundContext)
  if (!context) {
    // Allows components to be used outside the provider (e.g. in isolation).
    return { enabled: false, toggle: () => {}, play: () => {} }
  }
  return context
}
