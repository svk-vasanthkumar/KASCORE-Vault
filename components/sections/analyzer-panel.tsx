"use client"

import { SectionHeading } from "@/components/cyber/section-heading"
import { GlassCard } from "@/components/cyber/glass-card"
import { PasswordInput } from "@/components/analyzer/password-input"
import { StrengthMeter } from "@/components/analyzer/strength-meter"
import { MetricsGrid } from "@/components/analyzer/metrics-grid"
import { CrackTimeTable } from "@/components/analyzer/crack-time-table"
import { PatternFindings } from "@/components/analyzer/pattern-findings"
import { RuleChecklist } from "@/components/analyzer/rule-checklist"
import { BreachPanel } from "@/components/analyzer/breach-panel"
import { Reveal } from "@/components/animations/reveal"
import { usePasswordAnalysis } from "@/hooks/use-password-analysis"
import { useBreachCheck } from "@/hooks/use-breach-check"

interface AnalyzerPanelProps {
  password: string
  onChange: (value: string) => void
  visible: boolean
  onToggleVisible: () => void
  onGenerate: () => void
}

export function AnalyzerPanel({ password, onChange }: AnalyzerPanelProps) {
  const { analysis } = usePasswordAnalysis(password)
  const breachResult = useBreachCheck(password)

  return (
    <section id="analyzer" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="01 / ANALYZER"
            title="Password Analyzer"
            description="Real-time cryptographic strength analysis with AI-powered threat detection"
          />
        </Reveal>

        {/* Password input */}
        <Reveal delay={0.1}>
          <PasswordInput value={password} onChange={onChange} />
        </Reveal>

        {/* Strength meter */}
        <Reveal delay={0.15}>
          <GlassCard>
            <div className="p-5">
              <StrengthMeter
                score={analysis.score}
                level={analysis.level}
                grade={analysis.grade}
                entropy={analysis.entropy}
              />
            </div>
          </GlassCard>
        </Reveal>

        {/* Metrics grid */}
        <Reveal delay={0.2}>
          <MetricsGrid metrics={analysis.metrics} />
        </Reveal>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crack time table */}
          <Reveal delay={0.25} className="lg:col-span-1">
            <GlassCard>
              <div className="p-5">
                <CrackTimeTable estimates={analysis.crackTimes} active={!!password} />
              </div>
            </GlassCard>
          </Reveal>

          {/* Pattern findings */}
          <Reveal delay={0.3} className="lg:col-span-1">
            <GlassCard>
              <div className="p-5">
                <PatternFindings patterns={analysis.patterns} isEmpty={!password} />
              </div>
            </GlassCard>
          </Reveal>

          {/* Rule checklist */}
          <Reveal delay={0.35} className="lg:col-span-1">
            <GlassCard>
              <div className="p-5">
                <RuleChecklist rules={analysis.rules} />
              </div>
            </GlassCard>
          </Reveal>
        </div>

        {/* Breach detection */}
        <Reveal delay={0.4}>
          <GlassCard>
            <div className="p-5">
              <BreachPanel result={breachResult} />
            </div>
          </GlassCard>
        </Reveal>

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && password && (
          <Reveal delay={0.45}>
            <GlassCard>
              <div className="p-5 space-y-3">
                <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest">
                  Security Recommendations
                </p>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground/80">
                      <span className="text-cyan-400/60 font-mono shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </Reveal>
        )}
      </div>
    </section>
  )
}
