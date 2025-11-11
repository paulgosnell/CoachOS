# Coach OS Landing Page - Deployment Checklist

**Target Go-Live:** ASAP  
**Owner:** Paul  
**Status:** Pre-deployment

---

## 🚀 Pre-Launch Checklist

### 1. Domain & Hosting Setup
- [ ] Purchase domain (suggestions: coachos.ai, coachos.io, usecoach.ai)
- [ ] Choose hosting provider (Vercel recommended)
- [ ] Configure DNS settings
- [ ] Enable SSL/HTTPS
- [ ] Test domain propagation
- [ ] Set up www redirect (www → non-www or vice versa)

**Estimated Time:** 2-4 hours  
**Dependencies:** Domain purchase, hosting account

---

### 2. Form Integration
- [ ] Decide on form backend (Supabase recommended)
- [ ] Create database table (see schema in landing page README)
- [ ] Update form submission endpoint in index.html
- [ ] Test form submission
- [ ] Verify data is being stored correctly
- [ ] Set up email notifications for new signups
- [ ] Create welcome email template

**Estimated Time:** 2-3 hours  
**Dependencies:** Supabase account or alternative form service

**Quick Option:** Use Formspree or Basin for instant form backend (no coding required)

---

### 3. Analytics Setup
- [ ] Create Plausible account (or Google Analytics)
- [ ] Add tracking code to index.html (before closing </head>)
- [ ] Set up conversion goals (waitlist signup)
- [ ] Test analytics are firing
- [ ] Set up weekly reports

**Estimated Time:** 30 minutes  
**Dependencies:** Analytics account

**Recommended:** Plausible (privacy-friendly, no cookie banner needed)

---

### 4. Email Setup
- [ ] Set up email forwarding (hello@coachos.ai → your email)
- [ ] Create email signature with landing page link
- [ ] Set up email automation for new signups (optional)
- [ ] Create email templates for:
  - Welcome email
  - Weekly check-in
  - Beta launch announcement

**Estimated Time:** 1 hour  
**Dependencies:** Domain email access

---

### 5. Content Review
- [ ] Proofread all copy
- [ ] Check for typos and grammatical errors
- [ ] Verify all claims are accurate
- [ ] Ensure pricing is correct (£50 founder pricing)
- [ ] Check feature descriptions match PRD
- [ ] Review use cases for relevance
- [ ] Verify CTA copy is compelling

**Estimated Time:** 30 minutes  
**Dependencies:** None

---

### 6. Technical Testing

#### Desktop Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Testing
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Test landscape and portrait modes

#### Functionality Testing
- [ ] All anchor links work
- [ ] Form submission works
- [ ] Form validation works (try submitting empty fields)
- [ ] Success message appears after submission
- [ ] Smooth scrolling works
- [ ] Phone mockup animation works
- [ ] Parallax effect works on desktop
- [ ] Hover effects work

#### Performance Testing
- [ ] Run PageSpeed Insights (aim for 90+ score)
- [ ] Test on slow 3G connection
- [ ] Check First Contentful Paint (< 1s)
- [ ] Check Largest Contentful Paint (< 2.5s)
- [ ] Verify no layout shift issues

**Estimated Time:** 2 hours  
**Dependencies:** Multiple devices/browsers

---

### 7. SEO Optimization
- [ ] Add Open Graph meta tags for social sharing
- [ ] Add Twitter Card meta tags
- [ ] Create favicon (multiple sizes)
- [ ] Add robots.txt
- [ ] Create sitemap.xml (if multi-page in future)
- [ ] Verify meta description is compelling
- [ ] Check heading hierarchy (H1, H2, H3)
- [ ] Add alt text to any images (if added)

**Estimated Time:** 1 hour  
**Dependencies:** None

**Priority:** Open Graph tags for nice LinkedIn/Twitter previews

---

### 8. Legal & Compliance
- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] Add GDPR compliance notice (if targeting EU)
- [ ] Add cookie consent banner (if using cookies)
- [ ] Link legal pages in footer
- [ ] Verify data storage compliance

**Estimated Time:** 2-3 hours  
**Dependencies:** Legal templates (can use online generators)

**Quick Option:** Use Termly.io or TermsFeed for free legal page generation

---

### 9. Pre-Launch Marketing Prep
- [ ] Write LinkedIn announcement post
- [ ] Write Twitter thread about the product
- [ ] Prepare launch email for personal network
- [ ] Create 3-5 social media graphics
- [ ] Record short demo video (optional)
- [ ] Prepare Product Hunt launch materials (for later)
- [ ] List of 20-30 people to personally reach out to

**Estimated Time:** 3-4 hours  
**Dependencies:** Design tools for graphics (Canva works)

