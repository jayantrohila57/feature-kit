import type { ReactNode } from "react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/components/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/packages/ui/components/card"
import { cn } from "@/packages/ui/lib/utils"

export function AuthCardLayout({
	title,
	description,
	children,
	footer,
	className,
}: {
	title: string
	description?: string
	children: ReactNode
	footer?: ReactNode
	className?: string
}) {
	return (
		<Card className={cn("w-full max-w-md border shadow-sm", className)}>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl">{title}</CardTitle>
				{description ? <CardDescription>{description}</CardDescription> : null}
			</CardHeader>
			<CardContent className="grid gap-4">{children}</CardContent>
			{footer ? <CardFooter className="flex flex-col gap-4 border-t pt-4">{footer}</CardFooter> : null}
		</Card>
	)
}

export function AuthFooterNote({ hint, action, href }: { hint: string; action: string; href: string }) {
	return (
		<p className="text-center text-muted-foreground text-sm">
			{hint}{" "}
			<Link className="text-primary underline underline-offset-4 hover:text-primary/80" href={href}>
				{action}
			</Link>
		</p>
	)
}

export function AuthDemoCallout() {
	return (
		<Alert>
			<AlertTitle>Demo mode</AlertTitle>
			<AlertDescription>
				Auth uses an in-memory better-auth store. Sessions reset on cold starts. Use any email and password (8+
				characters) to sign in — no environment variables required.
			</AlertDescription>
		</Alert>
	)
}
