"use client"

import { AuthCardLayout, AuthDemoCallout, ForgotPasswordForm } from "auth"

export function AuthForgotPasswordExample() {
	return (
		<div className="mx-auto w-full max-w-md">
			<AuthDemoCallout />
			<div className="mt-4">
				<AuthCardLayout title="Forgot password">
					<ForgotPasswordForm />
				</AuthCardLayout>
			</div>
		</div>
	)
}
