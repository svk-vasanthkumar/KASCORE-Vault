"use client"

import { motion } from "framer-motion"
import { ChevronDown, Shield, Zap, Eye } from "lucide-react"
import { GlitchText } from "@/components/animations/glitch-text"
import { Typewriter } from "@/components/animations/typewriter"
import { Reveal } from "@/components/animations/reveal"

const STATS = [
  { icon: Shield, value: "256-bit", label: "Entropy Analysis" },
  { icon: Eye, value: "HIBP", label: "Breach Detection" },
  { icon: Zap, value: "Real-time", label: "AI Scoring" },
]

export function HeroSection() {
  const scrollDown = () => {
    document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      {/* Badge */}
      <Reveal delay={0.1}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary/80 tracking-wider">
            ENTERPRISE PASSWORD SECURITY
          </span>
        </div>
      </Reveal>

      {/* Main headline */}
      <Reveal delay={0.2}>
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tight text-balance">
          <GlitchText className="text-primary">KASCORE</GlitchText>
          <span className="text-foreground">VAULT</span>
        </h1>
      </Reveal>

      {/* Subtitle typewriter */}
      <Reveal delay={0.35}>
        <div className="text-base md:text-lg text-muted-foreground/70 font-mono mb-2 h-7">
          <Typewriter
            phrases={[
              "Enterprise Password Analyzer",
              "Breach Detection Engine",
              "Entropy Calculator",
              "Zero-Knowledge Security",
            ]}
          />
        </div>
      </Reveal>

      {/* Description */}
      <Reveal delay={0.5}>
        <p className="text-sm text-muted-foreground/50 max-w-lg mx-auto mb-10 leading-relaxed text-balance">
          Enterprise-grade password analysis with real-time entropy scoring, pattern forensics, and
          Have I Been Pwned integration. Everything runs securely on your device.
        </p>
      </Reveal>

      {/* CTA buttons */}
      <Reveal delay={0.6}>
        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <button
            onClick={scrollDown}
            className="px-6 py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary font-mono text-sm font-bold uppercase tracking-widest hover:bg-primary/30 hover:border-primary/60 transition-all duration-200"
          >
            Analyze Password
          </button>
          <button
            onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 rounded-lg bg-muted/10 border border-muted/20 text-muted-foreground font-mono text-sm uppercase tracking-widest hover:border-muted/40 hover:text-foreground transition-all duration-200"
          >
            Generate Secure Password
          </button>
        </div>
      </Reveal>

      {/* Stats row */}
      <Reveal delay={0.7}>
        <div className="flex gap-8 md:gap-16">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon size={12} className="text-primary/60" />
                <span className="text-sm font-bold font-mono text-primary">{value}</span>
              </div>
              <p className="text-[10px] text-muted-foreground/40 font-mono tracking-wider uppercase">{label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Scroll cue */}
      <motion.button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        aria-label="Scroll to password analyzer"
      >
        <ChevronDown size={24} />
      </motion.button>
    </section>
  )
}
