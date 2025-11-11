# Coach OS - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** November 11, 2025  
**Status:** Pre-MVP Planning

---

## Executive Summary

**Product Name:** Coach OS (working title)  
**Tagline:** "Your business coach in your pocket"

**Core Value Proposition:**  
On-demand business coaching that fits your schedule. No booking friction, full context awareness, premium experience.

**Target Market:**
- Business executives
- Entrepreneurs and founders  
- Solopreneurs
- Business professionals seeking strategic guidance

**Business Model:**  
Freemium → Premium subscription (£100-200/month)

**MVP Timeline:** 4-6 weeks to functional beta

---

## Problem Statement

Traditional business coaching has significant friction:
- **Scheduling burden** - Booking slots, coordinating calendars
- **Lack of spontaneity** - Can't get advice when you need it most
- **Context switching** - Coaches often lack full business context
- **Isolation** - Solopreneurs and executives lack trusted sounding boards

Business professionals need:
- Instant access to strategic guidance
- A coach that knows their complete business context
- Flexibility to fit into unpredictable schedules
- Support that goes beyond coaching (research, brainstorming, strategizing)

---

## Product Vision

Coach OS eliminates the scheduling friction of traditional business coaching by providing an AI-powered coach that's:
- **Always available** - No booking required for quick check-ins
- **Fully context-aware** - Knows your business, goals, and history
- **Adaptive** - Fits your lifestyle (voice in car, text between meetings)
- **Proactive** - Follows up on commitments and important events
- **Multi-functional** - Coaching, strategizing, research, brainstorming

Unlike generic AI chat tools, Coach OS builds a comprehensive understanding of the user's business and journey over time, making every interaction informed by their complete history.

---

## Target Users

### Primary Personas

**1. The Solo Founder**
- Age: 28-40
- Building first startup, no co-founder
- Needs: Strategic guidance, validation, emotional support
- Pain: Lonely, no one to bounce ideas off
- Willingness to pay: £100/month

**2. The Scale-Up Exec**  
- Age: 35-50
- VP/C-level at growing company (50-500 employees)
- Needs: Strategic thinking time, unbiased input, leadership coaching
- Pain: Too busy for scheduled coaching, surrounded by yes-men
- Willingness to pay: £150-200/month

**3. The Corporate Intrapreneur**
- Age: 40-55  
- Senior exec in large organization
- Needs: Navigation of politics, strategic moves, innovation coaching
- Pain: Expensive traditional coaches, scheduling conflicts
- Willingness to pay: £200+/month (company may pay)

---

## Core Features (MVP)

### 1. Dual Interaction Modes

#### Quick Check-ins (Default Mode)
- Ad-hoc conversations via text or voice
- Always available, no scheduling needed
- Context-aware based on recent activity
- Duration: 2-10 minutes typically
- **Use cases:**
  - "Should I take this meeting?"
  - "Help me prep for this pitch"
  - "I'm stressed about X"
  - "Quick advice on hiring decision"

#### Structured Coaching Sessions (Booked Mode)
- 30-60 minute focused sessions
- User manually books and adds to calendar
- Follows proven coaching framework (GROW model)
- Covers specific goals/challenges in depth
- Session summaries and action items generated
- **Use cases:**
  - Monthly strategic planning
  - Quarterly goal setting
  - Deep dive on specific challenge
  - Career transition planning

### 2. Memory & Context System

#### Initial Onboarding (15-20 minutes)
Voice-first conversation collecting:
- **Business profile:**
  - Industry and company stage
  - Revenue range and team size
  - User's role and reporting structure
  - Location and market focus
- **Current situation:**
  - Top 3-5 business priorities
  - Key challenges and blockers
  - Recent wins and setbacks
- **Goals:**
  - 3-month, 6-month, 12-month objectives
  - Definition of success
- **Communication preferences:**
  - Coaching style preference
  - Voice personality selection
  - Preferred communication mode (voice/text default)

#### Continuous Context Building
- Every conversation stored and indexed
- Daily summaries generated automatically
- Weekly rollup summaries for long-term context
- Semantic search for past conversations
- Proactive follow-ups on commitments

