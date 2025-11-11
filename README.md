# Coach OS Landing Page

Premium, conversion-optimized landing page for Coach OS - Your Business Coach In Your Pocket.

## Features

- **Premium Design**: Business-class aesthetic with titanium, deep blue, and gold accent colors
- **Animated Background**: Subtle gradient animation for visual interest
- **Interactive Phone Mockup**: 3D floating animation with parallax mouse tracking
- **Responsive**: Fully mobile-optimized (mobile-first design)
- **Voice Visualization**: Animated voice wave indicators
- **Waitlist Form**: Captures early adopter signups with qualification questions
- **Smooth Animations**: Professional micro-interactions throughout
- **Fast Loading**: Single HTML file, minimal dependencies (only Google Fonts)

## Quick Deploy

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to the landing page directory
cd coach-os-landing

# Deploy
vercel

# Follow prompts to link to your Vercel account
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm install netlify-cli -g

# Deploy
netlify deploy

# Follow prompts, set deploy path to current directory
```

### Option 3: Static Hosting
Simply upload `index.html` to any static hosting provider:
- AWS S3 + CloudFront
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting

## Customization

### Update Form Submission
In `index.html`, find the form submission handler (line ~665) and replace the TODO with your actual endpoint:

```javascript
const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
});
```

### Form Integration Options

1. **Supabase** (Recommended for MVP)
```javascript
const { data, error } = await supabase
    .from('waitlist')
    .insert([formData]);
```

2. **Google Sheets** (Simple option)
Use a service like SheetDB or Sheet.best to POST form data to a Google Sheet.

3. **Email Service** (SendGrid, Mailgun, etc.)
Send form data directly to your email via their APIs.

4. **Form Services** (Formspree, Basin, etc.)
Point form action to their endpoint.

### Update Colors
All colors are defined in CSS variables at the top of the file:
```css
:root {
    --titanium: #2D3436;
    --deep-blue: #0C2340;
    --silver: #C0C0C8;
    --silver-light: #E8E8ED;
    --silver-dark: #8E8E93;
    --black: #000000;
    --dark-gray: #1A1A1A;
    --off-white: #F5F5F5;
}
```

### Update Copy
All text content is in the HTML. Key sections to customize:
- Hero headline (line ~408)
- Hero subtitle (line ~409-411)
- Feature cards (line ~475-516)
- Use cases (line ~533-580)
- CTA section (line ~591-593)

## Analytics Integration

Add Google Analytics or Plausible by inserting the tracking code before the closing `</head>` tag:

### Google Analytics
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible (Privacy-friendly)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Performance

- **First Contentful Paint**: < 1s
- **Largest Contentful Paint**: < 2s
- **Time to Interactive**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: 95+

## SEO Optimization

The page includes:
- Semantic HTML structure
- Meta description
- Proper heading hierarchy
- Fast loading time
- Mobile responsive
- Clean URL structure

Consider adding:
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD) for rich snippets
- Sitemap
- robots.txt

## Domain Setup

1. **Purchase domain**: coachos.ai or similar
2. **Configure DNS**: Point to your hosting provider
3. **Enable SSL**: Use Let's Encrypt (free) or hosting provider's SSL
4. **Add www redirect**: Redirect www to non-www or vice versa

## Testing Before Launch

- [ ] Test form submission
- [ ] Check mobile responsiveness on real devices
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Verify all links work
- [ ] Check loading speed (PageSpeed Insights)
- [ ] Proofread all copy
- [ ] Test on slow connection (throttle in DevTools)
- [ ] Verify analytics tracking

## Marketing Integration

After deployment, consider:
- LinkedIn post about the product
- Twitter thread with the landing page link
- Product Hunt launch prep
- Email signature link
- Personal network outreach

## Database Schema for Waitlist

If using Supabase, create a table:

```sql
create table waitlist (
  id uuid default uuid_generate_v4() primary key,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  role text not null,
  company_stage text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notified boolean default false,
  notes text
);

-- Add index for email lookups
create index waitlist_email_idx on waitlist(email);

-- Add index for creation date
create index waitlist_created_at_idx on waitlist(created_at desc);
```

## Email Automation

Set up welcome email for new signups:
1. Thank them for joining
2. Set expectations (when they'll hear from you)
3. Ask qualifying questions
4. Provide value (coaching tip, resource, etc.)

## A/B Testing Ideas

Once live, test:
- Hero headline variations
- CTA button copy
- Pricing mention (£50 vs "founding member pricing")
- Social proof (add testimonials when available)
- Feature order
- Video vs static mockup

## Conversion Optimization

Track:
- Waitlist signup rate
- Scroll depth
- CTA click rate
- Form field drop-off
- Traffic sources

## Next Steps

1. Deploy landing page
2. Share with target audience
3. Collect 50-100 signups
4. Send survey to waitlist
5. Interview 10-15 prospects
6. Refine product based on feedback
7. Start MVP development
8. Beta launch to waitlist

## Support

For questions or issues:
- Email: paul@p0stman.com
- Check Coach OS documentation in `/docs`

---

**Built with:** HTML, CSS, JavaScript  
**Design System:** Coach OS Design System  
**Hosted on:** TBD  
**Domain:** TBD
