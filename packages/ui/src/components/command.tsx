"use client"

import type * as React from "react"

import { Command as CommandPrimitive } from "cmdk"
import { CheckIcon, SearchIcon } from "lucide-react"

import { cn } from "@/packages/ui/lib/utils"

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn("flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)}
      {...props}
    />
  )
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      className="flex items-center gap-2 border-border/60 border-b px-2.5"
      cmdk-input-wrapper="">
      <SearchIcon
        aria-hidden="true"
        className="size-3.5 shrink-0 opacity-50"
      />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-8 w-full bg-transparent text-xs/relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-72 scroll-py-1 overflow-y-auto overflow-x-hidden outline-none", className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-muted-foreground text-xs/relaxed", className)}
      {...props}
    />
  )
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2.5 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group-heading]]:text-xs",
        className,
      )}
      {...props}
    />
  )
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px bg-border/50", className)}
      {...props}
    />
  )
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex min-h-7 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-xs/relaxed outline-hidden data-[disabled=true]:pointer-events-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[disabled=true]:opacity-50 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  )
}

function CommandCheck({ className, ...props }: React.ComponentProps<typeof CheckIcon>) {
  return (
    <CheckIcon
      aria-hidden="true"
      className={cn("ml-auto size-3.5 opacity-0 group-data-[checked=true]/command-item:opacity-100", className)}
      {...props}
    />
  )
}

export { Command, CommandCheck, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator }
