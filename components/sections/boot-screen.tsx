"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield } from "lucide-react"

const BOOT_LINES = [
  "INITIALIZING CYBERPASS AI v2.0...",
  "LOADING CRYPTOGRAPHIC MODULES... OK",
  "CONNECTING TO THREAT DATABASE... OK",
  "ENTROPY ENGINE ONLINE... OK",
  "PATTERN RECOGNITION READY... OK",
  "BREACH DETECTION MODULE... LOADED",
  "ALL SYSTEMS NOMINAL.",
  "WELCOME, OPERATOR.",
]

interface BootScreenProps {
  onComplete?: () => void
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [lines, setLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let lineIndex = 0
    const interval = setInterval(() => {
      if (lineIndex < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[lineIndex]])
        setProgress(Math.round(((lineIndex + 1) / BOOT_LINES.length) * 100))
        lineIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          setTimeout(() => onComplete?.(), 600)
        }, 400)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8"
        >
          {/* Scan lines overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)",
              }}
            />
          </div>

          <div className="w-full max-w-lg space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse" />
                <div className="relative w-10 h-10 rounded-full border border-cyan-500/50 bg-black/60 flex items-center justify-center">
                  <Shield size={20} className="text-cyan-400" />
                </div>
              </div>
              <div>
                <p className="text-xs font-mono text-cyan-400/80 tracking-[0.3em]">CYBERPASS</p>
                <p className="text-[9px] font-mono text-muted-foreground/40 tracking-widest">AI SECURITY SUITE</p>
              </div>
            </div>

            {/* Terminal output */}
            <div className="bg-black/60 border border-cyan-500/20 rounded-lg p-4 font-mono text-xs space-y-1 min-h-[200px]">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={
                    line.includes("OK") || line.includes("LOADED")
                      ? "text-green-400"
                      : line.includes("WELCOME")
                      ? "text-cyan-400 font-bold"
                      : "text-muted-foreground/70"
                  }
                >
                  {"> "}
                  {line}
                  {i === lines.length - 1 && (
                    <span className="inline-block w-2 h-3 bg-cyan-400 ml-1 animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground/50">
                <span>SYSTEM BOOT</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
