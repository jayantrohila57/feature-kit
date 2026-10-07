import { cva, type VariantProps } from "class-variance-authority"
import React, { type ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

interface ShellTypes {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
interface ShellComponent extends ShellTypes {
  Main?: typeof Main
  Aside?: typeof Aside
  Footer?: typeof Footer
  Header?: typeof Header
  Section?: typeof Section
  Frame?: typeof Frame
}

export const Shell = ({ children }: ShellComponent) => {
  return <> {children}</>
}

const Frame = React.forwardRef<HTMLDivElement, ShellTypes>(({ className, style, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-svh flex-col overflow-hidden", className)}
      style={style}
      {...props}>
      {children}
    </div>
  )
})
Frame.displayName = "Frame"
Shell.Frame = Frame

const HeaderVariants = cva("shrink-0 border-b bg-background", {
  variants: {
    variant: {
      /** @deprecated Prefer `app` inside `Shell.Frame` — fixed header overlaps content. */
      default: "fixed top-0 right-0 left-0 z-50 border-b bg-none",
      /** @deprecated Prefer `app` inside `Shell.Frame`. */
      flexed: "fixed top-0 right-0 left-0 z-50 w-full px-5",
      /** In-flow app header band — use inside `Shell.Frame`. Keep in sync with `SHELL_HEADER_HEIGHT`. */
      app: "h-12 w-full px-5",
    },
  },
  defaultVariants: {
    variant: "app",
  },
})
interface HeaderTypes {
  className?: string
  children: ReactNode
}

const Header = React.forwardRef<HTMLElement, HeaderTypes & VariantProps<typeof HeaderVariants>>(
  ({ className, variant, ...props }, ref) => {
    return (
      <header
        ref={ref}
        {...props}
        className={cn(HeaderVariants({ className, variant }), className)}
      />
    )
  },
)
Header.displayName = "Header"
Shell.Header = Header

interface AsideTypes {
  className?: string
  children: ReactNode
}

const Aside = React.forwardRef<HTMLElement, AsideTypes>(({ className, ...props }, ref) => {
  return (
    <aside
      ref={ref}
      {...props}
      className={cn("border", className)}
    />
  )
})
Aside.displayName = "Aside"

Shell.Aside = Aside

const FooterVariants = cva("", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface FooterTypes {
  className?: string
  children: ReactNode
}

const Footer = React.forwardRef<HTMLElement, FooterTypes & VariantProps<typeof FooterVariants>>(
  ({ className, variant, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        {...props}
        className={cn(FooterVariants({ className, variant }), className)}
      />
    )
  },
)
Footer.displayName = "Footer"

Shell.Footer = Footer

const MainVariants = cva("", {
  variants: {
    variant: {
      default: "min-h-screen min-w-0 overflow-x-hidden border-r",
      dashboard: "flex min-h-0 flex-1 flex-col overflow-hidden",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface MainTypes {
  className?: string
  children: ReactNode
}

const Main = React.forwardRef<HTMLElement, MainTypes & VariantProps<typeof MainVariants>>(
  ({ className, variant, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(MainVariants({ className, variant }), className)}
        {...props}
      />
    )
  },
)
Main.displayName = "Main"

Shell.Main = Main

const SectionVariants = cva("", {
  variants: {
    variant: {
      default: "",
      full: "h-full w-full",
      /** In-shell scroller under a header-only Frame (auth landing). Parent Main is overflow-hidden. */
      flexed: "flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain px-5",
      dashboard: "flex min-h-0 flex-1 flex-col gap-0 bg-secondary dark:bg-background",
      center: "flex min-h-svh flex-col items-center justify-center p-2 md:p-10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface SectionTypes {
  className?: string
  children: ReactNode
}

const Section = React.forwardRef<HTMLElement, SectionTypes & VariantProps<typeof SectionVariants>>(
  ({ variant, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(SectionVariants({ variant, className }))}
        {...props}
      />
    )
  },
)
Section.displayName = "Section"

Shell.Section = Section

export default Shell
