/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pgtjqgvmgvpqrdiuhtjd.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
