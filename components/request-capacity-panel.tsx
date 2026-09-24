"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { RequestCapacityForm } from "@/components/request-capacity-form"

type RequestCapacityContextValue = {
  open: boolean
  openPanel: () => void
  closePanel: () => void
}

const RequestCapacityContext = createContext<RequestCapacityContextValue | null>(null)

export function useRequestCapacity() {
  const ctx = useContext(RequestCapacityContext)
  if (!ctx) {
    throw new Error("useRequestCapacity must be used within a RequestCapacityProvider")
  }
  return ctx
}

export function RequestCapacityProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const openPanel = useCallback(() => setOpen(true), [])
  const closePanel = useCallback(() => setOpen(false), [])

  return (
    <RequestCapacityContext.Provider value={{ open, openPanel, closePanel }}>
      {children}
      <RequestCapacityDrawer open={open} onClose={closePanel} />
    </RequestCapacityContext.Provider>
  )
}

function RequestCapacityDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Request capacity"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-primary">Five Nines dispatch</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">Request capacity</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="mb-6 text-pretty text-sm leading-relaxed text-muted-foreground">
            No login required. Tell us the lane and a dispatch coordinator confirms capacity and pricing within one
            business hour.
          </p>
          {open && <RequestCapacityForm bare onClose={onClose} />}
        </div>
      </aside>
    </div>
  )
}
