import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// Apple touch icon — the Stacked Plates mark (Blackbox layered-plate lineage,
// green live-load plate on top) rendered to a real PNG from the same geometry
// as app/icon.svg.
const mark = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="180" height="180">
  <rect width="48" height="48" fill="#131820" />
  <g transform="translate(0,2)">
    <path d="M8 30 L16 23 L32 23 L40 30 L40 33.6 L32 26.6 L16 26.6 L8 33.6 Z" fill="#eef0f3" opacity="0.16" />
    <path d="M8 30 L16 23 L32 23 L40 30 L32 37 L16 37 Z" fill="#eef0f3" opacity="0.26" />
    <path d="M8 22 L16 15 L32 15 L40 22 L40 25.6 L32 18.6 L16 18.6 L8 25.6 Z" fill="#eef0f3" opacity="0.34" />
    <path d="M8 22 L16 15 L32 15 L40 22 L32 29 L16 29 Z" fill="#eef0f3" opacity="0.52" />
    <path d="M8 14 L16 7 L32 7 L40 14 L40 17.6 L32 10.6 L16 10.6 L8 17.6 Z" fill="#1f9d57" opacity="0.6" />
    <path d="M8 14 L16 7 L32 7 L40 14 L32 21 L16 21 Z" fill="#1f9d57" />
  </g>
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
