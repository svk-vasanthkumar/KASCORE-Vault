"use client"

import { SectionHeading } from "@/components/cyber/section-heading"
import { GlassCard } from "@/components/cyber/glass-card"
import { PasswordGenerator } from "@/components/generator/password-generator"
import { Reveal } from "@/components/animations/reveal"
import { Lock, ShieldCheck, Key } from "lucide-react"

interface GeneratorSectionProps {
  onUse: (password: string) => void
}

const TIPS = [
  {
    icon: Lock,
    title: "Use 16+ Characters",
    body: "Every additional character exponentially increases resistance to brute force attacks.",
  },
  {
    icon: ShieldCheck,
    title: "Mix Character Classes",
    body: "Combining uppercase, lowercase, numbers, and symbols dramatically expands the keyspace.",
  },
  {
    icon: Key,
    title: "Unique Per Account",
    body: "Never reuse passwords. A breach of one service exposes all accounts using the same credential.",
  },
]

export function GeneratorSection({ onUse }: GeneratorSectionProps) {
  return (
    <section id="generator" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="03 / GENERATOR"
            title="Password Generator"
            description="Create cryptographically secure passwords using the Web Crypto API"
          />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Generator panel */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <GlassCard>
              <div className="p-5">
                <PasswordGenerator onUse={onUse} />
              </div>
            </GlassCard>
          </Reveal>

          {/* Tips panel */}
          <div className="lg:col-span-2 space-y-4">
            {TIPS.map((tip, index) => {
              const Icon = tip.icon
              return (
                <Reveal key={tip.title} delay={0.15 + index * 0.1}>
                  <GlassCard>
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 shrink-0">
                        <Icon size={16} className="text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground/90 mb-1">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground/60 leading-relaxed">{tip.body}</p>
                      </div>
                    </div>
                  </GlassCard>
                </Reveal>
              )
            })}

            {/* Entropy note */}
            <Reveal delay={0.45}>
              <div className="border border-dashed border-muted/20 rounded-lg p-4">
                <p className="text-[10px] font-mono text-muted-foreground/40 leading-relaxed">
                  <span className="text-cyan-400/60">// NOTE:</span> All passwords are generated
                  client-side using{" "}
                  <span className="text-cyan-400/60">window.crypto.getRandomValues()</span> — a
                  cryptographically secure PRNG. No passwords are ever transmitted or stored.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
