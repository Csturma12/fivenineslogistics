import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { WhoWeServe } from "@/components/who-we-serve"
import { Services } from "@/components/services"
import { Reliability } from "@/components/reliability"
import { NetworkCta } from "@/components/network-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <WhoWeServe />
      <Services />
      <Reliability />
      <NetworkCta />
      <SiteFooter />
    </main>
  )
}
