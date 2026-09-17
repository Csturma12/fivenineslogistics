import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// Apple touch icon — the Stacked Plates mark (Blackbox layered-plate lineage,
// green live-load plate on top) rendered to a real PNG from the same geometry
// as app/icon.svg.
const mark = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="180" height="180">
  <rect width="48" height="48" fill="#131820" />
  <path d="M7 33 L15.5 23.5 L32.5 23.5 L41 33 L32.5 42.5 L15.5 42.5 Z" fill="#eef0f3" opacity="0.22" />
  <path d="M7 24 L15.5 14.5 L32.5 14.5 L41 24 L32.5 33.5 L15.5 33.5 Z" fill="#eef0f3" opacity="0.5" />
  <path d="M7 15 L15.5 5.5 L32.5 5.5 L41 15 L32.5 24.5 L15.5 24.5 Z" fill="#1f9d57" />
</svg>`

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <img
          width={180}
          height={180}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(mark)}`}
          alt=""
        />
      </div>
    ),
    { ...size },
  )
}
