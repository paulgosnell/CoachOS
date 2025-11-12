# SEO Implementation Guide for Coach OS

Complete SEO setup including Open Graph, Twitter Cards, structured data, and sitemaps.

## ✅ What's Implemented

### 1. Meta Tags

**Basic SEO** (`src/app/layout.tsx`)
- ✅ Title with template (`%s | Coach OS`)
- ✅ Meta description (160 characters)
- ✅ Keywords (12 relevant terms)
- ✅ Author and publisher metadata
- ✅ Robots directives (index, follow)
- ✅ Canonical URLs

### 2. Open Graph Tags

**For Social Sharing** (Facebook, LinkedIn, Slack, etc.)
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://coach-os-agent.vercel.app" />
<meta property="og:title" content="Coach OS - Your Business Coach In Your Pocket" />
<meta property="og:description" content="Premium on-demand business coaching..." />
<meta property="og:image" content="https://coach-os-agent.vercel.app/og-image.png" />
<meta property="og:site_name" content="Coach OS" />
<meta property="og:locale" content="en_US" />
```

### 3. Twitter Card Tags

**For Twitter Sharing**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@coachos" />
<meta name="twitter:creator" content="@coachos" />
<meta name="twitter:title" content="Coach OS - Your Business Coach..." />
<meta name="twitter:description" content="Premium on-demand business coaching..." />
<meta name="twitter:image" content="https://coach-os-agent.vercel.app/og-image.png" />
```

### 4. Structured Data (JSON-LD)

**Three schema types implemented:**

**Organization Schema:**
- Company information
- Logo
- Contact points
- Social media links (placeholder)

**WebSite Schema:**
- Site name and description
- Search action (future search feature)
- URL structure

**SoftwareApplication Schema:**
- Application category: Business
- Operating systems: Web, iOS, Android
- Price: Free
- Rating: 5.0/5.0
- Description

### 5. Sitemap

**Dynamic sitemap** (`src/app/sitemap.ts`)
```
/                 - Priority 1.0, Weekly updates
/auth/signup      - Priority 0.9, Monthly updates
/auth/login       - Priority 0.8, Monthly updates
```

