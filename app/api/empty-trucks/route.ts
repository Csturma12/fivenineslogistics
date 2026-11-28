export async function GET(request: Request) {
  if (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 })
  }
  if (new URL(request.url).search) return new Response(null, { status: 400 })
  const base = process.env.FREIGHT_DASHBOARD_URL
  const key = process.env.FREIGHT_DASHBOARD_PUBLISHABLE_KEY
  if (base && key) {
    try {
      const response = await fetch(new URL("/rest/v1/rpc/five_nines_empty_trucks", base), {
        headers: { apikey: key }, next: { revalidate: 30 }, signal: AbortSignal.timeout(10000),
      })
      if (response.ok) {
        const trucks = await response.json()
        if (Array.isArray(trucks)) {
          return Response.json(trucks, { headers: { "Cache-Control": "public, max-age=0, s-maxage=30" } })
        }
      }
      console.error("Empty truck feed returned an unexpected response", response.status)
    } catch (error) {
      console.error("Empty truck feed failed", error instanceof Error ? error.name : "Unknown error")
    }
  }
  return Response.json({ error: "Truck availability unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } })
}
