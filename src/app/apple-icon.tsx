import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Apple icon generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C0C0C8',
          fontFamily: 'serif',
          fontWeight: 700,
          borderRadius: 40,
        }}
      >
        C
      </div>
    ),
    {
      ...size,
    }
  )
}
