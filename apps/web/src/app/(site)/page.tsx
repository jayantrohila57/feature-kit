import { LandingContact } from "@/components/site/landing-contact"
import { LandingFaq } from "@/components/site/landing-faq"
import { LandingFeatureGrid } from "@/components/site/landing-feature-grid"
import { LandingFeatures } from "@/components/site/landing-features"
import { LandingFooter } from "@/components/site/landing-footer"
import { LandingHero } from "@/components/site/landing-hero"
import { Separator } from "@/packages/ui/components/separator"

export default function HomePage() {
	return (
		<div className="flex flex-1 flex-col">
			<LandingHero />
			<Separator />
			<LandingFeatures />
			<Separator />
			<LandingFeatureGrid />
			<Separator />
			<LandingFaq />
			<Separator />
			<LandingContact />
			<Separator />
			<LandingFooter />
		</div>
	)
}
