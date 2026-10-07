import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Feature Kit",
		},
		githubUrl: "https://github.com/jayantrohila57/feature-kit",
		links: [
			{
				text: "Examples",
				url: "/examples",
				active: "nested-url",
			},
			{
				text: "Docs",
				url: "/docs",
				active: "nested-url",
			},
		],
	}
}