---

## 🎯 Launch Day Checklist

### Morning Of
- [ ] Final test of form submission
- [ ] Check DNS is fully propagated
- [ ] Verify SSL certificate is working
- [ ] Test site on mobile one more time
- [ ] Clear cache and test fresh load
- [ ] Screenshot homepage for records

### Launch Actions
- [ ] Post to LinkedIn with landing page link
- [ ] Post Twitter thread
- [ ] Email personal network (BCC, personalized intro)
- [ ] Share in relevant Slack communities
- [ ] Post in entrepreneur Facebook groups
- [ ] Add to bio on all social platforms
- [ ] Update LinkedIn headline/summary with link

### End of Day
- [ ] Check analytics (how many visitors?)
- [ ] Check form submissions (how many signups?)
- [ ] Respond to any comments/messages
- [ ] Note any issues or bugs
- [ ] Celebrate! 🎉

---

## 📊 Week 1 Goals

- **Traffic:** 200-500 visitors
- **Signups:** 20-50 waitlist members
- **Conversion Rate:** 10-15%
- **Bounce Rate:** < 60%
- **Avg. Time on Page:** > 45 seconds

---

## 🔄 Post-Launch Optimization

### Week 1-2
- [ ] Respond to all signups personally (if < 50)
- [ ] Send first waitlist update email
- [ ] Ask 5-10 signups for quick 15-min interview
- [ ] A/B test headline variations
- [ ] Monitor scroll depth (are people seeing features?)
- [ ] Check which traffic sources convert best

### Week 3-4
- [ ] Send second waitlist update with product screenshots
- [ ] Ask waitlist for feature feedback (survey)
- [ ] Test different CTA copy
- [ ] Add social proof (if you have testimonials)
- [ ] Consider adding demo video
- [ ] Prepare beta testing logistics

---

## 🛠️ Quick Deploy Options

### Option 1: Vercel (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to landing page folder
cd coach-os-landing

# Deploy
vercel

# Follow prompts to connect domain
```

**Time to deploy:** 5 minutes  
**Cost:** Free  
**Pros:** Instant deployment, automatic SSL, great DX

---

### Option 2: Netlify
```bash
# Install Netlify CLI
npm install netlify-cli -g

# Deploy
netlify deploy

# Follow prompts
```

**Time to deploy:** 10 minutes  
**Cost:** Free  
**Pros:** Great for form handling, easy to use

---

### Option 3: CloudFlare Pages
1. Push code to GitHub
2. Connect CloudFlare Pages to repo
3. Deploy

**Time to deploy:** 15 minutes  
**Cost:** Free  
**Pros:** Fast global CDN, great analytics

---

## 🚨 Emergency Contacts

### If Something Breaks
- **Hosting Issues:** Check hosting provider status page
- **Form Issues:** Verify endpoint URL, check Supabase logs
- **DNS Issues:** Check domain registrar DNS settings
- **SSL Issues:** Force HTTPS redirect in hosting settings

### Quick Fixes
- **Form not submitting:** Check browser console for errors
- **Slow loading:** Check image sizes, remove unused code
- **Mobile issues:** Test in Chrome DevTools mobile view
- **Analytics not tracking:** Verify tracking code is present

---

## 📈 Success Metrics Dashboard

Track these weekly:

| Metric | Week 1 | Week 2 | Week 3 | Week 4 |
|--------|--------|--------|--------|--------|
| Unique Visitors | | | | |
| Waitlist Signups | | | | |
| Conversion Rate | | | | |
| Avg. Time on Page | | | | |
| Bounce Rate | | | | |
| Traffic Sources | | | | |

---

## ✅ Final Pre-Deploy Check

Before you hit deploy, verify:

1. **Domain is purchased and configured** ✓
2. **Form backend is set up and tested** ✓
3. **Analytics are installed** ✓
4. **All content is proofread** ✓
5. **Tested on mobile and desktop** ✓
6. **Legal pages are linked** ✓
7. **Launch posts are ready** ✓
8. **You have time to monitor launch** ✓

---

## 🎉 You're Ready!

Once all the above is checked off, you're good to deploy. 

**Remember:**
- Landing pages are never perfect on day 1
- You can iterate and improve based on real data
- The goal is to get it live and start learning
- 80% perfect is better than 100% never launched

**Let's go! 🚀**

---

**Questions?** Review the [Landing Page README](./coach-os-landing/README.md) or contact Paul.

**Next Steps After Launch:**
1. Gather 50+ waitlist signups
2. Interview 10-15 prospects
3. Refine product based on feedback
4. Start MVP development
5. Beta launch to waitlist

Good luck! 🍀
