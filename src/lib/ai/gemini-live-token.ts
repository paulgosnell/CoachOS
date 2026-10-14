/**
 * Short-lived Gemini Live credentials for the browser.
 *
 * Gemini Live runs over a WebSocket opened by the browser. /api/gemini-live-session
 * used to return the raw API key in the socket URL to any signed-in user, so it
 * could be lifted and used for any Gemini API on our bill. Now the key stays on the
 * server: each call mints a single-use ephemeral token that must start its
 * session within two minutes and dies after thirty.
 *
 * Ephemeral tokens only work on the Constrained endpoint (the plain
 * BidiGenerateContent endpoint rejects them with 1008). Same pattern as
 * AccountsOS lib/ai/gemini-live-token.ts.
 */

const TOKEN_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/auth_tokens';
const CONSTRAINED_WS_URL =
  'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained';

const SESSION_START_WINDOW_MS = 2 * 60 * 1000;
const TOKEN_LIFETIME_MS = 30 * 60 * 1000;

export class GeminiLiveTokenError extends Error {}

/** Returns a socket URL carrying a single-use ephemeral token, never the API key. */
export async function mintGeminiLiveWsUrl(): Promise<string> {
  const apiKey = (process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY)?.trim();
  if (!apiKey) throw new GeminiLiveTokenError('GOOGLE_AI_API_KEY not configured');

  const now = Date.now();
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uses: 1,
      expireTime: new Date(now + TOKEN_LIFETIME_MS).toISOString(),
      newSessionExpireTime: new Date(now + SESSION_START_WINDOW_MS).toISOString(),
      // No bidiGenerateContentSetup lock: a locked setup replaces the client's
      // own setup (system prompt, tools, voice). Single use and a two-minute
      // start window bound the risk instead.
    }),
  });
  const data = (await res.json().catch(() => null)) as { name?: string } | null;
  if (!res.ok || !data?.name) {
    throw new GeminiLiveTokenError(`Gemini token mint failed (${res.status})`);
  }

  return `${CONSTRAINED_WS_URL}?access_token=${encodeURIComponent(data.name)}`;
}
