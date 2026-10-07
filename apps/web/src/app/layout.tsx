import type { Metadata } from "next"
import { RootProvider } from "fumadocs-ui/provider/next"
import "./globals.css"

import { Providers } from "./providers"

export const metadata: Metadata = {
	title: "Feature Kit",
	description: "Form and data-table component playground",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
				<RootProvider>
					<Providers>{children}</Providers>
				</RootProvider>
			</body>
		</html>
	)
}
