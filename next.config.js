/** @type {import('next').NextConfig} */
const nextConfig = {
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
