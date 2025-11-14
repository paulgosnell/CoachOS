import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ceocoachos.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Coach OS - Your Business Coach In Your Pocket',
    template: '%s | Coach OS'
  },
  description: 'Premium on-demand business coaching for executives and founders. Strategic guidance powered by AI, with full context of your business. Available 24/7 with long-term memory and proven coaching frameworks.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  keywords: [
    'business coaching',
    'executive coaching',
    'founder coaching',
    'CEO coaching',
    'strategic guidance',
    'AI coaching',
    'GPT-4o coach',
    'business advisor',
    'leadership coaching',
    'startup coach',
    'on-demand coaching',
    'professional coaching',
    'AI executive coach',
    'business coach app',
    'CEO coach',
    'founder coach'
  ],
  authors: [{ name: 'Coach OS', url: siteUrl }],
  creator: 'Coach OS',
  publisher: 'Coach OS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Coach OS',
    title: 'Coach OS - Your Executive Coach, Always Available',
    description: 'Premium on-demand business coaching for executives and founders. Strategic guidance powered by GPT-4o, Gemini 2.5, with RAG memory. Available 24/7.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Coach OS - Your Business Coach In Your Pocket',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Coach OS - Your Executive Coach, Always Available',
    description: 'Premium on-demand business coaching for executives and founders. Strategic guidance powered by GPT-4o, Gemini 2.5, with RAG memory. Available 24/7.',
    images: ['/opengraph-image'],
    creator: '@coachos',
    site: '@coachos',
  },

  // iOS Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Coach OS',
  },

  // Additional metadata
  alternates: {
    canonical: siteUrl,
  },

  category: 'Business',
  classification: 'Business Coaching',

  // Verification tags (add when ready)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Coach OS',
              url: siteUrl,
              logo: `${siteUrl}/icon.svg`,
              description: 'Premium on-demand business coaching for executives and founders.',
              sameAs: [
                // Add social media links when available
                // 'https://twitter.com/coachos',
                // 'https://linkedin.com/company/coachos',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                availableLanguage: ['English'],
              },
            }),
          }}
        />
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Coach OS',
              url: siteUrl,
              description: 'Your Business Coach In Your Pocket',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteUrl}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Coach OS',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web, iOS, Android',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                ratingCount: '1',
              },
              description: 'AI-powered executive coaching platform with long-term memory, voice interface, and proven coaching frameworks.',
            }),
          }}
        />
      </head>
      <body className={`${playfair.variable} min-h-screen`}>{children}</body>
    </html>
  )
}
