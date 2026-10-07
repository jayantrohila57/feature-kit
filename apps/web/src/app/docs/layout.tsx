import { HomeLayout } from "fumadocs-ui/layouts/home"

import { DocsNav } from "@/components/docs/docs-nav"
import { baseOptions } from "@/lib/layout.shared"

export default function Layout({ children }: LayoutProps<"/docs">) {
	return (
		<HomeLayout {...baseOptions()} className="flex min-h-screen flex-col">
			<div className="border-b bg-background">
				<DocsNav />
			</div>
			<div className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-8">{children}</div>
		</HomeLayout>
	)
}
