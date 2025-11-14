# Coach OS - Your Business Coach In Your Pocket

Premium AI-powered executive coaching platform for ambitious business leaders.

## Overview

Coach OS is a production-ready Next.js application providing on-demand business coaching powered by GPT-4o, Gemini 2.5 Flash, and advanced memory systems. We combine proven coaching frameworks with AI to deliver personalized, context-aware guidance that understands your business.

## Features

### Core Capabilities
- **🎙️ Voice Coaching** - Real-time voice conversations with Gemini 2.5 Flash & ElevenLabs
- **💬 Text Coaching** - GPT-4o powered strategic guidance
- **🧠 Long-Term Memory** - RAG-based memory system that recalls context across sessions
- **📊 Progress Tracking** - Beautiful data visualizations of your coaching journey
- **✅ Auto Action Extraction** - Automatically captures commitments from conversations
- **🎯 Structured Sessions** - Framework-based coaching (GROW, SWOT, OKRs, etc.)
- **📱 PWA Support** - Installable on mobile/desktop with offline capabilities

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI Models**:
  - GPT-4o for text coaching
  - Gemini 2.5 Flash for voice coaching
  - Whisper for speech-to-text
  - ElevenLabs for voice synthesis
  - OpenAI embeddings for RAG memory
- **Charts**: Recharts for data visualization
- **Fonts**: Playfair Display (serif) for headings, System fonts for body
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Google Gemini API key
- ElevenLabs API key

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd CoachOS
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Add your keys to `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Google Gemini
GOOGLE_GEMINI_API_KEY=your_gemini_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up the database**
```bash
# See DATABASE-SETUP.md for detailed instructions
# Run migrations in supabase/migrations/
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── chat/              # Chat interface
│   │   ├── dashboard/         # Main dashboard
│   │   ├── sessions/          # Coaching sessions
│   │   └── ...
│   ├── components/            # React components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── chat/              # Chat UI components
│   │   ├── voice/             # Voice interface components
│   │   └── sessions/          # Session components
│   ├── lib/                   # Utilities and helpers
│   │   ├── supabase/          # Supabase client setup
│   │   ├── openai/            # OpenAI integration
│   │   └── ...
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
│   ├── icon.svg               # App icon
│   ├── manifest.json          # PWA manifest
│   ├── robots.txt             # SEO
│   ├── llms.txt               # LLM discovery file
│   └── ...
├── supabase/                  # Supabase migrations & config
│   ├── migrations/            # Database migrations
│   └── functions/             # Edge functions
└── tailwind.config.ts         # Tailwind configuration
```

## Key Features Documentation

### Design System
See [coach-os-design-system.md](./coach-os-design-system.md) for:
- Color palette and typography
- Component guidelines
- Animation patterns
- Accessibility standards

### Database Setup
See [DATABASE-SETUP.md](./DATABASE-SETUP.md) for:
- Schema overview
- Migration instructions
- RLS policies
- Vector search setup

### Voice Coaching
See [VOICE-COACH-SETUP.md](./VOICE-COACH-SETUP.md) for:
- Gemini 2.5 Flash integration
- ElevenLabs voice synthesis
- Real-time conversation flow

### Production Deployment
See [PRODUCTION-READY.md](./PRODUCTION-READY.md) for:
- Deployment checklist
- Environment setup
- Performance optimization
- Security considerations

## SEO & Discovery

- **Domain**: ceocoachos.com
- **Sitemap**: Auto-generated at `/sitemap.xml`
- **Robots**: Configured in `/robots.txt`
- **OG Images**: Dynamic generation via Next.js
- **LLM Discovery**: `/llms.txt` and `/llms-full.txt` for AI assistants

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production server
npm run lint         # Run ESLint
```

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

This is a private project. For questions or collaboration opportunities, contact the maintainer.

## License

Proprietary - All Rights Reserved

## Support

For questions about the codebase:
- Check documentation in this repo
- Review inline code comments
- See individual feature docs (VOICE-COACH-SETUP.md, etc.)

---

**Built by**: Paul Gosnell
**Domain**: [ceocoachos.com](https://ceocoachos.com)
**Status**: Production-Ready Beta
**Last Updated**: November 14, 2025
