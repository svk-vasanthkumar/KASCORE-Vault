import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** Small mono label above the title, e.g. "02 / ANALYZER". */
  eyebrow: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
}

/** Consistent section header used across the marketing and tool sections. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.28em] text-primary uppercase">
        <span className="h-px w-8 bg-primary/60" />
        {eyebrow}
      </span>
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p
          className={cn(
            'max-w-2xl text-pretty leading-relaxed text-muted-foreground',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  )
}
