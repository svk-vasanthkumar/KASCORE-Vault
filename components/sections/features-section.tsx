"use client"

import { Shield, Zap, Eye, Lock, BarChart3, RefreshCw } from "lucide-react"
import { GlassCard } from "@/components/cyber/glass-card"
import { SectionHeading } from "@/components/cyber/section-heading"
import { Reveal } from "@/components/animations/reveal"

const FEATURES = [
  {
    icon: BarChart3,
    title: "Entropy Analysis",
    description:
      "Calculate true Shannon entropy and bit strength using cryptographic analysis, giving you an accurate measure of randomness.",
    tag: "CRYPTO",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Eye,
    title: "Pattern Detection",
    description:
      "Identify keyboard walks, common substitutions, dictionary words, repeated sequences, and over 40 known vulnerability patterns.",
    tag: "AI",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Breach Database",
    description:
      "Check your password against the Have I Been Pwned database of 10+ billion compromised passwords using k-anonymity for privacy.",
    tag: "HIBP",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Zap,
    title: "Crack Time Estimation",
    description:
      "Estimate time-to-crack across multiple attack scenarios: online throttled, offline slow hash, and modern GPU brute force.",
    tag: "ATTACK",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Lock,
    title: "Secure Generator",
    description:
      "Generate cryptographically random passwords using Web Crypto API. Supports random, passphrase, and PIN modes.",
    tag: "GEN",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: RefreshCw,
    title: "Real-time Scoring",
    description:
      "Live analysis as you type with debounced updates, animated metrics, and instant feedback on every character change.",
    tag: "LIVE",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="02 / FEATURES"
            title="Core Capabilities"
            description="A comprehensive suite of cryptographic tools for serious security analysis"
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Reveal key={feature.title} delay={index * 0.07}>
                <GlassCard className="h-full group hover:border-white/10 transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${feature.bg}`}>
                        <Icon size={18} className={feature.color} />
                      </div>
                      <span className={`text-[9px] font-mono font-bold tracking-widest ${feature.color} opacity-60`}>
                        {feature.tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground/90 group-hover:text-foreground transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
