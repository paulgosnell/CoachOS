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
  - 6 sample articles with full content

- [x] **4. Start publishing content pages** DONE
  - 14 articles total with full content
  - Categories: ADHD Business (4), ADHD Productivity (3), Coaching (3), Frameworks (2), Founder Life (2)
  - All articles have SEO metadata, descriptions, reading times
  - Blog listing page with category filters and search
  - Sitemap updated with all article URLs

### Technical & Legal

- [x] **5. Add analytics tracking** DONE
  - Created migration: `supabase/migrations/20250124000000_add_page_views.sql`
  - Created `/src/components/AnalyticsProvider.tsx`
  - Created `/src/app/api/track/route.ts`
  - Added to layout with Suspense wrapper
  - Filters internal traffic by email domain
  - Run migration in Supabase to enable

- [x] **6. Add legal pages** DONE
  - Created `/src/app/privacy/page.tsx` - Full GDPR-compliant privacy policy
  - Created `/src/app/terms/page.tsx` - Terms of Service
  - Created `/src/app/about/page.tsx` - About page with company info
  - Added footer links on landing page
  - Updated sitemap

### Business Decision

- [ ] **7. Decide on pricing strategy**
  - Current: £9.99/month
  - Plan target: £30-40/month
  - Document rationale for chosen price

---

## Completed

- [x] Search intent mapping (Jan 2025)
- [x] Keyword clusters built (Jan 2025)
- [x] Content templates created (Jan 2025) - Blog infrastructure ready
- [x] Analytics tracking added (Jan 2025) - Run migration to enable
- [x] Legal pages added (Jan 2025) - Privacy, Terms, About
- [x] Content pages published (Jan 2025) - 14 articles live

---

## Notes

- Product is complete (voice, chat, memory, tasks, payments)
- Content engine is the critical missing piece
- Target: 500+ content pages for SEO
