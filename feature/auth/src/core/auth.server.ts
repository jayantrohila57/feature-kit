import "server-only"

import { betterAuth } from "better-auth"
import { memoryAdapter } from "better-auth/adapters/memory"
import { nextCookies } from "better-auth/next-js"

import { getAuthBaseUrl, isAuthDemoMode } from "./auth.env"

const demoMode = isAuthDemoMode()

const githubClientId = process.env["GITHUB_CLIENT_ID"]?.trim()
const githubClientSecret = process.env["GITHUB_CLIENT_SECRET"]?.trim()

const socialProviders =
	!demoMode && githubClientId && githubClientSecret
		? {
				github: {
					clientId: githubClientId,
					clientSecret: githubClientSecret,
				},
			}
		: {}

export const auth = betterAuth({
	appName: "Feature Kit",
	secret: process.env["BETTER_AUTH_SECRET"] ?? "feature-kit-demo-auth-secret",
	baseURL: getAuthBaseUrl(),
	database: memoryAdapter({}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false,
	},
	...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
	plugins: [nextCookies()],
})

export { demoMode as authDemoMode }
