'use client'

import { Volume2, VolumeX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSound } from '@/hooks/use-sound'

/** Enables the synthesised UI feedback tones. */
export function SoundToggle() {
  const { enabled, toggle, play } = useSound()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={enabled ? 'Disable interface sounds' : 'Enable interface sounds'}
      aria-pressed={enabled}
      className="text-muted-foreground hover:text-primary"
      onClick={() => {
        toggle()
        if (!enabled) window.setTimeout(() => play('success'), 60)
      }}
    >
      {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
    </Button>
  )
}
