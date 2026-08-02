/**
 * Fixed, purely decorative environment layer: animated grid, glow orbs,
 * light rays, scanline sweep and film noise. Rendered once at the root so
 * every section shares the same atmosphere.
 */
export function CyberBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Deep vertical wash */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--background)_0%,#071026_45%,var(--background)_100%)]" />

      {/* Perspective grid, masked toward the horizon */}
      <div className="absolute inset-0 cyber-grid animate-grid-pan [mask-image:radial-gradient(ellipse_75%_60%_at_50%_35%,#000_10%,transparent_78%)]" />

      {/* Glow orbs */}
      <div className="absolute -top-40 left-[8%] size-[32rem] rounded-full bg-primary/12 blur-[130px] animate-orb-drift" />
      <div
        className="absolute top-[38%] -right-32 size-[28rem] rounded-full bg-accent/8 blur-[120px] animate-orb-drift"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[42%] size-[26rem] rounded-full bg-primary/8 blur-[140px] animate-orb-drift"
        style={{ animationDelay: '-12s' }}
      />

      {/* Vertical light rays */}
      <div className="absolute inset-x-0 top-0 h-[70vh] opacity-40">
        <div className="absolute left-[18%] h-full w-px bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--primary)_35%,transparent),transparent)]" />
        <div className="absolute left-[47%] h-full w-px bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--accent)_25%,transparent),transparent)]" />
        <div className="absolute left-[76%] h-full w-px bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--primary)_28%,transparent),transparent)]" />
      </div>

      {/* Horizon line */}
      <div className="absolute top-[62%] inset-x-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--primary)_45%,transparent),transparent)]" />

      {/* Scanline sweep */}
      <div className="absolute inset-x-0 top-0 h-32 animate-scan bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--primary)_9%,transparent),transparent)]" />

      {/* Static scanlines + noise grain */}
      <div className="absolute inset-0 scanlines opacity-25" />
      <div className="absolute inset-0 noise-overlay opacity-[0.035] mix-blend-overlay" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_100%)] opacity-80" />
    </div>
  )
}