#### Context Retrieval Strategy

**Always in prompt:**
- User business profile
- Current goals and OKRs
- Last 7 days of conversation summaries
- Outstanding action items and commitments

**Loaded on-demand:**
- Last 30 days of full conversations
- Weekly summaries for last 3 months

**RAG search (when needed):**
- Semantic search across all history
- Triggered by user references to past events
- Example: "That London pitch" → searches embeddings for relevant context

### 3. Voice & Text Parity

- **Voice mode:**
  - Real-time conversation using AI voice
  - High-quality, natural speech
  - Ideal for: driving, walking, private spaces
- **Text mode:**
  - Standard chat interface
  - Full markdown support
  - Ideal for: meetings, quiet thinking, detailed work
- **Seamless switching:**
  - Can start voice, continue text (or vice versa)
  - All transcripts stored for reference
- **User preference:**
  - Set default mode (voice or text)
  - Quick toggle always available

### 4. Beyond Coaching - Strategic Support

The coach can also:
- **Research support:**
  - "I have a meeting with [Company] - give me background"
  - "Research this market segment for me"
- **Brainstorming:**
  - "Help me think through naming options"
  - "Let's ideate on marketing approaches"
- **Strategic planning:**
  - "Help me plan Q1 priorities"
  - "Let's war-game this competitive threat"
- **Document support:**
  - "Help me draft this difficult email"
  - "Review this pitch deck outline"
- **Decision support:**
  - "Should I take this investor meeting?"
  - "Help me think through this hire"

The coach understands context well enough to know:
- What information to research
- What level of detail to provide
- What questions to ask back
- When to push back or challenge

### 5. Progressive Web App (Mobile-First)

**Core PWA Features:**
- Installable to home screen
- Offline mode: View past conversations
- Fast load times, app-like feel

**Push Notifications:**
- Scheduled session reminders (15 min before)
- Coach check-ins: "How did that pitch go?"
- Action item reminders
- Milestone celebrations

**Mobile-Optimized:**
- Dark mode as default
- One-handed operation
- Bottom navigation
- Swipe gestures
- Large touch targets

---

## User Flows

### First-Time User Journey

1. **Landing Page** → Email signup (waitlist for now)
2. **Welcome Email** → Invitation to onboard when ready
3. **App First Launch:**
   - Brief intro to Coach OS (30 seconds)
   - Coach selection screen (voice/style preferences)
4. **Voice Onboarding (15-20 min):**
   - Coach introduces itself
   - Conversational collection of business details
   - Current situation and challenges
   - Goals and objectives
   - Communication preferences
5. **Dashboard:**
   - Welcome message from coach
   - Quick action: "Ready for a quick check-in?"
   - Or: "Book your first structured session"

### Daily User Journey - Quick Check-in

1. Open app → Coach greeting (personalized, context-aware)
2. Tap voice button OR start typing
3. Conversation (2-10 minutes):
   - Coach has full context
   - Offers relevant insights
   - References past discussions naturally
4. Coach offers:
   - Action items (if applicable)
   - Follow-up scheduling
5. Exit → Daily summary auto-generated

### Weekly User Journey - Structured Session

1. **Monday:** Coach suggests: "You have 45 min free Thursday 2pm - want to book a session?"
2. **User books session** → Added to calendar
3. **Thursday 1:45pm:** Push notification reminder
4. **Thursday 2pm:** Enter session
   - Coach confirms: "Let's focus on [goal from last week]"
   - Guided conversation using GROW framework:
     - **Goal:** What specifically do you want from today?
     - **Reality:** What's the current situation?
     - **Options:** What could you do?
     - **Will:** What will you commit to?
5. **Session ends:**
   - Summary generated (key insights, decisions, action items)
   - Action items added to tracking system
   - Follow-up scheduled (if needed)
6. **Next week:** Coach checks in: "How did [action item] go?"

---

## Success Metrics

### Engagement Metrics
- **Daily Active Users (DAU)**
- **Average sessions per week per user**
  - Target: 3-5 quick check-ins + 1 structured session
