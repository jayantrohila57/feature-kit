import type { ComponentProps, CSSProperties } from "react"

import { cn } from "@/packages/ui/lib/utils"

type SpinnerProps = ComponentProps<"div">

const SPINNER_SEGMENT_COUNT = 12
const SPINNER_CYCLE_MS = 1350
const SPINNER_STEP_MS = SPINNER_CYCLE_MS / SPINNER_SEGMENT_COUNT
const SPINNER_SEGMENTS = Array.from({ length: SPINNER_SEGMENT_COUNT }, (_, index) => ({
  angle: index * (360 / SPINNER_SEGMENT_COUNT),
  // Highlight travels clockwise: index 0 (top) → 1 (30°) → 2 (60°).
  delayMs: (index - SPINNER_SEGMENT_COUNT) * SPINNER_STEP_MS,
  opacity: +(1 - (index / SPINNER_SEGMENT_COUNT) * 0.85).toFixed(2),
}))

export default function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("size-6 text-foreground", className)}
      {...props}>
      <svg
        viewBox="0 0 24 24"
        className="size-full"
        role="presentation">
        {SPINNER_SEGMENTS.map((segment) => (
          <rect
            key={segment.angle}
            x="11.25"
            y="2.75"
            width="1.5"
            height="6"
            rx="0.75"
            fill="currentColor"
            className="animate-spinner-segment"
            style={
              {
                "--spinner-segment-delay": `${segment.delayMs}ms`,
                "--spinner-segment-opacity": segment.opacity,
              } as CSSProperties
            }
            transform={`rotate(${segment.angle} 12 12)`}
          />
        ))}
      </svg>
    </div>
  )
}
