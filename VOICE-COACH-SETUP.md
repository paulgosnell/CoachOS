# Voice Coach Setup Guide

## Overview

Coach OS now includes **ElevenLabs Conversational AI** integration for real-time, bidirectional voice coaching. This replaces the clunky "voice note" style with actual phone-call quality conversations.

## What Changed

### Before (Voice Notes):
- User records audio
- Sends to Whisper for transcription
- Text appears in chat
- GPT-4o generates text response
- **Total latency: 3-5 seconds per turn**
- Feels like leaving voicemails

### After (Conversational AI):
- User speaks naturally
- ElevenLabs processes in real-time
- Coach responds while you're thinking
- **Total latency: ~500ms**
- Feels like a phone call with a real coach

## Architecture

```
User speaks → ElevenLabs (STT + LLM + TTS) → User hears coach
                      ↑
                Your Coach OS system prompt + RAG context
```

**Key Components:**
1. `/voice-coach` page - React UI with ElevenLabs SDK
2. `/api/voice/conversation` - Creates signed conversation with your context
3. `@11labs/react` hook - Manages WebSocket/WebRTC connection
4. Full integration with existing system prompt and RAG memory

## Setup Instructions

### 1. Get ElevenLabs API Key

1. Go to https://elevenlabs.io/sign-up
2. Navigate to Profile → API Keys
3. Create new API key
4. Copy the key

### 2. Add to Environment Variables

**Production (Vercel):**
```bash
# Add to Vercel environment variables
ELEVENLABS_API_KEY=your_key_here
```

**Local Development:**
```bash
# Add to .env.local
ELEVENLABS_API_KEY=your_key_here
```

### 3. Install Dependencies

```bash
npm install
```

This installs:
- `@11labs/react@^0.3.2` - ElevenLabs React SDK
- `elevenlabs@^0.19.4` - ElevenLabs Node.js client

### 4. Deploy

```bash
git add .
git commit -m "feat: Add ElevenLabs Conversational AI voice coach"
git push origin main
```

Vercel will auto-deploy.

## Usage

### For Users:

1. Navigate to `/voice-coach` or click "Voice Coach" button in chat sidebar
2. Click "Start Voice Session"
3. Allow microphone access when prompted
4. Start speaking naturally
5. Coach responds in real-time

### Features:

- **Full Context:** Coach has access to your business profile, goals, and past conversations via RAG
- **Natural Turn-Taking:** ElevenLabs' proprietary model understands pauses vs conversation endpoints
- **Emotion Preservation:** Tone and emotion are preserved (critical for coaching)
- **Live Transcript:** Optional on-screen transcript of conversation
- **Switch Modes:** Easy toggle between voice and text chat

## Pricing

**ElevenLabs Conversational AI:**
- Free tier: 15 minutes to test
- Business plan: $0.08/minute ($4.80/hour)
- Compare to OpenAI Realtime API: $0.30/min ($18/hour)

**Recommendation:** Start with free 15 minutes, then upgrade to Business plan.

## Customization

### Change Voice

Edit `/src/app/api/voice/conversation/route.ts`:

```typescript
tts: {
  voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel - professional female
  // Or try:
  // 'pNInz6obpgDQGcFmaJgB' - Adam - professional male
  // 'EXAVITQu4vr4xnSDxMaL' - Bella - warm, friendly
}
```

Browse all voices: https://elevenlabs.io/voice-library

### Adjust First Message

Edit `/src/app/api/voice/conversation/route.ts`:

```typescript
first_message: `Hey ${firstName}! Ready to dive in?`,
```

### Modify System Prompt

The voice coach uses the same system prompt as text chat (`/src/lib/ai/prompts.ts`), but you can override it specifically for voice if needed.

## Troubleshooting

### "Unauthorized" Error
- Check `ELEVENLABS_API_KEY` is set in environment variables
- Verify key is valid at https://elevenlabs.io/app/api-keys

### Microphone Not Working
- Ensure user granted microphone permission
- Check browser console for permission errors
- Try HTTPS (required for mic access)

### Poor Audio Quality
- User should use headphones to avoid echo
- Ensure quiet environment
- Check internet connection speed

### "Failed to start conversation"
- Check API key is valid
- Verify ElevenLabs account has available minutes
- Check browser console for detailed error

## Technical Details

### ElevenLabs Agent Configuration

The agent is dynamically created per conversation with:
- **System Prompt:** Your full Coach OS prompt with user context
- **Language:** English (configurable)
- **Voice:** Rachel (premium female voice, configurable)
- **Turn-Taking:** Proprietary ElevenLabs model (understands natural pauses)

### Data Flow

1. User clicks "Start Voice Session"
2. Frontend calls `/api/voice/conversation` (POST)
3. Backend assembles user context (profile, goals, RAG memories)
4. Backend generates Coach OS system prompt
5. Backend creates ElevenLabs conversation with prompt + context
6. Backend returns signed WebSocket URL
7. Frontend connects to ElevenLabs via `@11labs/react` SDK
8. User speaks ↔ ElevenLabs processes ↔ Coach responds
9. Conversation continues until user clicks "End Call"

### Security

- Signed URLs expire after session
- Requires user authentication via Supabase
- API key never exposed to client
- Microphone access requires user permission

## Next Steps

### Optional Enhancements:

1. **Save Transcripts to Database**
   - Store conversation transcript in `messages` table
   - Link to existing conversation history

2. **Session Analytics**
   - Track voice session duration
   - Measure user engagement
   - Compare voice vs text usage

3. **Voice Customization**
   - Let users choose coach voice
   - Adjust speaking speed
   - Enable/disable transcript

4. **Mobile PWA**
   - Works in mobile browsers
   - Consider native app for better mic handling

## Comparison: Voice Notes vs Conversational AI

| Feature | Voice Notes (Old) | Conversational AI (New) |
|---------|------------------|------------------------|
| Latency | 3-5 seconds | ~500ms |
| Turn-taking | Manual (stop/start) | Automatic |
| Emotion | Lost in transcription | Preserved |
| UX | Clunky | Natural |
| Cost | $0.06/min Whisper + GPT | $0.08/min all-in |
| Context | Full RAG + prompt | Full RAG + prompt |

## Resources

- ElevenLabs Docs: https://elevenlabs.io/docs/conversational-ai
- React SDK: https://elevenlabs.io/docs/conversational-ai/libraries/react
- Voice Library: https://elevenlabs.io/voice-library
- Pricing: https://elevenlabs.io/pricing

---

**Status:** ✅ Production Ready
**Added:** 2025-01-12
**Version:** 1.0
