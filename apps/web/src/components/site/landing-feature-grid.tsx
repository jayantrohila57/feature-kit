import Link from "next/link"

import { kitLinks } from "@/lib/site-nav"
import { cn } from "@/packages/ui/lib/utils"

export function LandingFeatureGrid() {
	return (
		<section
			className="relative px-4 pt-10 pb-12 lg:px-6"
			aria-labelledby="landing-feature-grid-heading">
			<div className="w-full">
				<h2 id="landing-feature-grid-heading" className="sr-only">
					Feature Kit capabilities
				</h2>
				<ul className="flex flex-col gap-8 md:flex-row md:gap-0 md:divide-x md:divide-border">
					{kitLinks.map((kit) => {
						const Icon = kit.icon
						return (
							<li key={kit.href} className="min-w-0 flex-1 md:px-5 md:first:pl-0 md:last:pr-0">
								<Link
									href={kit.href}
									className={cn(
										"group flex flex-col gap-2 rounded-md outline-none transition-colors",
										"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
									)}>
									<Icon
										aria-hidden
										className="size-5 text-muted-foreground transition-colors group-hover:text-foreground"
									/>
									<span className="font-medium text-sm tracking-tight">{kit.title}</span>
									{kit.description ? (
										<p className="text-muted-foreground text-sm leading-relaxed">{kit.description}</p>
									) : null}
								</Link>
							</li>
						)
					})}
				</ul>
			</div>
		</section>
	)
}
