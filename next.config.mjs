/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // The Request Capacity drawer's BOM / RFP tab posts attachments through a server action.
      bodySizeLimit: "22mb",
    },
  },
  async redirects() {
    return [
      { source: "/modes", destination: "/capabilities", permanent: true },
      { source: "/modes/:path*", destination: "/capabilities/:path*", permanent: true },
    ]
  },
}

export default nextConfig
