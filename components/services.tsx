import { services } from "@/lib/site"

export function Services() {
  return (
    <section id="services" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-primary">Services</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            One SLA, every mode.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Every service runs on the same control-tower instrumentation. The mode changes; the
            reliability standard does not.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.code} className="flex flex-col bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-wider text-primary">{service.code}</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {service.metricLabel}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-pretty leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-6 font-mono text-2xl font-semibold text-foreground">
                {service.metricValue}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
