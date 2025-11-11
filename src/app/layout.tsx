import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coach OS - Your Business Coach In Your Pocket',
  description: 'Premium on-demand business coaching for executives and founders. Strategic guidance whenever you need it, with full context of your business.',
  keywords: ['business coaching', 'executive coaching', 'founder coaching', 'CEO coaching', 'strategic guidance'],
  authors: [{ name: 'Coach OS' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#000000',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Coach OS',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
