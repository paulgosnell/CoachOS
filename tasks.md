# CoachOS Tasks

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
