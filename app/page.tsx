import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { WhoWeServe } from "@/components/who-we-serve"
import { ModesTeaser } from "@/components/modes-teaser"
import { Method } from "@/components/method"
import { Reliability } from "@/components/reliability"
import { DedicatedFleet } from "@/components/dedicated-fleet"
import { Capacity } from "@/components/capacity"
import { NetworkCta } from "@/components/network-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <WhoWeServe />
      <ModesTeaser />
      <Method />
      <Reliability />
      <DedicatedFleet />
      <Capacity />
      <NetworkCta />
      <SiteFooter />
    </main>
  )
}
