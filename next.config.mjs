/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/modes", destination: "/capabilities", permanent: true },
      { source: "/modes/:path*", destination: "/capabilities/:path*", permanent: true },
    ]
  },
}

export default nextConfig
