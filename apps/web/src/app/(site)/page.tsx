import { LandingFooter } from "@/components/site/landing-footer"
import { LandingHero } from "@/components/site/landing-hero"

export default function HomePage() {
	return (
		<div className="flex flex-1 flex-col">
			<LandingHero />
			<LandingFooter />
		</div>
	)
}
