import type { Metadata } from "next"
import { RootProvider } from "fumadocs-ui/provider/next"
import "./globals.css"

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/brand/lambda-mark"
import { getMetadataBase } from "@/lib/site-url"
import { Providers } from "./providers"

export const metadata: Metadata = {
	metadataBase: getMetadataBase(),
	title: {
		default: SITE_NAME,
		template: `%s · ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	appleWebApp: {
		title: SITE_NAME,
		capable: true,
		statusBarStyle: "default",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: SITE_NAME,
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
	},
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
