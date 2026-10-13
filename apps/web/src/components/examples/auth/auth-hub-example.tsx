"use client"

import { AuthDemoCallout, AuthHubPage } from "auth"

export function AuthHubExample() {
	return (
		<div className="mx-auto w-full max-w-lg space-y-4">
			<AuthDemoCallout />
			<AuthHubPage />
		</div>
	)
}
