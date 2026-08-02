"use client"

import { Shield, ShieldAlert, ShieldCheck, ShieldX, ShieldOff } from "lucide-react"
import type { StrengthLevel } from "@/types/password"
import { cn } from "@/lib/utils"

interface StrengthMeterProps {
  score: number // 0-100
  level: StrengthLevel
  grade: string
  entropy: number
}

const levelConfig: Record<
  StrengthLevel,
  { color: string; bg: string; icon: typeof Shield; barColor: string; label: string }
> = {
  empty: {
    color: "text-muted-foreground/40",
    bg: "bg-muted/10",
    icon: ShieldOff,
    barColor: "bg-muted/30",
    label: "EMPTY",
  },
  weak: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    icon: ShieldX,
    barColor: "bg-red-500",
    label: "WEAK",
  },
  fair: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    icon: ShieldAlert,
    barColor: "bg-orange-500",
    label: "FAIR",
  },
  medium: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    icon: Shield,
    barColor: "bg-yellow-500",
    label: "MEDIUM",
  },
  strong: {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    icon: ShieldCheck,
    barColor: "bg-cyan-500",
    label: "STRONG",
  },
  "very-strong": {
    color: "text-green-400",
    bg: "bg-green-500/10",
    icon: ShieldCheck,
    barColor: "bg-green-500",
    label: "VERY STRONG",
  },
}

const SEGMENTS = 10

export function StrengthMeter({ score, level, grade, entropy }: StrengthMeterProps) {
  const config = levelConfig[level] ?? levelConfig.empty
  const Icon = config.icon
  const filledSegments = Math.round((score / 100) * SEGMENTS)

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md", config.bg)}>
            <Icon size={16} className={config.color} />
          </div>
          <div>
            <p className={cn("text-sm font-bold font-mono tracking-wider uppercase", config.color)}>
              {config.label}
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-mono">STRENGTH RATING</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("text-2xl font-black font-mono tabular-nums", config.color)}>
            {score}
            <span className="text-sm font-normal text-muted-foreground/50">/100</span>
          </p>
          <p className="text-[10px] text-muted-foreground/40 font-mono">
            {entropy.toFixed(1)} bits &middot; Grade {grade}
          </p>
        </div>
      </div>

      {/* Segmented bar */}
      <div
        className="flex gap-1"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Password strength: ${config.label}`}
      >
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-2 rounded-sm transition-all duration-300",
              i < filledSegments ? cn(config.barColor, "opacity-100") : "bg-muted/20"
            )}
            style={{ transitionDelay: `${i * 30}ms` }}
          />
        ))}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-[9px] font-mono text-muted-foreground/30">
        <span>WEAK</span>
        <span>FAIR</span>
        <span>MEDIUM</span>
        <span>STRONG</span>
        <span>ELITE</span>
      </div>
    </div>
  )
}
