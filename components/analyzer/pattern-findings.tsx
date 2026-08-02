"use client"

import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import type { DetectedPattern } from "@/types/password"
import { cn } from "@/lib/utils"

interface PatternFindingsProps {
  patterns: DetectedPattern[]
  isEmpty: boolean
}

const severityConfig = {
  high: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    label: "HIGH",
  },
  medium: {
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    label: "MEDIUM",
  },
  low: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    label: "LOW",
  },
}

export function PatternFindings({ patterns, isEmpty }: PatternFindingsProps) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">
          <Info size={18} className="text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground/50 font-mono">AWAITING_INPUT</p>
        <p className="text-xs text-muted-foreground/30">
          Enter a password to detect vulnerability patterns
        </p>
      </div>
    )
  }

  if (patterns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle size={18} className="text-green-400" />
        </div>
        <p className="text-sm text-green-400 font-mono">NO_PATTERNS_DETECTED</p>
        <p className="text-xs text-muted-foreground/50">No known vulnerability patterns found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {patterns.map((pattern, index) => {
        const config = severityConfig[pattern.severity]
        const Icon = config.icon

        return (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
              config.bg,
              config.border
            )}
          >
            <Icon size={14} className={cn("shrink-0 mt-0.5", config.color)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={cn("text-[10px] font-bold font-mono tracking-widest", config.color)}>
                  {config.label}
                </span>
                <span className="text-xs font-medium text-foreground/80">{pattern.label}</span>
              </div>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">{pattern.description}</p>
              {pattern.match && (
                <div className="mt-1.5">
                  <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded text-muted-foreground/60">
                    matched: &quot;{pattern.match}&quot;
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
