"use client"

import { useState, useCallback, useEffect } from "react"
import { RefreshCw, Copy, Check, ChevronDown, ChevronUp, Sliders, ArrowUpRight } from "lucide-react"
import { generatePassword, DEFAULT_GENERATOR_OPTIONS } from "@/lib/generator"
import type { GeneratorOptions } from "@/types/password"
import { useClipboard } from "@/hooks/use-clipboard"
import { useSound } from "@/hooks/use-sound"
import { cn } from "@/lib/utils"

interface PasswordGeneratorProps {
  onUse?: (password: string) => void
}

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  description?: string
}

function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group">
      <div>
        <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{label}</p>
        {description && (
          <p className="text-[10px] text-muted-foreground/50 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-9 h-5 rounded-full transition-all duration-200 shrink-0",
          checked ? "bg-cyan-500/80" : "bg-muted/30"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </label>
  )
}

export function PasswordGenerator({ onUse }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_GENERATOR_OPTIONS)
  // Start empty so server and client render identically, then generate the
  // first password on the client after mount to avoid a hydration mismatch
  // (generatePassword relies on the Web Crypto RNG which is non-deterministic).
  const [password, setPassword] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { copied, copy } = useClipboard()
  const { play } = useSound()

  useEffect(() => {
    setPassword(generatePassword(DEFAULT_GENERATOR_OPTIONS))
  }, [])

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    play("generate")
    setTimeout(() => {
      setPassword(generatePassword(options))
      setIsGenerating(false)
    }, 150)
  }, [options, play])

  const handleCopy = () => {
    void copy(password)
    play("success")
  }

  const handleUse = () => {
    if (onUse) {
      onUse(password)
      play("success")
    }
  }

  const update = <K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: value }
      setPassword(generatePassword(next))
      return next
    })
  }

  const strengthColor = () => {
    if (password.length < 12) return "text-red-400 border-red-500/30"
    if (password.length < 16) return "text-yellow-400 border-yellow-500/30"
    return "text-cyan-400 border-cyan-500/40"
  }

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex gap-2">
        {(["random", "memorable", "passphrase", "pin"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => update("mode", mode)}
            className={cn(
              "flex-1 py-2 px-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 border",
              options.mode === mode
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                : "bg-muted/10 border-muted/20 text-muted-foreground/60 hover:border-muted/40"
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Generated password display */}
      <div className={cn(
        "relative group rounded-lg border bg-black/50 p-4 transition-all duration-300",
        strengthColor()
      )}>
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-current opacity-60" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-current opacity-60" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-current opacity-60" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-current opacity-60" />

        <div className="flex items-center gap-3">
          <p className={cn(
            "flex-1 font-mono text-sm break-all leading-relaxed tracking-wider transition-all duration-150",
            isGenerating ? "opacity-0 blur-sm" : "opacity-100 blur-none"
          )}>
            {password}
          </p>
          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={handleGenerate}
              className="p-1.5 rounded text-muted-foreground hover:text-cyan-400 transition-colors"
              title="Generate new"
            >
              <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded text-muted-foreground hover:text-cyan-400 transition-colors"
              title="Copy"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Length slider (random / pin / memorable mode) */}
      {(options.mode === "random" || options.mode === "pin" || options.mode === "memorable") && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-muted-foreground/70 font-mono uppercase tracking-wider">
              {options.mode === "pin" ? "PIN Length" : "Length"}
            </label>
            <span className="text-xs font-mono font-bold text-cyan-400">{options.length}</span>
          </div>
          <input
            type="range"
            min={options.mode === "pin" ? 4 : 4}
            max={options.mode === "pin" ? 12 : 128}
            value={options.length}
            onChange={(e) => update("length", Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-muted/20 accent-cyan-500 cursor-pointer"
          />
          {options.mode !== "pin" && (
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground/30">
              <span>4</span>
              <span>32</span>
              <span>64</span>
              <span>128</span>
            </div>
          )}
        </div>
      )}

      {/* Word count (passphrase) */}
      {options.mode === "passphrase" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-muted-foreground/70 font-mono uppercase tracking-wider">
              Word Count
            </label>
            <span className="text-xs font-mono font-bold text-cyan-400">{options.words}</span>
          </div>
          <input
            type="range"
            min={3}
            max={10}
            value={options.words}
            onChange={(e) => update("words", Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-muted/20 accent-cyan-500 cursor-pointer"
          />
        </div>
      )}

      {/* Character options (random mode) */}
      {options.mode === "random" && (
        <div className="grid grid-cols-2 gap-3">
          <Toggle label="Uppercase" checked={options.uppercase} onChange={(v) => update("uppercase", v)} />
          <Toggle label="Lowercase" checked={options.lowercase} onChange={(v) => update("lowercase", v)} />
          <Toggle label="Numbers" checked={options.numbers} onChange={(v) => update("numbers", v)} />
          <Toggle label="Symbols" checked={options.symbols} onChange={(v) => update("symbols", v)} />
        </div>
      )}

      {/* Passphrase options */}
      {options.mode === "passphrase" && (
        <div className="space-y-3">
          <Toggle label="Capitalize words" checked={options.uppercase} onChange={(v) => update("uppercase", v)} />
          <Toggle label="Include number" checked={options.numbers} onChange={(v) => update("numbers", v)} />
          <Toggle label="Include symbol" checked={options.symbols} onChange={(v) => update("symbols", v)} />
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground/70 font-mono uppercase tracking-wider">Separator</label>
            <div className="flex gap-2">
              {["-", "_", ".", " ", "#"].map((sep) => (
                <button
                  key={sep}
                  onClick={() => update("separator", sep)}
                  className={cn(
                    "w-8 h-8 rounded text-xs font-mono border transition-all",
                    options.separator === sep
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                      : "bg-muted/10 border-muted/20 text-muted-foreground/60 hover:border-muted/40"
                  )}
                >
                  {sep === " " ? "·" : sep}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advanced options (random / memorable mode) */}
      {(options.mode === "random" || options.mode === "memorable") && (
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors font-mono"
          >
            <Sliders size={12} />
            ADVANCED OPTIONS
            {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showAdvanced && (
            <div className="mt-3 space-y-3 pl-4 border-l border-muted/20">
              <Toggle
                label="Exclude ambiguous"
                description="Remove 0, O, l, I, 1"
                checked={options.excludeAmbiguous}
                onChange={(v) => update("excludeAmbiguous", v)}
              />
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          className={cn(
            "flex-1 py-3 rounded-lg font-mono font-bold text-sm uppercase tracking-widest",
            "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400",
            "hover:bg-cyan-500/30 hover:border-cyan-500/60",
            "active:scale-[0.99] transition-all duration-200 relative overflow-hidden group",
            "flex items-center justify-center gap-2"
          )}
        >
          <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
          Generate
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>
        {onUse && (
          <button
            onClick={handleUse}
            className={cn(
              "flex-1 py-3 rounded-lg font-mono font-bold text-sm uppercase tracking-widest",
              "bg-green-500/20 border border-green-500/40 text-green-400",
              "hover:bg-green-500/30 hover:border-green-500/60",
              "active:scale-[0.99] transition-all duration-200",
              "flex items-center justify-center gap-2"
            )}
          >
            <ArrowUpRight size={14} />
            Analyze
          </button>
        )}
      </div>
    </div>
  )
}
