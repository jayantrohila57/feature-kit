"use client"

import type * as React from "react"

import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
    />
  )
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...props}
    />
  )
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      {...props}
    />
  )
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...props}
    />
  )
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-50 bg-black/80 duration-100 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  )
}

const dialogContentVariants = {
  default:
    "data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 fixed start-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl bg-popover p-4 text-popover-foreground text-xs/relaxed shadow-lg outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in sm:max-w-sm rtl:translate-x-1/2",
  form: "data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 fixed start-1/2 top-1/2 z-50 flex max-h-[min(34rem,85dvh)] w-full max-w-[calc(100%-4rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 overflow-hidden rounded-xl bg-background p-1.5 text-popover-foreground text-xs/relaxed shadow-lg outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in sm:max-w-3xl rtl:translate-x-1/2 border",
  fullscreen:
    "data-open:fade-in-0 data-open:zoom-in-100 data-closed:fade-out-0 data-closed:zoom-out-100 fixed inset-0 z-50 flex h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-background p-0 text-foreground shadow-none outline-none ring-0 duration-100 data-closed:animate-out data-open:animate-in",
} as const

function isPortaledOverlayEvent(event: { target: EventTarget | null }) {
  const target = event.target
  if (!(target instanceof Element)) return false
  return Boolean(
    target.closest(
      "[data-slot=popover-content], [data-slot=calendar], [data-slot=select-content], [data-slot=select-trigger], [data-radix-popper-content-wrapper], .rdp-root, select",
    ),
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  variant = "default",
  onInteractOutside,
  onPointerDownOutside,
  onFocusOutside,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  variant?: keyof typeof dialogContentVariants
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-variant={variant}
        className={cn(dialogContentVariants[variant], className)}
        {...props}
        onInteractOutside={(event) => {
          if (isPortaledOverlayEvent(event)) {
            event.preventDefault()
            return
          }
          onInteractOutside?.(event)
        }}
        onPointerDownOutside={(event) => {
          if (isPortaledOverlayEvent(event)) {
            event.preventDefault()
            return
          }
          onPointerDownOutside?.(event)
        }}
        onFocusOutside={(event) => {
          if (isPortaledOverlayEvent(event)) {
            event.preventDefault()
            return
          }
          onFocusOutside?.(event)
        }}>
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            asChild>
            <Button
              variant="ghost"
              className="absolute end-4 top-4"
              size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading font-medium text-foreground text-sm", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-xs/relaxed", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
