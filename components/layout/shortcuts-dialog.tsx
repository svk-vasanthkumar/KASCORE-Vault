'use client'

import { KEYBOARD_SHORTCUTS } from '@/constants/password'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Reference sheet for the app's single-key shortcuts. */
export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-primary/20 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono tracking-tight">Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Available whenever focus is outside a text field.
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col divide-y divide-primary/10">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.description}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <span className="flex gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex min-w-7 items-center justify-center rounded-md border border-primary/25 bg-primary/8 px-2 py-1 font-mono text-xs font-semibold text-primary"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
