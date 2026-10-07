import { AlertCircle } from "lucide-react"

type ComboboxOptionsErrorProps = {
  message: string
}

export function ComboboxOptionsError({ message }: ComboboxOptionsErrorProps) {
  return (
    <div className="flex items-start gap-2 px-3 py-4 text-destructive text-xs">
      <AlertCircle
        className="mt-0.5 size-3.5 shrink-0"
        aria-hidden
      />
      <span>{message}</span>
    </div>
  )
}
