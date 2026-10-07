import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

const githubUrl = "https://github.com/jayantrohila57/feature-kit"

export function baseOptions(): BaseLayoutProps {
	return {
		githubUrl,
		nav: {
			title: "Feature Kit",
			url: "/",
		},
		links: [
			{
				text: "Home",
				url: "/",
			},
			{
				text: "Docs",
				url: "/docs",
				active: "nested-url",
			},
		],
	}
}
