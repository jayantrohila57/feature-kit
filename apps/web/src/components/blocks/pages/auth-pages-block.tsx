"use client"

import { AuthCardLayout, AuthDemoCallout, ForgotPasswordForm, SignInForm, SignUpForm } from "auth"
import { AuthSplitShell } from "layout"
import { useState } from "react"

import { BlockPageRoot } from "@/components/blocks/block-page-root"
import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

type AuthVariant = "sign-in" | "sign-up" | "forgot" | "split"

const variants: { id: AuthVariant; label: string }[] = [
	{ id: "sign-in", label: "Sign in" },
	{ id: "sign-up", label: "Sign up" },
	{ id: "forgot", label: "Forgot password" },
	{ id: "split", label: "Split screen" },
]

function AuthMarketingAside() {
	return (
		<div className="flex h-full flex-col justify-end p-8">
			<p className="font-medium text-lg">Feature Kit</p>
			<p className="mt-2 max-w-sm text-muted-foreground text-sm">
				Auth blocks compose `AuthCardLayout` with sign-in, sign-up, and recovery forms from the auth kit.
			</p>
		</div>
	)
}

export function AuthPagesBlock() {
	const [variant, setVariant] = useState<AuthVariant>("sign-in")

	return (
		<BlockPageRoot>
			<div className="flex h-full min-h-0 flex-col">
				<div className="flex flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-2">
					{variants.map((item) => (
						<Button
							key={item.id}
							className={cn("h-8", variant === item.id && "bg-background shadow-sm")}
							size="sm"
							type="button"
							variant={variant === item.id ? "secondary" : "ghost"}
							onClick={() => setVariant(item.id)}>
							{item.label}
						</Button>
					))}
				</div>
				<div className="min-h-0 flex-1 overflow-auto">
					{variant === "split" ? (
						<AuthSplitShell aside={<AuthMarketingAside />}>
							<AuthDemoCallout />
							<div className="mt-4">
								<AuthCardLayout description="Split layout hides the aside on small screens." title="Sign in">
									<SignInForm redirectTo="/blocks/preview/auth-pages" />
								</AuthCardLayout>
							</div>
						</AuthSplitShell>
					) : (
						<div className="flex min-h-full items-center justify-center p-6">
							<div className="w-full max-w-md space-y-4">
								<AuthDemoCallout />
								<AuthCardLayout
									description={
										variant === "sign-in"
											? "Email and password with demo adapter."
											: variant === "sign-up"
												? "Create an account in demo mode."
												: "Send a reset link (demo)."
									}
									title={
										variant === "sign-in"
											? "Sign in"
											: variant === "sign-up"
												? "Sign up"
												: "Forgot password"
									}>
									{variant === "sign-in" ? (
										<SignInForm redirectTo="/blocks/preview/auth-pages" />
									) : variant === "sign-up" ? (
										<SignUpForm redirectTo="/blocks/preview/auth-pages" />
									) : (
										<ForgotPasswordForm />
									)}
								</AuthCardLayout>
							</div>
						</div>
					)}
				</div>
			</div>
		</BlockPageRoot>
	)
}
