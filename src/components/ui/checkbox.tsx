"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer relative">
      <input
        type="checkbox"
        data-slot="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-input shadow-sm",
          "transition-all bg-background ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "checked:bg-primary checked:text-primary-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "relative",
          className
        )}
        {...props}
      />
      <span
        data-slot="checkbox-indicator"
        className="pointer-events-none absolute hidden peer-checked:flex peer-disabled:opacity-50"
      >
        <Check className="h-3.5 w-3.5 text-primary-foreground" />
      </span>
    </label>
  )
}

export { Checkbox }
