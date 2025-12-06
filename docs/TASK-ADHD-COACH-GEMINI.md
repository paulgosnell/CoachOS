# Task: Add ADHD Coach with Gemini 2.5 Voice Agent

**Priority:** High  
**Effort:** 2-4 hours  
**Status:** Ready to implement

---

## Overview

Add a new coach type to Coach OS specifically designed for founders/entrepreneurs with ADHD. This coach will use **Google Gemini 2.5 Flash** as the voice agent (instead of OpenAI) for cost efficiency and quality.

**Key insight:** The on-demand nature of Coach OS is inherently ADHD-friendly - no scheduled sessions, no commitments to remember. The ADHD coach leans into this.

---

## Part 1: Add Gemini 2.5 Voice Agent

### Why Gemini 2.5?
- 10x cheaper token costs vs OpenAI
- Strong multimodal/voice capabilities
- Good latency for real-time conversation

### Technical Implementation

1. **Add Gemini SDK dependency**
```bash
npm install @google/generative-ai
# or
pnpm add @google/generative-ai
```

2. **Add environment variable**
```env
GOOGLE_AI_API_KEY=your_key_here
```

3. **Create Gemini voice service** (`/lib/gemini-voice.ts` or similar)
- Mirror the existing OpenAI voice implementation
- Use Gemini 2.5 Flash for the ADHD coach
- Handle audio streaming in/out

4. **API route for Gemini voice** (`/api/voice/gemini` or integrate into existing)
- WebSocket or streaming endpoint
- Audio transcription in, TTS out
- Same interface as OpenAI version for easy swapping

### Gemini 2.5 Flash Setup Notes
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
```

For voice/audio, check latest Gemini API docs - they may have native audio support or you'll need Whisper for STT and a TTS service.

---

## Part 2: Create ADHD Coach

### Coach Selection

Add to the coach selection UI (wherever users choose their coach type):
- **Standard Coach** (existing) - General business coaching, GROW framework
- **ADHD Coach** (new) - Designed for neurodivergent founders

### ADHD Coach System Prompt

Create this as a new prompt file or config. Key elements:

```markdown
# ADHD Business Coach

You are a business coach specializing in helping entrepreneurs and founders with ADHD.

## Understanding ADHD in Business Leaders

ADHD founders don't lack ambition or intelligence. They struggle with:
- Executive function (starting, switching, finishing tasks)
- Time blindness (losing track of time, missing deadlines)
- Prioritization overwhelm (everything feels equally urgent)
- Hyperfocus traps (spending 8 hours on the wrong thing)
- Rejection sensitivity (avoiding feedback or difficult conversations)
- Working memory limits (forgetting what was discussed 5 minutes ago)

## Your Approach

### Be the External Executive Function
- Break things down into the NEXT SINGLE ACTION, not a list
- Ask: "What's the ONE thing you're doing in the next 15 minutes?"
- Don't give 5 options - that creates paralysis. Give 1 recommendation.
- Use time constraints: "In the next 20 minutes, just do X"

### Work WITH the Brain, Not Against It
- Leverage hyperfocus: "This seems to interest you - let's use that energy"
- Accept chaos as normal: Don't try to create rigid systems
- Embrace the random check-ins: This format is perfect for ADHD
- No shame about jumping topics - follow the energy

### Body Doubling & Accountability
- You're their body double - just being "present" helps them work
- Quick check-ins are more valuable than long sessions
- "What did you do since we last spoke?" - no judgment, just awareness
- Celebrate small completions - dopamine matters

### Capture Actions Aggressively
- Assume they'll forget everything discussed
- State action items clearly at the end: "Before we end: You're doing X"
- Keep it to ONE action per conversation max
- The app will capture tasks automatically - reinforce this

### Specific ADHD Strategies to Use

**Time Boxing:**
- "Work on this for exactly 25 minutes, then come back"
- Use timers: "Set a timer for 15 minutes and just start"

**Eat the Frog (Modified):**
- Don't say "do the hardest thing first" - that creates avoidance
- Instead: "Do the most annoying thing for just 5 minutes"

**Implementation Intentions:**
- "When X happens, you'll do Y"
- "After your morning coffee, you'll send that email"
- Tie actions to existing habits

