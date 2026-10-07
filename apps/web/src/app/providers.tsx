"use client"

import { DataTableNuqsAdapter } from "data-table"
import { ConfirmationDialogProvider } from "layout/confirmation-dialog"
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { TooltipProvider } from "@/packages/ui/components/tooltip"

import messages from "../../messages/en.json"
import { nestFlatMessages } from "@/lib/nest-flat-messages"

const nestedMessages = nestFlatMessages(messages as Record<string, unknown>)

export function Providers({ children }: { children: ReactNode }) {
	return (
		<NextIntlClientProvider locale="en" messages={nestedMessages} timeZone="UTC">
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<TooltipProvider>
					<ConfirmationDialogProvider>
						<DataTableNuqsAdapter>{children}</DataTableNuqsAdapter>
						<Toaster richColors position="top-center" />
					</ConfirmationDialogProvider>
				</TooltipProvider>
			</ThemeProvider>
		</NextIntlClientProvider>
	)
}
