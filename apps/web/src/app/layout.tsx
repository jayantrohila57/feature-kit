import type { Metadata } from "next"
import "./globals.css"

import { Providers } from "./providers"

export const metadata: Metadata = {
	title: "Feature Kit",
	description: "Form and data-table component playground",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background font-sans text-foreground antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
