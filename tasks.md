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

### Business Decision

- [x] **7. Pricing set to £40/month** DONE
  - Updated `/src/app/subscribe/SubscribeClient.tsx`
  - Updated `/src/app/api/payments/create-order/route.ts`
  - Updated `/src/lib/email.ts`

---

## Completed

- [x] Search intent mapping (Jan 2025)
- [x] Keyword clusters built (Jan 2025)
- [x] Content templates created (Jan 2025)
- [x] Analytics tracking added (Jan 2025)
- [x] Legal pages added (Jan 2025)
- [x] **500+ content pages published (Jan 2025)**
- [x] Pricing set to £40/month (Jan 2025)

---

## Notes

- Product is complete (voice, chat, memory, tasks, payments)
- Content engine is now LIVE with 501 articles
- Sitemap dynamically includes all article URLs
- Markdown-based system enables easy content updates
