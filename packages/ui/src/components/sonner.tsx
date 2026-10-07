"use client"

import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { buttonVariants } from "@/packages/ui/components/button"
import Spinner from "@/packages/ui/components/spinner"
import { cn } from "@/packages/ui/lib/utils"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()
  const resolvedTheme: ToasterProps["theme"] = theme === "light" || theme === "dark" ? theme : "system"

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Spinner className="size-4" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          actionButton: cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-auto px-2"),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
