"use client"

import { FormKit } from "form"
import { FormSection } from "layout"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Enter a valid email"),
	role: z.enum(["viewer", "editor", "admin"]),
	notify: z.boolean(),
})

const defaultValues: z.input<typeof schema> = {
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

export function FormKitBasicExample() {
	return (
		<FormKit
			schema={schema}
			defaultValues={defaultValues}
			resetOnSuccess
			onSubmit={async (values) => {
				await new Promise((resolve) => setTimeout(resolve, 500))
				toast.success("Profile saved", { description: `${values.name} · ${values.role}` })
			}}>
			<FormSection title="Profile" description="Typical create/edit layout with actions in the footer.">
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
	)
}
