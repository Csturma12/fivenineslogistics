import type { NextRequest } from "next/server"

const PRODUCTION_ORIGIN = "https://fivenineslogistics.com"

function isLocalHost(host: string) {
  const name = host.split(":")[0].toLowerCase()
  return name === "localhost" || name === "127.0.0.1" || name === "0.0.0.0" || name === "[::1]"
}

/**
 * Origin to put in links we email out. Behind Vercel/v0 proxies the raw
 * request origin can be `localhost`, which is unreachable from the
 * recipient's device, so prefer the forwarded host and never emit localhost.
 */
export function publicOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
  const host = forwardedHost || req.headers.get("host") || req.nextUrl.host

  if (!host || isLocalHost(host)) return PRODUCTION_ORIGIN

  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
  const proto = forwardedProto || req.nextUrl.protocol.replace(":", "") || "https"
  return `${proto}://${host}`
}
