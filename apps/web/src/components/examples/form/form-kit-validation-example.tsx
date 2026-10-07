"use client"

import { FormKit } from "form"
import { FormSection } from "layout"
import { z } from "zod"

const schema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(24, "Username must be at most 24 characters")
		.regex(/^[a-z0-9_-]+$/i, "Use letters, numbers, hyphen, or underscore only"),
	age: z
		.string()
		.min(1, "Age is required")
		.refine((value) => /^\d+$/.test(value), "Enter a whole number")
		.refine((value) => {
			const n = Number(value)
			return n >= 18 && n <= 120
		}, "Must be between 18 and 120"),
	terms: z.boolean().refine((value) => value, "You must accept the terms"),
})

const defaultValues: z.input<typeof schema> = {
	username: "",
	age: "",
	terms: false,
}

export function FormKitValidationExample() {
	return (
		<FormKit schema={schema} defaultValues={defaultValues} onSubmit={async () => undefined}>
			<FormSection
				title="Validation"
				description="Submit with empty or invalid values to see errors and focus move to the first field.">
				<FormKit.Field type="text" name="username" label="Username" required />
				<FormKit.Field type="text" name="age" label="Age" required />
				<FormKit.Field type="checkbox" name="terms" label="I accept the terms" required />
			</FormSection>
			<FormKit.Actions>
				<FormKit.Submit label="Validate" pendingLabel="Checking…" />
			</FormKit.Actions>
		</FormKit>
	)
}
