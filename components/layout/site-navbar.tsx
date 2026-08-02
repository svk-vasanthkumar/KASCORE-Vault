'use client'

import { Code2, Keyboard, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/components/layout/brand-logo'
import { SoundToggle } from '@/components/layout/sound-toggle'
import { StatusIndicator } from '@/components/cyber/status-indicator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#analyzer', label: 'Analyzer' },
  { href: '#intelligence', label: 'Intelligence' },
  { href: '#generator', label: 'Generator' },
  { href: '#playbook', label: 'Playbook' },
] as const

interface SiteNavbarProps {
  onOpenShortcuts: () => void
}

/** Sticky, blur-backed navigation with a responsive mobile sheet. */
export function SiteNavbar({ onOpenShortcuts }: SiteNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-primary/10 bg-background/75 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <a href="#top" className="shrink-0 rounded-lg" aria-label="KASCORE Vault home">
          <BrandLogo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <StatusIndicator className="hidden sm:inline-flex" />

          <div className="hidden items-center gap-1 sm:flex">
            <SoundToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="View keyboard shortcuts"
              className="text-muted-foreground hover:text-primary"
              onClick={onOpenShortcuts}
            >
              <Keyboard className="size-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="hidden border-primary/25 bg-primary/5 text-foreground hover:bg-primary/12 hover:text-primary sm:inline-flex"
            nativeButton={false}
            render={
              <a href="https://www.linkedin.com/company/kascore/" target="_blank" rel="noreferrer noopener">
                <Code2 className="size-3.5" />
                LinkedIn
              </a>
            }
          />

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={cn(
          'overflow-hidden border-t border-primary/10 bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:hidden',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2 flex items-center justify-between gap-2 border-t border-primary/10 px-3 pt-4">
            <StatusIndicator />
            <div className="flex items-center gap-1">
              <SoundToggle />
              <Button
                variant="ghost"
                size="icon"
                aria-label="View keyboard shortcuts"
                onClick={() => {
                  setMenuOpen(false)
                  onOpenShortcuts()
                }}
              >
                <Keyboard className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="KASCORE LinkedIn"
                nativeButton={false}
                render={
                  <a href="https://www.linkedin.com/company/kascore/" target="_blank" rel="noreferrer noopener">
                    <Code2 className="size-4" />
                  </a>
                }
              />
            </div>
          </li>
        </ul>
      </div>
    </header>
  )
}
