import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { HomeServeStrip } from "@/components/home-serve-strip"
import { TwoDoors } from "@/components/two-doors"
import { ModesTeaser } from "@/components/modes-teaser"
import { NetworkCta } from "@/components/network-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <HomeServeStrip />
      <TwoDoors />
      <ModesTeaser />
      <NetworkCta />
      <SiteFooter />
    </main>
  )
}
