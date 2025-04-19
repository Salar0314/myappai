/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ltwxfnxvpswipkiytlvy.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable middleware
  experimental: {
    middleware: true,
  },
}

module.exports = nextConfig 