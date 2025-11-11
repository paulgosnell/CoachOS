import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { text } = await req.json()

    if (!text) {
      return new Response('No text provided', { status: 400 })
    }

    // Generate speech with OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1', // or 'tts-1-hd' for higher quality
      voice: 'nova', // Professional, warm voice (alternatives: alloy, echo, fable, onyx, shimmer)
      input: text,
      speed: 1.0,
    })

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('TTS error:', error)
    return new Response(error.message || 'Internal server error', { status: 500 })
  }
}
