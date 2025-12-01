import { NextResponse } from 'next/server'

// Track demo sessions in memory (consider Redis for production)
const demoSessions = new Map<string, { startTime: number, endTime: number }>()

// Cleanup old sessions every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [sessionId, data] of demoSessions.entries()) {
        if (now - data.startTime > 10 * 60 * 1000) { // 10 minutes old
            demoSessions.delete(sessionId)
        }
    }
}, 5 * 60 * 1000)

export async function POST(req: Request) {
    try {
        const { sessionId } = await req.json()

        // Check if session exists and hasn't exceeded time limit
        if (sessionId && demoSessions.has(sessionId)) {
            const session = demoSessions.get(sessionId)!
            const elapsed = Date.now() - session.startTime

            // 3 minute limit (180 seconds)
            if (elapsed > 180 * 1000) {
                return NextResponse.json(
                    { error: 'Demo time limit reached. Sign up for unlimited access!' },
                    { status: 429 }
                )
            }
        } else if (!sessionId) {
            // Create new session
            const newSessionId = crypto.randomUUID()
            demoSessions.set(newSessionId, {
                startTime: Date.now(),
                endTime: Date.now() + 180 * 1000 // 3 minutes
            })
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            )
        }

        // Create ephemeral session token
        const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-realtime-preview-2024-12-17',
                voice: 'verse' // Same voice as the main app
            })
        })

        if (!response.ok) {
            const errorData = await response.text()
            console.error('OpenAI Realtime API error:', errorData)
            throw new Error(`Failed to create session: ${response.status}`)
        }

        const data = await response.json()

        return NextResponse.json({
            client_secret: data.client_secret
        })
    } catch (error: any) {
        console.error('Demo voice session creation error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
