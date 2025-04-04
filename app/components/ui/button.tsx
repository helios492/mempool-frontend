import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/app/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground relative shadow-[0_6px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-primary/30 active:translate-y-[3px] active:shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:bg-primary/90 transition-all duration-150 before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-t before:from-white/ before:to-black/15 before:opacity-100 before:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[60%] after:rounded-b-md after:bg-gradient-to-t after:from-white/25 after:to-transparent after:content-[''] after:-z-10 overflow-hidden [transform-style:preserve-3d] [perspective:800px] hover:[transform:translateZ(5px)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-custom-300 bg-transparent shadow-sm hover:bg-custom-300/50 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground relative shadow-[0_6px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-secondary/30 active:translate-y-[3px] active:shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:bg-secondary/80 transition-all duration-150 before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-t before:from-white/15 before:to-black/15 before:opacity-100 before:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[60%] after:rounded-b-md after:bg-gradient-to-t after:from-white/25 after:to-transparent after:content-[''] after:-z-10 overflow-hidden [transform-style:preserve-3d] [perspective:800px] hover:[transform:translateZ(5px)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
