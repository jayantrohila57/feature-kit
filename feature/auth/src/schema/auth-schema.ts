import { z } from "zod"

export const PASSWORD_MIN = 8

export const AuthSchema = {
	SIGN_IN: {
		INPUT: z.object({
			email: z.string().email("Enter a valid email"),
			password: z.string().min(PASSWORD_MIN, "Please enter your password"),
			rememberMe: z.boolean().optional(),
		}),
	},
	SIGN_UP: {
		INPUT: z.object({
			name: z.string().min(2, "Name is too short").trim(),
			email: z.string().email("Enter a valid email").trim(),
			password: z
				.string()
				.min(8, "Password must be at least 8 characters long")
				.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
				.regex(/[a-z]/, "Password must contain at least one lowercase letter")
				.regex(/[0-9]/, "Password must contain at least one number"),
		}),
	},
	FORGOT_PASSWORD: {
		INPUT: z.object({
			email: z.string().email("Enter a valid email").trim(),
		}),
	},
	RESET_PASSWORD: {
		INPUT: z
			.object({
				password: z
					.string()
					.min(8, "Password must be at least 8 characters long")
					.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
					.regex(/[a-z]/, "Password must contain at least one lowercase letter")
					.regex(/[0-9]/, "Password must contain at least one number"),
				confirmPassword: z.string(),
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Passwords do not match",
				path: ["confirmPassword"],
			}),
	},
	VERIFY_EMAIL: {
		INPUT: z.object({
			email: z.string().email("Enter a valid email").optional(),
		}),
	},
}

export type SignInInput = z.infer<typeof AuthSchema.SIGN_IN.INPUT>
export type SignUpInput = z.infer<typeof AuthSchema.SIGN_UP.INPUT>
export type ForgotPasswordInput = z.infer<typeof AuthSchema.FORGOT_PASSWORD.INPUT>
export type ResetPasswordInput = z.infer<typeof AuthSchema.RESET_PASSWORD.INPUT>
