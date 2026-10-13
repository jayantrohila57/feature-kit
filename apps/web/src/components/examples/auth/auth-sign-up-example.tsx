"use client"

import { AuthCardLayout, AuthDemoCallout, SignUpForm } from "auth"

export function AuthSignUpExample() {
	return (
		<div className="mx-auto w-full max-w-md">
			<AuthDemoCallout />
			<div className="mt-4">
				<AuthCardLayout description="Creates a user in the in-memory better-auth store." title="Sign up">
					<SignUpForm />
				</AuthCardLayout>
			</div>
		</div>
	)
}
