# CoachOS Tasks

Session log. Newest at top. Live claims live in [DESK.md](./DESK.md). Backlog is GitHub Issues.

## 2026-10-14: own AI keys (keys live, UI only partly verified)

- [x] `GOOGLE_AI_API_KEY` was the "CoachOS" key in the CoachOS GCP project (denied, no billing) with a literal trailing `\n`. Now own key `gemini-coachos` (AccountsOS GCP project), sensitive.
- [x] `OPENAI_API_KEY` was an invalid key. New OpenAI project "CoachOS" in the TVL org, service-account key `coachos`, never expires, sensitive.
- [x] Both keys tested 200 before adding; redeployed.
- [x] Homepage + /adhd demo voice was 500 (retired `/v1/realtime/sessions`). Moved to the GA Realtime API (2c999c0): routes mint via `/v1/realtime/client_secrets` (`gpt-realtime`), `DemoVoice` posts SDP to `/v1/realtime/calls`, GA `session.update` shape and event names. Live on both pages: session 200, call 201, coach speaks the greeting. `/api/openai-realtime-session` migrated the same way but nothing calls it.
- [ ] /chat and /voice-coach not checked in the UI: they need a login and no test account exists.
- [x] SECURITY: `/api/gemini-live-session` returned a wsUrl with the raw Gemini key to any logged-in user (and logged the key prefix). Now mints a single-use ephemeral token (`src/lib/ai/gemini-live-token.ts`, Constrained endpoint). Live: route returns 401 signed out; the voice-coach setup (09-2025 model, Puck, thinking off) connects on a token and returns audio. Signed-in UI click not tested: no test account.

## 2026-08-29 — ops

CoachOS Grok Bot.app stood up. Claimed ops on DESK.md (live board, not protocol-only). Weekday morning check saved (`coachos-weekday-morning`, 8:44 London weekdays). Awaiting Paul confirm in Routines. No GTM/social. No CoachOS-specific connectors.

---

## Operator-Desk Handshake

**Lanes:**
- `coding` → Grok CLI
- `ops` → CoachOS Grok Bot.app

See [DESK.md](./DESK.md) for the live claims board.

---

## Current Sprint

### Phase 2: Content Strategy Foundation

- [x] **1. Complete search intent mapping** DONE
  - See `keyword-research.md` for full analysis

- [x] **2. Build keyword clusters** DONE
  - 7 clusters identified (ADHD business, productivity, AI coaching, exec coaching, frameworks, decisions, coaching vs therapy)
  - 50+ seed keywords mapped
  - Question formats captured
  - See `keyword-research.md`

- [x] **3. Create content templates** DONE
  - Created `/src/lib/content/types.ts` - Article types and categories
  - Created `/src/components/blog/ArticleLayout.tsx` - Article page template
  - Created `/src/components/blog/ArticleCard.tsx` - Card for listings
  - Created `/src/app/blog/page.tsx` - Blog listing page with filters
  - Created `/src/app/blog/[slug]/page.tsx` - Dynamic article pages

- [x] **4. Publish 500+ content pages** DONE
  - 501 articles total (14 inline + 487 markdown)
  - Categories: ADHD Business, ADHD Productivity, Coaching, Frameworks, Founder Life, Decisions
  - Markdown-based content system in `/content/articles/`
  - Auto-generated sitemap with all URLs
  - Topics covered:
    - ADHD + specific challenges (40 articles)
    - ADHD + industries (20 articles)
    - Framework guides (20 articles)
    - Profession-specific coaching (20 articles)
    - UK city coaching costs (15 articles)
    - ADHD questions (50 articles)
    - Coaching comparisons (20 articles)
    - Decision frameworks (30 articles)
    - Founder mental health (20 articles)
    - Listicles (40 articles)
    - How-to guides (50 articles)
    - Leadership case studies (20 articles)
    - Pricing guides (15 articles)
    - Additional ADHD topics (30 articles)
    - Coaching methodologies (20 articles)
    - Productivity frameworks (25 articles)
    - Business topics (30 articles)
    - More comparisons (20 articles)

### Technical & Legal

- [x] **5. Add analytics tracking** DONE
  - Migration applied to Supabase
  - `/src/components/AnalyticsProvider.tsx`
  - `/src/app/api/track/route.ts`
  - Filters internal traffic by email domain

- [x] **6. Add legal pages** DONE
  - `/src/app/privacy/page.tsx` - GDPR-compliant privacy policy
  - `/src/app/terms/page.tsx` - Terms of Service
  - `/src/app/about/page.tsx` - About page
  - Footer links on landing page

- [x] **8. Add FAQ schema markup** DONE
  - `/src/lib/content/types.ts` - Added FAQ interface
  - `/src/components/FAQSchema.tsx` - JSON-LD FAQPage schema component
  - `/src/app/blog/[slug]/page.tsx` - Schema rendered on article pages
  - Articles can define FAQs in frontmatter (markdown) or inline (articles.ts)
  - Example FAQs added to key articles

### Landing Page Improvements

- [x] **9. Landing page overhaul** DONE
  - Added ADHD founder callout (amber pill linking to /adhd)
  - Added credibility line ("Built by founders with ADHD")
  - New pricing comparison section (£40/month vs £300-500/session)
  - Enhanced frameworks card (GROW, SWOT mentioned explicitly)
  - Task extraction callout ("Say It. It's Tracked.")
  - New social proof section with Pathfinder results
  - Updated final CTA with pricing anchor
  - Created public `/pricing` page with full pricing info
  - Updated Navbar to link to /pricing

### Business Decision

- [x] **7. Pricing set to £40/month** DONE
  - Updated `/src/app/subscribe/SubscribeClient.tsx`
  - Updated `/src/app/api/payments/create-order/route.ts`
  - Updated `/src/lib/email.ts`

### Production Readiness

- [x] **10. Payment webhook handler** DONE
  - `/src/app/api/payments/webhook/route.ts` - Handles Revolut ORDER_COMPLETED events
  - `/src/lib/supabase/admin.ts` - Service role client for webhook operations
  - Verifies webhook signature, activates subscription, sends confirmation email

- [x] **11. Custom error pages** DONE
  - `/src/app/not-found.tsx` - Custom 404 page with on-brand styling
  - `/src/app/error.tsx` - Custom error boundary with retry functionality

- [x] **12. Bing Webmaster Tools** DONE
  - Site verified and added
  - Sitemap submitted

---

## Completed

- [x] Search intent mapping (Jan 2025)
- [x] Keyword clusters built (Jan 2025)
- [x] Content templates created (Jan 2025)
- [x] Analytics tracking added (Jan 2025)
- [x] Legal pages added (Jan 2025)
- [x] **500+ content pages published (Jan 2025)**
- [x] Pricing set to £40/month (Jan 2025)
- [x] FAQ schema markup added (Jan 2025)
- [x] Landing page improvements (Jan 2025)
- [x] Public pricing page created (Jan 2025)
- [x] Google Search Console setup (Jan 2025)
- [x] Payment webhook handler (Jan 2025)
- [x] Custom error pages (Jan 2025)
- [x] Bing Webmaster Tools (Jan 2025)

---

## Notes

- Product is complete (voice, chat, memory, tasks, payments)
- Content engine is now LIVE with 501 articles
- Sitemap dynamically includes all article URLs
- Markdown-based system enables easy content updates
- **Production ready** - all critical infrastructure in place
- GSC + Bing Webmaster active for SEO tracking
- Payment webhooks handle subscription activation automatically


## New Tasks
- [ ] Monitor Google Search Console indexing progress
- [ ] Review initial traffic metrics
- [ ] Schedule user feedback collection