- **Average session duration**
  - Quick: 5 minutes
  - Structured: 45 minutes
- **Voice vs text usage ratio**
  - Track to understand user preferences

### Retention Metrics
- **Day 1 → Day 7 retention:** Target >60%
- **Week 1 → Week 4 retention:** Target >40%
- **Monthly churn rate:** Target <10%
- **3-month retention:** Target >30%

### Quality Metrics
- **User satisfaction:** Post-session ratings (1-5 stars)
- **Net Promoter Score (NPS):** Target >50
- **Action item completion rate:** Track what users actually do
- **Goal achievement tracking:** Do users hit their stated goals?

### Conversion Metrics (Freemium → Paid)
- **Free to paid conversion rate:** Target 10-15%
- **Average days to conversion:** Track how long trial period needed
- **LTV:CAC ratio:** Target 3:1 minimum
- **Monthly Recurring Revenue (MRR) growth**

---

## Competitive Landscape

### Direct Competitors
- **Traditional coaching platforms:** BetterUp, CoachHub
  - Weakness: Still require scheduling, human coaches expensive
- **AI chat tools:** ChatGPT, Claude, Perplexity
  - Weakness: No memory, no coaching framework, generic

### Indirect Competitors  
- **Accountability apps:** Coach.me, Strides
  - Weakness: No strategic guidance, just tracking
- **Business tools:** Notion, Linear, Asana
  - Weakness: Task management, not strategic thinking partner

### Coach OS Differentiation
1. **AI-powered but coaching-focused** (not generic chat)
2. **Context-aware** (knows your full business history)
3. **On-demand AND structured** (flexibility + rigor)
4. **Premium positioning** (business class experience)
5. **Multi-functional** (coaching + research + brainstorming)

---

## Business Model

### Freemium Model

**Free Tier (Beta/Waitlist):**
- 5 quick check-ins per month
- 1 structured session per month
- Basic memory and context
- Purpose: User testing, validation, word-of-mouth

**Premium Tier: £100-200/month**
- Unlimited quick check-ins
- 4-8 structured sessions per month
- Full memory and context system
- Priority response times
- Advanced coaching frameworks
- Export conversations and reports
- Calendar integration

**Enterprise Tier (Future): Custom pricing**
- Team accounts (5-50 users)
- Admin dashboard
- Usage analytics
- Custom coaching frameworks
- Integration with company tools (Slack, etc.)
- Dedicated support

### Revenue Projections (12 months)

Conservative scenario:
- 100 paying users at £150/month avg = £15k MRR = £180k ARR
- Target: 500 users Year 1 = £75k MRR = £900k ARR

Optimistic scenario:
- 1,000 paying users Year 1 = £150k MRR = £1.8M ARR

---

## Go-to-Market Strategy

