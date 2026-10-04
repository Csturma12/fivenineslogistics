import zipcodes from "zipcodes";

type Place = { label: string; city: string; state: string; zip: string };
type CityEntry = Place & { key: string; zips: number };

let cityIndex: CityEntry[] | null = null;

// ZIP count per city stands in for city size so "Chicago" outranks "Chicago Heights".
function cities() {
  if (cityIndex) return cityIndex;
  const byCity = new Map<string, CityEntry>();
  for (const z of Object.values(zipcodes.codes)) {
    if (!z.city || !z.state) continue;
    const id = `${z.city}|${z.state}`;
    const existing = byCity.get(id);
    if (existing) existing.zips += 1;
    else
      byCity.set(id, {
        label: `${z.city}, ${z.state}`,
        city: z.city,
        state: z.state,
        zip: z.zip,
        key: z.city.toLowerCase(),
        zips: 1,
      });
  }
  cityIndex = [...byCity.values()].sort((a, b) => b.zips - a.zips);
  return cityIndex;
}

function search(raw: string): Place[] {
  const q = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (/^\d{3,5}$/.test(q)) {
    const out: Place[] = [];
    for (const z of Object.values(zipcodes.codes)) {
      if (z.zip.startsWith(q) && z.city && z.state) {
        out.push({ label: `${z.city}, ${z.state} ${z.zip}`, city: z.city, state: z.state, zip: z.zip });
        if (out.length >= 8) break;
      }
    }
    return out;
  }
  const [cityPart, statePart = ""] = q.split(",").map((s) => s.trim());
  if (cityPart.length < 2) return [];
  const state = statePart.toUpperCase();
  const out: Place[] = [];
  for (const c of cities()) {
    if (!c.key.startsWith(cityPart)) continue;
    if (state && !c.state.startsWith(state)) continue;
    out.push({ label: c.label, city: c.city, state: c.state, zip: c.zip });
    if (out.length >= 8) break;
  }
  return out;
}

export function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") || "").slice(0, 60);
  return Response.json(
    { places: search(q) },
    { headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } },
  );
}
