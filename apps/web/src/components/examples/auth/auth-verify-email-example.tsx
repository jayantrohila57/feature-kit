"use client"

import { AuthCardLayout, AuthDemoCallout, VerifyEmailPanel } from "auth"
import { Suspense } from "react"

import { AuthPageLoading } from "auth"

export function AuthVerifyEmailExample() {
	return (
		<div className="mx-auto w-full max-w-md">
			<AuthDemoCallout />
			<div className="mt-4">
				<AuthCardLayout title="Verify email">
					<Suspense fallback={<AuthPageLoading />}>
						<VerifyEmailPanel />
					</Suspense>
				</AuthCardLayout>
			</div>
		</div>
	)
}