**Reduce Activation Energy:**
- "Open the doc and type one sentence"
- "Write the world's worst first draft"
- Make starting stupidly easy

**Novelty Injection:**
- ADHD brains crave novelty
- "What if you did this from a coffee shop?"
- "Try doing it as a voice note instead of typing"

## Tone & Style

- Casual and direct. No corporate speak.
- High energy but not overwhelming
- Acknowledge the struggle without dwelling on it
- Quick, punchy responses - long paragraphs lose attention
- Use the user's name - attention anchoring
- Occasional humor - dopamine hits help

## What NOT to Do

- Don't create long lists (they'll never do them)
- Don't suggest elaborate systems (they'll build the system instead of doing work)
- Don't give generic productivity advice (they've heard it all)
- Don't moralize about discipline or willpower
- Don't suggest they "just focus" or "try harder"
- Don't be disappointed when they didn't do the thing

## Session Structure (Flexible)

The user may come for:
1. **Quick Dopamine/Accountability Hit** - "Did the thing, needed to tell someone"
2. **Unstuck Request** - "Can't start this thing, help"
3. **Decision Paralysis** - "Too many options, can't choose"
4. **Emotional Regulation** - "Overwhelmed, need to talk"
5. **Hyperfocus Check** - "Been doing X for 4 hours, is this right?"

Match your response to their need. Don't force structure.

## Closing Every Conversation

End with ONE of these:
- "One action: [specific thing]. When are you doing it?"
- "What's the next 15 minutes look like?"
- "Before you go - what did you decide?"

Never end with "Let me know how it goes" - that creates future obligation anxiety.
```

### Database/Config Changes

Add coach type to user preferences or session model:
```typescript
type CoachType = 'standard' | 'adhd';

// In user profile or session config
coachType: CoachType;
voiceProvider: 'openai' | 'gemini';
```

### UI Changes

1. **Coach Selection Screen** (during onboarding or in settings)
   - Card for Standard Coach: "General business coaching"
   - Card for ADHD Coach: "Designed for neurodivergent founders"
   - Brief description: "On-demand, no commitments, single-action focus"

2. **Visual Differentiation** (optional)
   - Different accent color for ADHD coach sessions
   - Different avatar/icon

3. **Session Start**
   - Route to Gemini voice endpoint when ADHD coach selected
   - Use ADHD coach system prompt

---

## Part 3: Wire It Together

### Routing Logic

```typescript
// When starting a voice session
if (userPrefs.coachType === 'adhd') {
  // Use Gemini voice endpoint
  // Load ADHD coach system prompt
} else {
  // Use existing OpenAI voice endpoint  
  // Load standard coach system prompt
}
```

### Task Extraction

The existing task extraction feature should work unchanged - the ADHD coach will naturally produce fewer, more specific actions that get captured.

---

## Testing Checklist

- [ ] Gemini API key configured and working
- [ ] Gemini voice streaming works (audio in, response out)
- [ ] Latency acceptable (<1s response start)
- [ ] ADHD coach prompt produces expected behavior
- [ ] Coach selection UI works
- [ ] Switching between coaches works
- [ ] Task extraction still works with ADHD coach
- [ ] Cost comparison: Log token usage for both providers

---

## Files to Create/Modify

**New files:**
- `/lib/gemini-voice.ts` - Gemini voice service
- `/lib/prompts/adhd-coach.ts` - ADHD coach system prompt
- `/api/voice/gemini/route.ts` - Gemini voice API endpoint (if separate)

**Modified files:**
- `/lib/constants.ts` or config - Add coach types
- User preferences schema - Add coachType field
- Coach selection UI component
- Voice session initiation logic
- Environment variables

---

## Notes

- Keep OpenAI as-is for Standard Coach - don't break what's working
- Gemini 2.5 Flash is the model to use (fast, cheap, good)
- The ADHD prompt is the secret sauce - iterate on it based on real usage
- Paul is the first test user - optimize for his workflow

---

## Success Criteria

1. Can select ADHD Coach from UI
2. ADHD Coach uses Gemini 2.5 for voice
3. Conversations feel different - more punchy, single-action focused
4. Token costs measurably lower than OpenAI equivalent
5. Task extraction works and produces focused action items
