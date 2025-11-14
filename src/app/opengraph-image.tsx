import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Coach OS - Your Business Coach In Your Pocket'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// OG Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0C2340 0%, #0A0A0A 50%, #1A1A1A 100%)',
          padding: '80px',
        }}
      >
        {/* Logo/Brand Mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              fontFamily: 'serif',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #C0C0C8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Coach OS
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            fontFamily: 'serif',
            textAlign: 'center',
            color: '#E8E8ED',
            lineHeight: 1.2,
            marginBottom: 30,
            maxWidth: 900,
          }}
        >
          Your Executive Coach, Always Available
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 28,
            textAlign: 'center',
            color: '#C0C0C8',
            lineHeight: 1.4,
            marginBottom: 50,
            maxWidth: 800,
          }}
        >
          Strategic guidance powered by AI, with full context of your business
        </div>

        {/* Tech Stack Badges */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['GPT-4o', 'Gemini 2.5', 'Whisper', 'ElevenLabs', 'RAG Memory'].map((tech) => (
            <div
              key={tech}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                fontSize: 18,
                color: '#8E8E93',
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            fontSize: 24,
            color: '#707078',
          }}
        >
          ceocoachos.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
