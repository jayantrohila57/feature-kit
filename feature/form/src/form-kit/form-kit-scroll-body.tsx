"use client"

import type { ReactNode } from "react"

import { FieldGroup } from "@/packages/ui/components/field"

import { FORM_KIT_BODY_INNER_CLASS, FORM_KIT_BODY_SCROLL_CLASS, FORM_KIT_BODY_WRAPPER_CLASS } from "../constants"

type FormKitScrollBodyProps = {
  children: ReactNode
}

export function FormKitScrollBody({ children }: FormKitScrollBodyProps) {
  return (
    <div className={FORM_KIT_BODY_WRAPPER_CLASS}>
      <div className={FORM_KIT_BODY_SCROLL_CLASS}>
        <FieldGroup className={FORM_KIT_BODY_INNER_CLASS}>{children}</FieldGroup>
      </div>
    </div>
  )
}
