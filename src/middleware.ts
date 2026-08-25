import { type NextRequest, type NextFetchEvent } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Crawler logging.
 *
 * page_views only sees visitors that run JavaScript, so AI crawlers were
 * completely invisible. This runs before any JS and records them.
 *
 * Order matters below: the first match wins, so the more specific agent has to
 * come before the broader one it contains. ChatGPT-User before GPTBot,
 * Google-Extended before Googlebot, Applebot-Extended before Applebot.
 */
const BOTS: Array<{ match: string; name: string; category: string }> = [
  // Live retrieval, someone is asking a question right now
  { match: 'chatgpt-user', name: 'ChatGPT-User', category: 'ai_assistant' },
  { match: 'oai-searchbot', name: 'OAI-SearchBot', category: 'ai_assistant' },
  { match: 'perplexity-user', name: 'Perplexity-User', category: 'ai_assistant' },
  { match: 'claude-user', name: 'Claude-User', category: 'ai_assistant' },
  { match: 'claude-searchbot', name: 'Claude-SearchBot', category: 'ai_assistant' },
  { match: 'duckassistbot', name: 'DuckAssistBot', category: 'ai_assistant' },

  // Corpus crawling for training or index building
  { match: 'gptbot', name: 'GPTBot', category: 'ai_training' },
  { match: 'perplexitybot', name: 'PerplexityBot', category: 'ai_training' },
  { match: 'claudebot', name: 'ClaudeBot', category: 'ai_training' },
  { match: 'claude-web', name: 'Claude-Web', category: 'ai_training' },
  { match: 'anthropic-ai', name: 'anthropic-ai', category: 'ai_training' },
  { match: 'google-extended', name: 'Google-Extended', category: 'ai_training' },
  { match: 'applebot-extended', name: 'Applebot-Extended', category: 'ai_training' },
  { match: 'meta-externalagent', name: 'meta-externalagent', category: 'ai_training' },
  { match: 'bytespider', name: 'Bytespider', category: 'ai_training' },
  { match: 'amazonbot', name: 'Amazonbot', category: 'ai_training' },
  { match: 'ccbot', name: 'CCBot', category: 'ai_training' },
  { match: 'cohere-ai', name: 'cohere-ai', category: 'ai_training' },
  { match: 'diffbot', name: 'Diffbot', category: 'ai_training' },
  { match: 'imagesiftbot', name: 'ImagesiftBot', category: 'ai_training' },
  { match: 'timpibot', name: 'Timpibot', category: 'ai_training' },
  { match: 'omgili', name: 'omgili', category: 'ai_training' },

  // Conventional search
  { match: 'googlebot', name: 'Googlebot', category: 'search' },
  { match: 'bingbot', name: 'Bingbot', category: 'search' },
  { match: 'yandexbot', name: 'YandexBot', category: 'search' },
  { match: 'duckduckbot', name: 'DuckDuckBot', category: 'search' },
  { match: 'baiduspider', name: 'Baiduspider', category: 'search' },
  { match: 'applebot', name: 'Applebot', category: 'search' },
  { match: 'ahrefsbot', name: 'AhrefsBot', category: 'search' },
  { match: 'semrushbot', name: 'SemrushBot', category: 'search' },

  // Link unfurling
  { match: 'linkedinbot', name: 'LinkedInBot', category: 'social' },
  { match: 'twitterbot', name: 'Twitterbot', category: 'social' },
  { match: 'facebookexternalhit', name: 'FacebookExternalHit', category: 'social' },
  { match: 'slackbot', name: 'Slackbot', category: 'social' },
  { match: 'discordbot', name: 'Discordbot', category: 'social' },
  { match: 'telegrambot', name: 'TelegramBot', category: 'social' },
  { match: 'whatsapp', name: 'WhatsApp', category: 'social' },
]

function identifyBot(userAgent: string) {
  const ua = userAgent.toLowerCase()
  return BOTS.find((bot) => ua.includes(bot.match)) ?? null
}

async function logCrawlerHit(row: Record<string, string | null>) {
  // Several production env values still carry trailing newlines from the old
  // `echo | vercel env add` bug. An untrimmed key produces a malformed
  // Authorization header and a silent 401, so trim before use.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\n/g, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/\n/g, '')
  if (!url || !key) return

  await fetch(`${url}/rest/v1/bot_crawls`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  })
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Logging must never be able to break auth or a page render, so everything
  // here is wrapped and the existing auth logic below always runs regardless
  // of what happens in this block.
  try {
    const userAgent = request.headers.get('user-agent')
    if (userAgent) {
      const bot = identifyBot(userAgent)
      if (bot) {
        event.waitUntil(
          logCrawlerHit({
            host: request.headers.get('host'),
            path: request.nextUrl.pathname,
            bot_name: bot.name,
            bot_category: bot.category,
            user_agent: userAgent.slice(0, 500),
            country: request.headers.get('x-vercel-ip-country'),
            method: request.method,
          }).catch(() => {}),
        )
      }
    }
  } catch {
    // Deliberately swallowed. A logging failure is not worth breaking auth.
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
