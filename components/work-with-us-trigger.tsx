"use client"

import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { useWorkWithUs } from "@/components/WorkWithUsDrawer"
import { cn } from "@/lib/utils"

export function WorkWithUsTrigger({ className, children, ...rest }: ComponentProps<"button">) {
  const { openApplication } = useWorkWithUs()
  return (
    <button type="button" onClick={openApplication} className={cn("cursor-pointer", className)} {...rest}>
      {children}
    </button>
  )
}

export function WorkWithUsButton({ children, ...props }: ComponentProps<typeof Button>) {
  const { openApplication } = useWorkWithUs()
  return (
    <Button type="button" onClick={openApplication} {...props}>
      {children}
    </Button>
  )
}
