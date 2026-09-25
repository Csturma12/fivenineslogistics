"use client"

import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { useRequestCapacity } from "@/components/request-capacity-panel"
import { cn } from "@/lib/utils"

/**
 * Renders a plain button styled by the caller's className that opens the
 * Request capacity side panel. Use it as a drop-in for link-styled CTAs.
 */
export function RequestCapacityTrigger({ className, children, ...rest }: ComponentProps<"button">) {
  const { openPanel } = useRequestCapacity()
  return (
    <button type="button" onClick={openPanel} className={cn("cursor-pointer", className)} {...rest}>
      {children}
    </button>
  )
}

/**
 * Same behavior as RequestCapacityTrigger but rendered through the shared UI
 * Button, so it matches the site's primary/outline button CTAs exactly.
 */
export function RequestCapacityButton({ children, ...props }: ComponentProps<typeof Button>) {
  const { openPanel } = useRequestCapacity()
  return (
    <Button type="button" onClick={openPanel} {...props}>
      {children}
    </Button>
  )
}
