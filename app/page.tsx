'use client'

import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { CyberBackground } from '@/components/cyber/cyber-background'
import { ShortcutsDialog } from '@/components/layout/shortcuts-dialog'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteNavbar } from '@/components/layout/site-navbar'
import { AnalyzerPanel } from '@/components/sections/analyzer-panel'
import { BootScreen } from '@/components/sections/boot-screen'
import { FeaturesSection } from '@/components/sections/features-section'
import { GeneratorSection } from '@/components/sections/generator-section'
import { HeroSection } from '@/components/sections/hero-section'
import { useClipboard } from '@/hooks/use-clipboard'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useSound } from '@/hooks/use-sound'
import { DEFAULT_GENERATOR_OPTIONS, generatePassword } from '@/lib/generator'

/**
 * The KASCORE Vault console. Owns the password shared between the analyzer and
 * generator, plus global keyboard shortcuts and the shortcuts dialog.
 */
export default function Page() {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const { copy } = useClipboard()
  const { play } = useSound()

  const handleGenerate = useCallback(() => {
    const next = generatePassword(DEFAULT_GENERATOR_OPTIONS)
    setPassword(next)
    setVisible(true)
    play('generate')
    toast.success('Secure password generated')
  }, [play])

  const handleCopy = useCallback(() => {
    if (!password) return
    void copy(password).then((ok) => {
      if (ok) {
        play('success')
        toast.success('Password copied to clipboard')
      }
    })
  }, [password, copy, play])

  const handleUseGenerated = useCallback((value: string) => {
    setPassword(value)
    setVisible(true)
    document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const shortcuts = useMemo(
    () => ({
      g: handleGenerate,
      c: handleCopy,
      x: () => setPassword(''),
      v: () => setVisible((prev) => !prev),
      '?': () => setShortcutsOpen(true),
    }),
    [handleGenerate, handleCopy],
  )

  useKeyboardShortcuts(shortcuts)

  return (
    <>
      <BootScreen />
      <CyberBackground />

      <div className="relative flex min-h-screen flex-col">
        <SiteNavbar onOpenShortcuts={() => setShortcutsOpen(true)} />

        <main id="main" className="flex-1">
          <HeroSection />
          <AnalyzerPanel
            password={password}
            onChange={setPassword}
            visible={visible}
            onToggleVisible={() => setVisible((prev) => !prev)}
            onGenerate={handleGenerate}
          />
          <GeneratorSection onUse={handleUseGenerated} />
          <FeaturesSection />
        </main>

        <SiteFooter />
      </div>

      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  )
}