### Phase 1: Waitlist & Beta (Month 1-2)
- Launch landing page
- Content marketing (Paul's newsletter, LinkedIn)
- Target: 500 waitlist signups
- Select 50 beta users (diverse personas)
- Intensive user testing and feedback

### Phase 2: Invite-Only Launch (Month 3-4)
- Invite beta users to paid plans (50% discount)
- Referral program (invite 3 friends → 1 month free)
- Case studies and testimonials
- Target: 100 paying users

### Phase 3: Public Launch (Month 5-6)
- Full pricing announced
- PR push (TechCrunch, ProductHunt)
- Partnerships with accelerators/incubators
- Paid acquisition testing (LinkedIn ads)
- Target: 500 paying users

### Phase 4: Scale (Month 7-12)
- Expand to enterprise tier
- Build integration ecosystem
- International expansion (US, EU, Middle East)
- Target: 1,000+ paying users

---

## Risks & Mitigations

### Technical Risks

**Risk:** AI hallucinations giving bad business advice  
**Mitigation:**
- Careful prompt engineering with safety rails
- User feedback loop (rate every session)
- Human review of flagged conversations
- Disclaimer: "AI coach, not financial/legal advisor"

**Risk:** Memory system becomes slow/expensive at scale  
**Mitigation:**
- Tiered context strategy (not everything in every prompt)
- Efficient RAG implementation with caching
- Monitor token usage and optimize

**Risk:** Voice quality not good enough  
**Mitigation:**
- Test multiple providers (ElevenLabs, OpenAI)
- User testing on voice quality
- Always offer text as fallback

### Business Risks

**Risk:** Users don't convert free → paid  
**Mitigation:**
- Limit free tier enough to create pain
- Show clear value in trial period
- Optimize pricing based on feedback
- Strong onboarding to hook users

**Risk:** High churn after initial novelty  
**Mitigation:**
- Focus on habit formation (push notifications)
- Proactive coach check-ins to re-engage
- Track leading indicators of churn
- Win-back campaigns

**Risk:** Market not willing to pay premium price  
**Mitigation:**
- Strong positioning as business tool (not consumer chat)
- ROI calculation (vs. traditional coaching costs)
- Flexible pricing tiers
- Enterprise tier to derisk consumer dependence

---

## Future Roadmap (Post-MVP)

### Phase 2 Features (6-12 months)

**Advanced Coaching:**
- Multiple coaching frameworks (GROW, Scaling Up, EOS)
- Industry-specific coaching (FinTech, HealthTech, etc.)
- Mood and energy tracking over time
- Progress dashboards and analytics

**Integrations:**
- Calendar integration (auto-schedule sessions)
- Slack/Teams (quick check-ins from work tools)
- Task managers (Notion, Asana, Linear)
- Email (research attendees, draft messages)
- CRM systems (context on deals, customers)

**Collaboration Features:**
- Share specific conversations with team/mentors
- Co-coaching sessions (coach facilitates team discussion)
- Mentor marketplace (connect with human coaches)

**Enterprise Features:**
- Team accounts and admin dashboards
- Company-wide knowledge base
- Custom coaching programs
- Usage analytics and ROI tracking
- SSO and security compliance

### Phase 3 Features (12-24 months)

**Intelligence Layer:**
- Proactive insights: "I noticed you've been stressed about hiring..."
- Pattern recognition: "Last 3 times you did X, Y happened"
- Benchmark comparisons: "Other founders at your stage..."
- Predictive suggestions: "Based on your goals, consider..."

**Community & Network:**
- Private community for Coach OS users
- Peer matching (connect with similar founders)
- Group coaching sessions
- Events and workshops

**Platform Expansion:**
- Native iOS and Android apps
- Desktop app (for deep work sessions)
- Web portal (for reviewing history, analytics)
- API for developers (build on Coach OS)

---

## Open Questions

### For User Research:
1. What's the optimal free tier limitation? (usage-based? feature-based?)
2. How often do users actually want structured sessions vs. quick check-ins?
3. Is voice really a killer feature, or just nice-to-have?
4. What integrations are must-haves vs. nice-to-haves?
5. Would users pay more for human coach escalation option?

### For Technical Validation:
1. Can we keep context retrieval under 2 seconds at scale?
2. What's the token cost per user per month? (affects pricing)
3. How much does voice add to infrastructure costs?
4. Can we achieve <100ms latency for voice conversations?

### For Business Model:
1. Is £100-200/month the right price range?
2. Should we offer annual plans (with discount)?
3. What's the right mix of free vs. paid features?
4. Do we need a mid-tier between free and premium?

---

## Appendix

### Key Assumptions
- Target users have disposable income for tools (£100-200/month)
- Business professionals prefer mobile for coaching (vs. desktop)
- AI quality is "good enough" for valuable coaching
- Users will trust AI with sensitive business information
- Habit formation is possible with push notifications

### Key Dependencies
- OpenAI/Anthropic API stability and pricing
- Voice API quality (ElevenLabs/OpenAI)
- Supabase reliability at scale
- App store policies (if we go native)

### Definition of Success (12 months)
- **500+ paying subscribers**
- **£75k+ MRR**
- **<10% monthly churn**
- **NPS >50**
- **Clear path to 1000 users in Year 2**

---

**Document Owner:** Paul  
**Contributors:** Claude (AI Assistant)  
**Next Review:** After MVP launch
