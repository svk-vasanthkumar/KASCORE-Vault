import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Toaster } from 'sonner'

import { SoundProvider } from '@/hooks/use-sound'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'KASCORE Vault – Password Security Analyzer',
    template: '%s · KASCORE Vault',
  },
  description:
    'Enterprise-grade password security analysis powered by KASCORE. Measure entropy, estimate crack time, detect patterns, and run privacy-preserving breach checks — nothing ever leaves your device.',
  keywords: [
    'password strength analyzer',
    'password security',
    'entropy calculator',
    'password generator',
    'breach check',
    'have i been pwned',
    'cybersecurity',
    'KASCORE',
  ],
  authors: [{ name: 'KASCORE' }],
  generator: 'v0.app',
  openGraph: {
    title: 'KASCORE Vault – Password Security Analyzer',
    description:
      'Enterprise-grade password analysis with real-time entropy scoring, pattern detection, and breach detection — entirely in your browser.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#07101d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <SoundProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'color-mix(in oklch, var(--card) 92%, transparent)',
                border: '1px solid color-mix(in oklch, var(--primary) 20%, transparent)',
                color: 'var(--foreground)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </SoundProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
