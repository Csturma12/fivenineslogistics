import { ArrowUpRight, Server, Flame, Ship } from "lucide-react";
import Link from "next/link";

const executions = [
  {
    icon: Server,
    index: "EXEC-01",
    vertical: "Hyperscale data center commissioning",
    lane: "Houston, TX → New Albany, OH",
    load: "42,000 lb 15kV switchgear & transformer skid · 53' step deck with 8 ft tarps.",
    constraint: "Hard 07:00 AM crane slot on an active construction pad.",
    execution:
      "Securement photos verified prior to departure; delivered with a 3.5-hour buffer ahead of the rigging crew.",
    status: "DELIVERED · +3.5 HR BUFFER",
  },
  {
    icon: Flame,
    index: "EXEC-02",
    vertical: "Refinery turnaround line-down emergency",
    lane: "Pasadena, TX → Lake Charles, LA",
    load: "14,500 lb of precast refractory shapes & actuated alloy valves · dedicated 40' hotshot.",
    constraint: "Unplanned unit shutdown costing $45,000/hr; TWIC + FR gear required at Gate 4.",
    execution:
      "Dispatched in 48 minutes; straight-through delivery completed 2 hours ahead of the maintenance window.",
    status: "DISPATCHED IN 48 MIN",
  },
  {
    icon: Ship,
    index: "EXEC-03",
    vertical: "3PL partner OOG port extraction & laydown",
    lane: "Port of Houston → Midwest project yard",
    load: "Over-dimensional imported industrial chiller · heavy-lift transload from flatrack to permitted RGN.",
    constraint: "Avoid port demurrage and stage equipment for 14 days until the jobsite pad cured.",
    execution:
      "Pulled via TWIC drayage, transloaded under crane, staged in a secured laydown yard, and sequenced to site on call-off.",
    status: "ZERO DEMURRAGE · STAGED 14 DAYS",
  },
] as const;

export function MissionCriticalExecutions() {
  return (
    <section
      className="border-y border-slate-800 bg-[#080D1A] text-slate-100"
      aria-labelledby="executions-title"
    >
      <div className="design-container py-20 sm:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-400">
              <span className="mr-2 inline-block size-1.5 rounded-sm bg-emerald-400 align-middle" aria-hidden="true" />
              Recent mission-critical executions
            </p>
            <h2
              id="executions-title"
              className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Proof the method holds under a live clock.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Three representative moves from the last operating quarter: the load, the constraint
            that made it critical, and exactly how the handoffs were executed.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-slate-800 bg-slate-800 lg:grid-cols-3">
          {executions.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.index} className="flex flex-col bg-[#0B111E] p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-amber-400" strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-mono text-[11px] tracking-widest text-slate-500">{item.index}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-white">{item.vertical}</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate-400">{item.lane}</p>

                <dl className="mt-6 flex flex-col gap-4 text-sm">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Load</dt>
                    <dd className="mt-1 leading-relaxed text-slate-200">{item.load}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Constraint</dt>
                    <dd className="mt-1 leading-relaxed text-slate-200">{item.constraint}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Execution</dt>
                    <dd className="mt-1 leading-relaxed text-slate-200">{item.execution}</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    {item.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-400">
            Every execution is documented with a Method of Procedure, securement photos, and a signed POD.
          </p>
          <Link
            href="/who-we-serve"
            className="inline-flex items-center gap-2 font-semibold text-amber-400 transition hover:text-amber-300"
          >
            See who we run these for
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
