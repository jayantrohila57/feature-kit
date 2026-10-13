"use client"

import { AuthCardLayout, AuthDemoCallout, SignInForm } from "auth"

export function AuthSignInExample() {
	return (
		<div className="mx-auto w-full max-w-md">
			<AuthDemoCallout />
			<div className="mt-4">
				<AuthCardLayout description="Email and password with GitHub provider button." title="Sign in">
					<SignInForm />
				</AuthCardLayout>
			</div>
		</div>
	)
}
