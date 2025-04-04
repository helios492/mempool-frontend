"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cn } from "@/app/lib/utils"

interface SubscriptionToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

const SubscriptionToggle = React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    SubscriptionToggleProps
>(({ className, checked, onCheckedChange, ...props }, ref) => (
    <TogglePrimitive.Root
        ref={ref}
        pressed={checked}
        onPressedChange={onCheckedChange}
        className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            checked
                ? "bg-[#3E5A16]/50 border border-[#3E5A16] text-white hover:bg-[#2E4A06]"
                : "bg-red-800/50 border border-red-800 text-white hover:bg-red-900",
            "min-w-[100px] h-9 px-3",
            className
        )}
        {...props}
    >
        {checked ? "Subscribed" : "Disabled"}
    </TogglePrimitive.Root>
))

SubscriptionToggle.displayName = "SubscriptionToggle"

export { SubscriptionToggle } 