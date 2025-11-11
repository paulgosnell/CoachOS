# Coach OS - Project Documentation Index

**Project Status:** Pre-MVP / Planning Phase  
**Last Updated:** November 11, 2025  
**Project Lead:** Paul

---

## 📋 Quick Links

### Core Documentation
1. [Product Requirements Document (PRD)](./coach-os-prd.md) - Complete product specification
2. [Technical Architecture](./coach-os-technical-architecture.md) - System design and stack
3. [Design System](./coach-os-design-system.md) - Visual identity and UI guidelines
4. [Tone of Voice](./coach-os-tone-of-voice.md) - Brand voice and messaging

### Landing Page
- [Landing Page](./coach-os-landing/index.html) - Premium waitlist landing page
- [Landing Page README](./coach-os-landing/README.md) - Deployment and customization guide

---

## 🎯 Project Vision

**Coach OS** is an on-demand business coaching platform that provides executives, founders, and entrepreneurs with 24/7 access to strategic guidance. Unlike traditional coaching that requires scheduling weeks in advance, Coach OS fits into your life - whether that's a 2-minute check-in while driving or a 60-minute deep-dive session.

**Core Differentiators:**
- Always available (no scheduling friction)
- Complete context awareness (never repeat yourself)
- Voice and text parity (use what works for the moment)
- Framework-driven coaching (GROW model and others)
- Premium experience (business-class feel)

---

## 📖 Document Summaries

### [Product Requirements Document (PRD)](./coach-os-prd.md)
**What it contains:**
- Executive summary and product vision
- Target user personas
- Core features (dual interaction modes, memory system, voice/text)
- User flows and journeys
- Coaching frameworks (GROW model)
- Success metrics and KPIs
- Go-to-market strategy
- Roadmap (MVP to Scale)
- Competitive analysis
- Pricing strategy

**Use this for:**
- Understanding what we're building and why
- Defining scope for development sprints
- Aligning team on product vision
- Reference during feature discussions

---

### [Technical Architecture](./coach-os-technical-architecture.md)
**What it contains:**
- Complete tech stack (Next.js, Supabase, AI SDK)
- Database schema with all tables
- Memory system architecture (3-tier context strategy)
- RAG implementation details
- API integrations (OpenAI/Claude, ElevenLabs)
- Development phases breakdown
- File structure and organization
- Deployment strategy

**Use this for:**
- Setting up development environment
- Understanding data flow
- Database design and migrations
- AI integration implementation
- Making technical decisions

---

### [Design System](./coach-os-design-system.md)
**What it contains:**
- Brand positioning (Business Class, not First Class)
- Color palette (Titanium, Deep Blue, Gold)
- Typography system (Inter font family)
- Component library
- Spacing and layout guidelines
- Mobile-first responsive approach
- Animation principles
- Accessibility standards

**Use this for:**
- Building consistent UI components
- Making design decisions
- Creating new features
- Marketing materials
- Brand consistency

---

### [Tone of Voice](./coach-os-tone-of-voice.md)
**What it contains:**
- Brand personality traits
- Writing guidelines (confident, direct, insightful)
- Voice principles (professional but approachable)
- Example copy for different scenarios
- What to avoid (corporate jargon, buzzwords)
- Coach persona guidelines
- Communication style across channels

**Use this for:**
- Writing copy for the app
- Creating marketing materials
- Training AI coach personality
- Customer communication
- Content creation

---

### [Landing Page](./coach-os-landing/)
**What it contains:**
- Premium, conversion-optimized HTML landing page
- Waitlist signup form
- Mobile phone mockup with chat interface
- Feature showcase
- Use case examples
- Animated background and interactions
- Deployment instructions

**Use this for:**
- Early adopter acquisition
- Market validation
- Building waitlist
- Social sharing
- Beta tester recruitment

---

## 🚀 Getting Started

### For Developers
1. Read the [Technical Architecture](./coach-os-technical-architecture.md)
2. Review the [PRD](./coach-os-prd.md) for feature context
3. Check the [Design System](./coach-os-design-system.md) before building UI
4. Start with Phase 1 in the Technical Architecture

### For Designers
1. Study the [Design System](./coach-os-design-system.md)
2. Review the [Tone of Voice](./coach-os-tone-of-voice.md)
3. Look at the [Landing Page](./coach-os-landing/index.html) for reference
4. Reference PRD for user flows

### For Marketing
1. Read the [PRD](./coach-os-prd.md) for positioning and messaging
2. Study the [Tone of Voice](./coach-os-tone-of-voice.md)
3. Deploy the [Landing Page](./coach-os-landing/) to start building audience
4. Review competitive analysis in PRD

### For Product Management
1. Deep dive into the [PRD](./coach-os-prd.md)
2. Understand technical constraints in [Technical Architecture](./coach-os-technical-architecture.md)
3. Use success metrics to define OKRs
4. Reference roadmap for sprint planning

