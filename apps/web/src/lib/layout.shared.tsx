import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Feature Kit",
			url: "/",
			transparentMode: "none",
		},
		githubUrl: "https://github.com/jayantrohila57/feature-kit",
		links: [
			{
				text: "Home",
				url: "/",
				on: "nav",
			},
		],
		searchToggle: {
			enabled: true,
		},
		themeSwitch: {
			enabled: true,
		},
	}
}
