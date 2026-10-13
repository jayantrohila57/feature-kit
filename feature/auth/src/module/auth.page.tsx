import { KeyRound, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/card"

const sections = [
	{
		title: "Sign in",
		description: "Access the playground with email and password.",
		icon: <LogIn className="size-6 text-primary" />,
		href: "/docs/examples/auth/sign-in",
	},
	{
		title: "Sign up",
		description: "Create a demo account in the in-memory store.",
		icon: <UserPlus className="size-6 text-primary" />,
		href: "/docs/examples/auth/sign-up",
	},
	{
		title: "Forgot password",
		description: "Request a reset link (demo toast only).",
		icon: <KeyRound className="size-6 text-primary" />,
		href: "/docs/examples/auth/forgot-password",
	},
]

export function AuthHubPage() {
	return (
		<div className="grid w-full grid-cols-1 gap-4">
			{sections.map((section) => (
				<Link key={section.title} href={section.href}>
					<Card className="shadow-none transition-shadow hover:shadow-sm">
						<CardHeader className="py-4">
							<CardTitle>{section.title}</CardTitle>
							<CardDescription className="max-w-md">{section.description}</CardDescription>
							<CardAction>{section.icon}</CardAction>
						</CardHeader>
					</Card>
				</Link>
			))}
		</div>
	)
}
