"use client"

import { useActionState, useState } from "react"
import { ArrowRight, Check, TriangleAlert } from "lucide-react"
import { submitRequestCapacity, type RequestState } from "@/app/actions/request-capacity"
import { Button } from "@/components/ui/button"

const services = ["Freight cost audit", "Shipping delay analysis", "Supply-chain risk assessment", "Route-optimization consultation"]
const inputClass = "h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
const labelClass = "mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
const initialState: RequestState = { status: "idle" }

export function ConsultationForm(){
 const [state, action, pending] = useActionState(submitRequestCapacity, initialState)
 const [service,setService]=useState(services[0])
 if(state.status==="success") return <div className="rounded-xl border border-border bg-card p-8"><Check className="size-5 text-primary"/><h3 className="mt-4 text-xl font-semibold text-foreground">Review request received.</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Reference {state.ticket}. We will contact you to confirm the scope and the safest way to share supporting records.</p></div>
 return <form action={action} className="rounded-xl border border-border bg-card p-6 sm:p-8"><input type="hidden" name="requestType" value="consulting"/><input type="hidden" name="mode" value={service}/><input type="hidden" name="origin" value="Consulting review"/><input type="hidden" name="destination" value="Consulting review"/><input type="hidden" name="cadence" value="Assessment"/>
  <div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass} htmlFor="consult-name">Contact name</label><input className={inputClass} id="consult-name" name="name" required/></div><div><label className={labelClass} htmlFor="consult-company">Company</label><input className={inputClass} id="consult-company" name="company" required/></div><div><label className={labelClass} htmlFor="consult-email">Work email</label><input className={inputClass} id="consult-email" name="email" type="email" required/></div><div><label className={labelClass} htmlFor="consult-phone">Phone</label><input className={inputClass} id="consult-phone" name="phone" type="tel"/></div></div>
  <fieldset className="mt-5"><legend className={labelClass}>Free assessment</legend><div className="grid gap-2 sm:grid-cols-2">{services.map(item=><button key={item} type="button" aria-pressed={service===item} onClick={()=>setService(item)} className={service===item?"rounded-md border border-primary bg-primary/10 px-3 py-2 text-left text-sm text-foreground":"rounded-md border border-border px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground"}>{item}</button>)}</div></fieldset>
  <div className="mt-5"><label className={labelClass} htmlFor="consult-details">What are you seeing?</label><textarea className={`${inputClass} h-auto resize-y py-3`} id="consult-details" name="details" rows={5} required placeholder="Current lanes, recurring charges, missed appointments, or the risk you want reviewed."/></div>
  {state.status==="error"&&<p role="alert" className="mt-4 flex gap-2 text-sm text-foreground"><TriangleAlert className="size-4 shrink-0 text-primary"/>{state.message}</p>}
  <Button className="mt-5 w-full" size="lg" disabled={pending}>{pending?"Sending…":"Request free assessment"}{!pending&&<ArrowRight data-icon="inline-end"/>}</Button>
 </form>
}
