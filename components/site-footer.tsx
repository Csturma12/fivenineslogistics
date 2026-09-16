import Link from "next/link"
import { FiveNinesMark } from "@/components/five-nines-mark"
import { site } from "@/lib/site"

const groups = [
 {label:"Services",links:[{href:"/modes",label:"Modes & equipment"},{href:"/consulting",label:"Supply Chain Consulting"},{href:"/request-capacity",label:"Request Capacity"}]},
 {label:"Company",links:[{href:"/company",label:"Who We Are"},{href:"/who-we-serve",label:"Who We Serve"},{href:"/growth",label:"Watch Us Grow"},{href:"/work-with-us",label:"Work With Us"},{href:"/carriers",label:"Haul for Us"}]},
 {label:"Portal & resources",links:[{href:"/portal",label:"Customer Sign In"},{href:"/portal",label:"Carrier Sign In"},{href:"/portal/customer#documents",label:"Request Documents"}]},
]

export function SiteFooter(){return <footer className="bg-navy text-navy-foreground"><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
 <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]"><div className="max-w-sm"><Link href="/" className="flex items-center gap-2.5" aria-label="Five Nines Logistics home"><FiveNinesMark className="size-7"/><span className="text-sm font-semibold">FIVE NINES LOGISTICS</span></Link><p className="mt-4 text-sm leading-relaxed text-navy-foreground/70">Houston-based, flatbed-focused 3PL for mission-critical contractors, plant maintenance teams, data centers, and international shippers—with solutions for everything from expedited freight to heavy haul, drayage, rigging, ocean, and warehousing. Backed by trusted capacity, 24/7 service, and global reach.</p><div className="mt-5 flex flex-col gap-1 text-sm text-navy-foreground/70"><a href={site.phoneHref}>{site.phone}</a><a href={`mailto:${site.dispatchEmail}`}>{site.dispatchEmail}</a></div></div>
 <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">{groups.map(group=><div key={group.label}><h2 className="font-mono text-[10px] uppercase tracking-wider text-navy-foreground/55">{group.label}</h2><ul className="mt-4 flex flex-col gap-2.5 text-sm">{group.links.map(link=><li key={`${group.label}-${link.label}`}><Link href={link.href} className="text-navy-foreground/70 transition-colors hover:text-navy-foreground">{link.label}</Link></li>)}</ul></div>)}</div></div>
 <div className="mt-12 border-t border-white/10 pt-6"><p className="max-w-4xl text-xs leading-relaxed text-navy-foreground/55">Five Nines Logistics is a 3PL and freight brokerage brand operating as an agent of Primary Freight LLC, MC# 841023. Capacity may be owned, affiliated, or provided through vetted carrier and facility partners. The applicable operating provider is identified in shipment documentation.</p><div className="mt-4 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-wider text-navy-foreground/55 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} Five Nines Logistics · Houston, Texas</span><span>Authority and insurance documents available by request</span></div></div>
 </div></footer>}