---

## 📊 Current Status

### ✅ Completed
- [x] Product vision and positioning
- [x] Core feature definition
- [x] Technical architecture design
- [x] Design system creation
- [x] Brand voice definition
- [x] Landing page development
- [x] Database schema design
- [x] Memory system architecture

### 🚧 In Progress
- [ ] Landing page deployment
- [ ] Waitlist collection
- [ ] Beta tester recruitment
- [ ] User interviews

### 📅 Next Steps
1. **This Week:**
   - Deploy landing page
   - Share with network for initial signups
   - Collect 20-50 waitlist signups

2. **Next 2 Weeks:**
   - Survey waitlist for feedback
   - Interview 5-10 prospects
   - Refine feature set based on feedback
   - Begin MVP development (Phase 1)

3. **Next 4 Weeks:**
   - Complete Phase 1 & 2 (Foundation + AI Integration)
   - Begin Phase 3 (Memory System)
   - Recruit beta testers from waitlist

---

## 💡 Key Decisions Made

### Technical Decisions
- **AI Provider:** OpenAI GPT-4o OR Claude Sonnet 4 (to be decided after testing)
- **Voice Provider:** ElevenLabs OR OpenAI Realtime API (to be decided)
- **Stack:** Next.js 14 + Supabase + Vercel AI SDK
- **Memory:** 3-tier context system with RAG
- **Deployment:** Vercel for app, Supabase for backend

### Product Decisions
- **MVP Focus:** Quick check-ins + structured sessions
- **Primary Framework:** GROW model for coaching
- **Interaction Modes:** Voice AND text (not just one)
- **Target:** Business executives and founders (not general consumers)
- **Pricing Model:** Premium (~£100-150/month)
- **Launch Strategy:** Waitlist → Beta → Soft Launch → Product Hunt

### Design Decisions
- **Aesthetic:** Business Class (premium but not ostentatious)
- **Platform:** Mobile-first web app (PWA)
- **Color Story:** Dark mode with titanium, blue, gold
- **Personality:** Confident, insightful, professional

---

## 🔄 Version Control

All documents should be version controlled. When making updates:

1. Update the relevant document
2. Update "Last Updated" date
3. Add note to "Change History" at bottom of document
4. Update this index if structure changes
5. Communicate changes to team

---

## 🎨 Brand Assets

### Color Codes
- **Titanium:** #2D3436
- **Deep Blue:** #0C2340
- **Gold:** #B8975A
- **Black:** #000000
- **Dark Gray:** #1A1A1A
- **Off-white:** #F5F5F5

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Weights Used:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)

### Key Phrases
- "Your business coach in your pocket"
- "On-demand strategic guidance that fits your schedule"
- "Business Class" (positioning)
- "Always available, fully context-aware"

---

## 📞 Contacts & Resources

### Project Team
- **Lead:** Paul (paul@p0stman.com)
- **Development:** P0STMAN team
- **Design:** TBD
- **Marketing:** TBD

### External Resources
- **Hosting:** Vercel (app), Supabase (backend)
- **Domain:** TBD (suggest: coachos.ai)
- **Email:** TBD (suggest: Google Workspace)
- **Analytics:** TBD (suggest: Plausible)

### Reference Links
- **AI SDK Docs:** https://sdk.vercel.ai
- **Supabase Docs:** https://supabase.com/docs
- **GROW Model:** https://www.mindtools.com/grow-model
- **Next.js 14:** https://nextjs.org/docs

---

## 📝 Notes for Future Reference

### Open Questions
1. Final brand name (keep Coach OS or rebrand?)
2. AI model selection (GPT-4o vs Claude Sonnet 4)
3. Voice provider (ElevenLabs vs OpenAI)
4. Exact freemium limits
5. Number of coach personas in MVP
6. Target launch date

### Important Considerations
- **Privacy:** Enterprise-grade security is non-negotiable
- **Context Quality:** Memory system must be accurate and relevant
- **Mobile Experience:** Must feel native, not like a website
- **Pricing:** Position as premium, not cheap ChatGPT alternative
- **Coach Personality:** Balance between professional and warm

### Success Criteria for MVP
- 80%+ week-1 retention
- Average 3+ sessions per week per user
- 4.5+ star rating
- 50% freemium to paid conversion
- User testimonials highlighting "always available" and "context awareness"

---

## 🎯 Mission

To give every business leader access to world-class coaching whenever they need it, without the friction of traditional coaching models.

**We believe:**
- Great coaching shouldn't require perfect scheduling
- Context is everything in strategic guidance
- Leaders need support at the moment of decision
- Premium experience drives premium results
- AI can complement (not replace) human wisdom

---

**End of Index**

*For questions or clarifications, contact Paul at paul@p0stman.com*
