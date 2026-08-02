"use client"

import { useState, useRef } from "react"
import { Eye, EyeOff, Copy, Check, X } from "lucide-react"
import { useClipboard } from "@/hooks/use-clipboard"
import { useSound } from "@/hooks/use-sound"
import { cn } from "@/lib/utils"

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
}

export function PasswordInput({ value, onChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { copied, copy } = useClipboard()
  const { play } = useSound()

  const handleCopy = () => {
    if (value) {
      void copy(value)
      play("success")
    }
  }

  const handleClear = () => {
    onChange("")
    play("key")
    inputRef.current?.focus()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const getStrengthColor = () => {
    if (!value) return "border-border"
    if (value.length < 8) return "border-red-500/60 shadow-red-500/10"
    if (value.length < 12) return "border-yellow-500/60 shadow-yellow-500/10"
    return "border-cyan-500/60 shadow-cyan-500/10"
  }

  return (
    <div className="relative group">
      {/* Scanning line animation */}
      {value && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-scan-line" />
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-black/40 backdrop-blur-sm px-4 py-3 transition-all duration-300 shadow-lg",
          getStrengthColor(),
          "focus-within:ring-1 focus-within:ring-cyan-500/30"
        )}
      >
        {/* Cyber corner decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

        {/* Input */}
        <input
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          placeholder="Enter password to analyze..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none font-mono text-base tracking-wider"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {/* Character count */}
        {value && (
          <span className="text-xs font-mono text-muted-foreground/60 shrink-0">
            {value.length}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => { setShowPassword(!showPassword); play("key") }}
            className="p-1.5 rounded text-muted-foreground hover:text-cyan-400 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>

          {value && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded text-muted-foreground hover:text-cyan-400 transition-colors"
                aria-label="Copy password"
              >
                {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded text-muted-foreground hover:text-red-400 transition-colors"
                aria-label="Clear password"
              >
                <X size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
