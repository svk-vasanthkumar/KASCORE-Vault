"use client"

import { Check, X } from "lucide-react"
import type { RuleResult } from "@/types/password"
import { cn } from "@/lib/utils"

interface RuleChecklistProps {
  rules: RuleResult[]
}

export function RuleChecklist({ rules }: RuleChecklistProps) {
  const passed = rules.filter((r) => r.passed).length
  const total = rules.length
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Progress summary */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground/60 font-mono">COMPLIANCE</span>
        <div className="flex items-center gap-2">
          <div className="h-1 w-24 bg-muted/20 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                percent === 100
                  ? "bg-green-400"
                  : percent >= 60
                  ? "bg-yellow-400"
                  : "bg-red-400"
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span
            className={cn(
              "text-xs font-mono font-bold",
              percent === 100
                ? "text-green-400"
                : percent >= 60
                ? "text-yellow-400"
                : "text-red-400"
            )}
          >
            {passed}/{total}
          </span>
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-1.5">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
              rule.passed ? "bg-green-500/5" : "bg-red-500/5"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                rule.passed ? "bg-green-500/20" : "bg-red-500/20"
              )}
            >
              {rule.passed ? (
                <Check size={10} className="text-green-400" />
              ) : (
                <X size={10} className="text-red-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-xs font-medium",
                  rule.passed ? "text-foreground/80" : "text-muted-foreground/60"
                )}
              >
                {rule.label}
              </p>
              {rule.detail && !rule.passed && (
                <p className="text-[10px] text-muted-foreground/40 mt-0.5">{rule.detail}</p>
              )}
            </div>

            <span
              className={cn(
                "text-[9px] font-mono font-bold tracking-widest shrink-0",
                rule.passed ? "text-green-400/70" : "text-red-400/70"
              )}
            >
              {rule.passed ? "PASS" : "FAIL"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
