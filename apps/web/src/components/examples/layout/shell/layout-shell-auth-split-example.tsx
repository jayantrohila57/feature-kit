"use client"

import { AuthSplitShell } from "layout"
import { AuthCardLayout, AuthDemoCallout, SignInForm } from "auth"

import { LayoutShellFrame } from "./layout-shell-frame"

export function LayoutShellAuthSplitExample() {
	return (
		<LayoutShellFrame tall>
			<AuthSplitShell
				aside={
					<div className="flex h-full flex-col justify-end p-8">
						<p className="font-medium text-lg">Feature Kits</p>
						<p className="mt-2 max-w-sm text-muted-foreground text-sm">
							Split auth layout for sign-in flows. The aside is hidden on small screens.
						</p>
					</div>
				}>
				<AuthDemoCallout />
				<div className="mt-4">
					<AuthCardLayout description="Compose with `auth` forms." title="Sign in">
						<SignInForm redirectTo="/docs/examples/layout/shell-auth-split" />
					</AuthCardLayout>
				</div>
			</AuthSplitShell>
		</LayoutShellFrame>
	)
}
