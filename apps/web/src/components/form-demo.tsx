"use client"

import { FormKit } from "form"
import { FormSection } from "layout"
import { z } from "zod"

const profileSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Enter a valid email"),
	role: z.enum(["viewer", "editor", "admin"]),
	notify: z.boolean(),
})

type ProfileInput = z.input<typeof profileSchema>

const defaultValues: ProfileInput = {
	name: "",
	email: "",
	role: "viewer",
	notify: true,
}

const roleOptions = [
	{ value: "viewer", label: "Viewer" },
	{ value: "editor", label: "Editor" },
	{ value: "admin", label: "Admin" },
]

export function FormDemo() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="font-semibold text-2xl tracking-tight">FormKit</h1>
				<p className="mt-1 text-muted-foreground text-sm">Create or edit records with Zod-backed fields.</p>
			</div>
			<FormKit
				schema={profileSchema}
				defaultValues={defaultValues}
				onSubmit={async (values) => {
					await new Promise((resolve) => setTimeout(resolve, 400))
					console.info("Submitted", values)
				}}
				resetOnSuccess>
				<FormSection title="Profile" description="Basic identity fields for the demo.">
					<FormKit.Field type="text" name="name" label="Full name" required />
					<FormKit.Field type="text" name="email" label="Email" required />
					<FormKit.Field type="select" name="role" label="Role" options={roleOptions} />
					<FormKit.Field type="switch" name="notify" label="Email notifications" />
				</FormSection>
				<FormKit.Actions>
					<FormKit.Reset label="Reset" />
					<FormKit.Submit label="Save" pendingLabel="Saving…" />
				</FormKit.Actions>
			</FormKit>
		</div>
	)
}
