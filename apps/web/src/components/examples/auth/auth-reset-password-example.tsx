"use client"

import { AuthCardLayout, AuthDemoCallout, ResetPasswordForm } from "auth"

export function AuthResetPasswordExample() {
	return (
		<div className="mx-auto w-full max-w-md">
			<AuthDemoCallout />
			<div className="mt-4">
				<AuthCardLayout title="Reset password">
					<ResetPasswordForm />
				</AuthCardLayout>
			</div>
		</div>
	)
}
