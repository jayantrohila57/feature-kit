"use client"

import { ArrowUpCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { startTransition, useEffect, useState } from "react"

import { Button } from "@/packages/ui/components/button"

const SCROLL_THRESHOLD_PX = 300

export function ScrollToTopButton() {
  const t = useTranslations()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const nextVisible = window.scrollY > SCROLL_THRESHOLD_PX
      startTransition(() => {
        setIsVisible(nextVisible)
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed right-3 bottom-[max(1rem,env(safe-area-inset-bottom,0px))] z-50 sm:right-4">
      <Button
        type="button"
        size="icon"
        aria-label={t("navigation.scrollToTop")}
        onClick={scrollToTop}>
        <ArrowUpCircle className="fill-primary" />
      </Button>
    </div>
  )
}
