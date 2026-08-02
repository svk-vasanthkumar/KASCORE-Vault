import { Code2, Lock, ShieldCheck } from 'lucide-react'

import { BrandLogo } from '@/components/layout/brand-logo'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Analyzer', href: '#analyzer' },
      { label: 'Intelligence', href: '#intelligence' },
      { label: 'Generator', href: '#generator' },
      { label: 'Playbook', href: '#playbook' },
    ],
  },
  {
    title: 'Standards',
    links: [
      { label: 'NIST SP 800-63B', href: 'https://pages.nist.gov/800-63-3/sp800-63b.html' },
      { label: 'OWASP ASVS', href: 'https://owasp.org/www-project-application-security-verification-standard/' },
      { label: 'zxcvbn research', href: 'https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/wheeler' },
      { label: 'Have I Been Pwned', href: 'https://haveibeenpwned.com/Passwords' },
    ],
  },
] as const

/** Site footer with credibility links and a restated privacy guarantee. */
export function SiteFooter() {
  return (
    <footer className="relative border-t border-primary/10 bg-card/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <BrandLogo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              KASCORE Vault is an enterprise-grade password analyzer. Entropy analysis, pattern detection,
              and breach lookups run entirely in your browser with zero knowledge architecture.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/8 px-3 py-1 text-xs font-medium text-success">
                <Lock className="size-3" aria-hidden="true" />
                Client-side only
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                <ShieldCheck className="size-3" aria-hidden="true" />
                k-anonymity breach API
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-primary/70">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-primary/10 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs text-muted-foreground">
              © 2026 KASCORE. All Rights Reserved. · Built with ❤️ by KASCORE
            </p>
            <p className="font-mono text-xs text-muted-foreground/60">
              {'// Zero-knowledge architecture — no password ever leaves your device'}
            </p>
          </div>
          <a
            href="https://www.linkedin.com/company/kascore/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
            aria-label="KASCORE on LinkedIn"
          >
            <Code2 className="size-3.5" aria-hidden="true" />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
