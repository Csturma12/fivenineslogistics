import type { ReactNode } from "react"

/* Temporary logo exploration page. Each candidate is a single-color vector
   (currentColor) so it can be judged the way it will actually be used:
   large, at favicon size, and one-color on light. Delete this route once a
   direction is chosen. */

type MarkProps = { className?: string }

/* ---- Candidate A: Bold 9 monogram — reads as a number at every size ---- */
function NineMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Nine mark" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round">
        <circle cx="16.5" cy="12" r="7.5" />
        <path d="M24,12 Q24,28 13.5,29.5" />
      </g>
    </svg>
  )
}

/* ---- Candidate B: Uptime pulse — mission-critical, always-on monitoring ---- */
function PulseMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Uptime pulse mark" xmlns="http://www.w3.org/2000/svg">
      <polyline
        points="2,16 10,16 13,16 16,6 20,26 23,16 30,16"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---- Candidate C: Motion chevrons — freight moving forward ---- */
function ChevronMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Motion chevrons mark" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7,7 L15,16 L7,25" />
        <path d="M15,7 L23,16 L15,25" />
        <path d="M23,7 L31,16 L23,25" opacity={0.55} />
      </g>
    </svg>
  )
}

/* ---- Candidate D: Hex badge with 9 — industrial / defense seal ---- */
function HexMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Hex badge mark" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="16,2 28,9 28,23 16,30 4,23 4,9"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <g fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
        <circle cx="16" cy="14" r="4.4" />
        <path d="M20.4,14 Q20.4,23 14,24" />
      </g>
    </svg>
  )
}

/* ---- Candidate E: 5·9 monogram — the promise spelled out ---- */
function FiveNineMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="5 dot 9 monogram" xmlns="http://www.w3.org/2000/svg">
      <text
        x="16"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono, monospace)"
        fontWeight={700}
        fontSize="15"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        5.9
      </text>
    </svg>
  )
}

/* ---- Candidate F: Current atom-orbit (for comparison) ---- */
const ORBIT_ANGLES = [0, 36, 72, 108, 144]
function AtomMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Atom orbit mark" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" strokeWidth={1.4}>
        {ORBIT_ANGLES.map((angle) => (
          <ellipse key={angle} cx="16" cy="16" rx="13" ry="5" transform={`rotate(${angle} 16 16)`} />
        ))}
      </g>
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
    </svg>
  )
}

const CANDIDATES: { key: string; name: string; note: string; Mark: (p: MarkProps) => ReactNode }[] = [
  { key: "A", name: "Bold 9", note: "Literal, legible as a number at any size", Mark: NineMark },
  { key: "B", name: "Uptime Pulse", note: "Mission-critical, always-on monitoring", Mark: PulseMark },
  { key: "C", name: "Motion Chevrons", note: "Freight moving forward", Mark: ChevronMark },
  { key: "D", name: "Hex Badge 9", note: "Industrial / seal of authority", Mark: HexMark },
  { key: "E", name: "5·9 Monogram", note: "The promise spelled out", Mark: FiveNineMark },
  { key: "F", name: "Atom Orbit (current)", note: "Five orbits = five nines", Mark: AtomMark },
]

export default function LogoLab() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Logo Lab</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground text-balance">Six directions, judged at real sizes</h1>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Each mark is a single-color vector. The columns show it large, at header size, at favicon size, and
            one-color on light — the four tests a real logo has to pass. Tell me a letter to pursue.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {CANDIDATES.map(({ key, name, note, Mark }) => (
            <section
              key={key}
              className="grid grid-cols-1 items-center gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-[1fr_auto]"
            >
              <div className="flex items-center gap-6">
                <div className="text-primary" style={{ width: 88, height: 88 }}>
                  <Mark className="h-full w-full" />
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-primary" style={{ width: 40, height: 40 }}>
                    <Mark className="h-full w-full" />
                  </div>
                  <div className="text-primary" style={{ width: 20, height: 20 }}>
                    <Mark className="h-full w-full" />
                  </div>
                  <div
                    className="flex items-center justify-center rounded bg-white text-neutral-900"
                    style={{ width: 56, height: 56 }}
                  >
                    <div style={{ width: 36, height: 36 }}>
                      <Mark className="h-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:text-right">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Option {key}</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{name}</p>
                <p className="text-sm text-muted-foreground">{note}</p>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Header preview</p>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            {CANDIDATES.map(({ key, name, Mark }) => (
              <div key={key} className="flex items-center gap-2.5">
                <div className="text-primary" style={{ width: 30, height: 30 }}>
                  <Mark className="h-full w-full" />
                </div>
                <div className="leading-none">
                  <p className="text-sm font-bold tracking-tight text-foreground">FIVE NINES</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Option {key}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