**Excluded from sitemap** (behind authentication):
- /dashboard
- /chat/*
- /onboarding/*
- /api/*

### 6. Robots.txt

**Search engine directives** (`/public/robots.txt`)
```
Allow: /
Disallow: /api/
Disallow: /auth/callback
Disallow: /dashboard
Disallow: /chat/
Disallow: /onboarding/
Sitemap: https://coach-os-agent.vercel.app/sitemap.xml
```

### 7. Open Graph Image

**Social media preview image:**
- Dimensions: 1200 x 630 pixels (standard)
- Format: SVG source → PNG output
- Location: `/public/og-image.svg` (source)
- Expected: `/public/og-image.png` (needs conversion)

**Design elements:**
- Coach OS logo/branding
- Headline and tagline
- Feature pills (GPT-4o, Memory, Voice)
- Dark theme matching brand

---

## 📋 Setup Checklist

### Immediate (Done)
- ✅ Meta tags configured
- ✅ Open Graph tags added
- ✅ Twitter Card tags added
- ✅ Structured data (3 schemas)
- ✅ Sitemap generation
- ✅ Robots.txt updated
- ✅ OG image SVG created

### To Complete

#### 1. Create OG Image PNG
```bash
# Convert SVG to PNG (1200x630)
# See: public/og-image.png.txt for instructions
```

**Test with:**
- https://developers.facebook.com/tools/debug/
- https://cards-dev.twitter.com/validator
- https://www.linkedin.com/post-inspector/

#### 2. Add Environment Variable (Optional)
```bash
# In Vercel Dashboard or .env.local
NEXT_PUBLIC_APP_URL=https://coach-os-agent.vercel.app
```

This is used for canonical URLs and sitemaps. Falls back to Vercel URL if not set.

#### 3. Verify Search Console (Recommended)

**Google Search Console:**
1. Go to https://search.google.com/search-console
2. Add property: `https://coach-os-agent.vercel.app`
3. Verify via HTML file or meta tag
4. Submit sitemap: `https://coach-os-agent.vercel.app/sitemap.xml`

**Add verification code to layout.tsx:**
```typescript
verification: {
  google: 'your-verification-code-here',
},
```

**Bing Webmaster Tools:**
1. Go to https://www.bing.com/webmasters
2. Add site and verify
3. Submit sitemap

#### 4. Social Media Setup

**Twitter:**
- Create @coachos account (currently placeholder)
- Update `twitter.creator` and `twitter.site` in layout.tsx

**LinkedIn:**
- Create Coach OS company page
- Add to structured data `sameAs` array

**Facebook:**
- Create Facebook page (optional)
- Add to structured data `sameAs` array

#### 5. Performance Optimization

**Enable compression:**
- Vercel handles this automatically
- Gzip/Brotli compression active

**Add cache headers:**
- Static assets cached automatically
- PWA service worker handles offline caching

#### 6. Analytics (Optional)

**Google Analytics 4:**
```typescript
// Add to layout.tsx <head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Plausible Analytics** (privacy-friendly alternative):
```typescript
<script defer data-domain="coach-os-agent.vercel.app" src="https://plausible.io/js/script.js"></script>
```

---

## 🧪 Testing Your SEO

### 1. Meta Tags Inspector

**Browser DevTools:**
```bash
# Open any page, inspect <head>
# Look for og:, twitter:, and meta tags
```

**Online Tools:**
- https://metatags.io/
- https://www.opengraph.xyz/

### 2. Rich Results Test

**Google Rich Results:**
- https://search.google.com/test/rich-results
- Paste: `https://coach-os-agent.vercel.app`
- Should show Organization, WebSite, and SoftwareApplication schemas

### 3. Social Preview Test

**Facebook:**
- https://developers.facebook.com/tools/debug/
- Enter URL, click "Scrape Again"
- Should show 1200x630 OG image

**Twitter:**
- https://cards-dev.twitter.com/validator
- Enter URL
- Should show "Summary Card with Large Image"

**LinkedIn:**
- https://www.linkedin.com/post-inspector/
- Enter URL
- Should show OG image and description

### 4. Mobile-Friendly Test

**Google Mobile-Friendly Test:**
- https://search.google.com/test/mobile-friendly
- Should pass with "Page is mobile-friendly"

### 5. PageSpeed Insights

**Performance Check:**
- https://pagespeed.web.dev/
- Test both mobile and desktop
- Aim for 90+ score

### 6. Structured Data Test

**Schema Markup Validator:**
- https://validator.schema.org/
- Paste your homepage HTML
- Should show 0 errors, 0 warnings

---

## 📊 SEO Monitoring

### Key Metrics to Track

**Search Console:**
- Impressions (how many see you in results)
- Clicks (how many click through)
- Average position (ranking)
- CTR (click-through rate)

**Core Web Vitals:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

**Indexing:**
- Pages indexed
- Coverage issues
- Mobile usability

### Regular Tasks

**Weekly:**
- Check Search Console for errors
- Monitor traffic and rankings

**Monthly:**
- Update sitemap if routes change
- Review and update meta descriptions
- Check for broken links

**Quarterly:**
- Audit keywords and rankings
- Update content for SEO
- Review competitors

---

## 🎯 SEO Best Practices

### Content Optimization

**Landing Page (`/`):**
- ✅ H1 tag present ("Your Executive Coach")
- ✅ Descriptive content
- ✅ Internal links (signup, features)
- ✅ Clear call-to-action
- ✅ Mobile-responsive

**Keywords Used:**
- Primary: "business coaching", "executive coaching"
- Secondary: "AI coaching", "founder coaching"
- Long-tail: "on-demand business coaching for executives"

### Technical SEO

**Performance:**
- ✅ Next.js App Router (fast)
- ✅ Static generation where possible
- ✅ PWA for offline access
- ✅ Image optimization
- ✅ Code splitting

**Accessibility:**
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Color contrast (WCAG AA)

**Security:**
- ✅ HTTPS only
- ✅ Secure headers (Vercel default)
- ✅ CSP headers
- ✅ CORS configured

### Link Building

**Internal Links:**
- Homepage → Signup
- Homepage → Features (anchor links)
- Homepage → Login

**External Links** (when ready):
- Blog posts (future)
- Social media profiles
- Press mentions
- Partner sites

---

## 🚀 Advanced SEO Features

### Future Enhancements

**1. Blog/Content Hub:**
```
/blog
/blog/[slug]
```
Add to sitemap with `changeFrequency: 'weekly'`

**2. Help Center/Documentation:**
```
/help
/help/[category]/[article]
```
Good for long-tail keyword targeting

**3. Case Studies:**
```
/case-studies/[company]
```
Schema: `Case Study` type

**4. Testimonials/Reviews:**
```
/testimonials
```
Schema: `Review` type with ratings

**5. Video Content:**
```
/videos
```
Schema: `VideoObject` type

### International SEO (Future)

**For multiple languages:**
```typescript
alternates: {
  canonical: siteUrl,
  languages: {
    'en-US': `${siteUrl}`,
    'en-GB': `${siteUrl}/en-gb`,
    'es-ES': `${siteUrl}/es`,
  },
},
```

### Local SEO (If applicable)

**If physical location:**
```json
{
  "@type": "LocalBusiness",
  "name": "Coach OS",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94102",
    "addressCountry": "US"
  }
}
```

---

## 📚 Resources

### Documentation
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search/docs)
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

### Tools
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Ahrefs](https://ahrefs.com/) (paid, comprehensive)
- [SEMrush](https://www.semrush.com/) (paid, competitor analysis)
- [Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/) (free tier, crawling)

### Validation
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## 🎓 SEO Glossary

**Open Graph:** Protocol for social media previews (Facebook, LinkedIn, Slack)
**Twitter Cards:** Twitter's preview format for shared links
**Schema.org:** Structured data vocabulary for search engines
**Canonical URL:** Preferred URL for duplicate content
**Sitemap:** XML file listing all site pages for crawlers
**Robots.txt:** Instructions for search engine crawlers
**Rich Snippets:** Enhanced search results with images, ratings, etc.
**SERP:** Search Engine Results Page
**CTR:** Click-Through Rate (clicks/impressions)
**DA/PA:** Domain/Page Authority (Moz metric)
**Backlinks:** Links from other sites to yours

---

## ✅ Verification Checklist

Before launching:
- [ ] og-image.png created (1200x630)
- [ ] All meta tags present in `<head>`
- [ ] Structured data validates (schema.org)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Social previews working (Facebook, Twitter)
- [ ] Google Search Console verified
- [ ] Bing Webmaster Tools verified
- [ ] Mobile-friendly test passes
- [ ] PageSpeed score > 90
- [ ] No console errors on homepage
- [ ] Analytics tracking (if using)

---

**Status:** ✅ **SEO Foundation Complete**
**Last Updated:** 2025-01-11
**Priority:** Convert OG image SVG to PNG for social media
