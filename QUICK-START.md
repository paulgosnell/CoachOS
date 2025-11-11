# Coach OS - Quick Start Guide

**Goal:** Get the landing page live TODAY and start collecting signups

---

## ⚡ Fastest Path to Live (30 minutes)

### Step 1: Deploy to Vercel (5 minutes)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Navigate to landing page:**
   ```bash
   cd /path/to/coach-os-landing
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - Say YES to all defaults
   - Copy the URL you get (e.g., coach-os-abc123.vercel.app)

**DONE!** Your landing page is live. Test it immediately.

---

### Step 2: Form Integration - Quick Option (10 minutes)

**Option A: Use Basin (No Code)**
1. Go to https://usebasin.com
2. Create free account
3. Create new form
4. Get your form endpoint URL
5. Update `index.html` line 658:
   ```javascript
   const response = await fetch('YOUR_BASIN_ENDPOINT_HERE', {
   ```
6. Redeploy: `vercel --prod`

**Option B: Use Formspree (No Code)**
1. Go to https://formspree.io
2. Create free account
3. Get your form endpoint
4. Update form endpoint in code
5. Redeploy

**DONE!** Forms now submit and you'll get email notifications.

---

### Step 3: Share It (15 minutes)

**LinkedIn Post (Copy & Paste):**
```
I'm building something I wish I had as a founder: on-demand business coaching that fits your schedule.

No more booking calls weeks in advance. No more repeating context. Just instant access to strategic guidance whenever you need it - whether that's a 2-minute check-in or a deep-dive session.

Coach OS is your business coach in your pocket. Voice or text. Always available. Fully context-aware.

Early access opening soon. If this sounds like something you'd use, check it out:
[YOUR_VERCEL_URL]

Would love your feedback 👇
```

**Twitter Thread (Copy & Paste):**
```
🧵 I'm solving a problem I have as a founder:

I need strategic advice at the moment of decision, not 2 weeks later when I finally get a coaching call scheduled.

So I'm building Coach OS - your business coach in your pocket.

1/6

Traditional business coaching:
• Schedule weeks in advance
• Repeat context every session
• £200-500 per hour
• Limited availability
• One-size-fits-all approach

There's friction everywhere.

2/6

What if you could:
• Get advice while driving to a meeting
• Have a strategy session at 11pm when you finally have time
• Never repeat yourself (full context always)
• Pay £100/month instead of £500/session

That's Coach OS.

3/6

It's not just a chatbot. It's:
✅ Built on proven coaching frameworks (GROW model)
✅ Remembers everything about your business
✅ Proactively follows up on commitments
✅ Voice AND text (use what fits the moment)
✅ Premium experience for busy leaders

4/6

Use cases:
• "I have 20 mins before this meeting - prep me"
• "Should I take this partnership? Walk me through a decision framework"
• "I'm stressed. Help me prioritize"
• "Research these attendees for my pitch tomorrow"

5/6

Targeting Q1 2026 launch.

Founder pricing: £50/month for first 100 users (vs £150 regular)

If this sounds useful, join the waitlist:
[YOUR_VERCEL_URL]

Would love feedback from other founders 👇

6/6
```

**Personal DMs (Send to 10-20 people):**
```
Hey [Name],

Quick one - I'm building something I think you might find useful.

It's basically on-demand business coaching that fits your schedule. No booking, no repeating context, just instant strategic guidance whenever you need it.

Would love your quick feedback: [YOUR_VERCEL_URL]

Takes 30 seconds to join the waitlist if it's interesting.

Cheers,
Paul
```

---

## 📊 What to Track Today

Open a Google Sheet and track:
- Hour by hour visitors (check Vercel analytics)
- Signups as they come in
- Where traffic is coming from
- Any feedback in comments

**Goal for Today:**
- 50-100 visitors
- 5-10 signups
- 5+ comments/engagement

---

## 🐛 Quick Troubleshooting

### "Form isn't submitting"
- Check browser console for errors (F12)
- Verify you updated the endpoint URL
- Make sure Basin/Formspree account is active

### "Analytics not showing data"
- Vercel analytics work automatically (check Vercel dashboard)
- Visit your own site (doesn't count as visitor)
- Wait 5-10 minutes for data to appear

### "Site looks broken on mobile"
- Clear your cache
- Try in incognito/private mode
- Test on actual device, not just desktop emulator

---

## ✅ End of Day Checklist

Before you finish today:
- [ ] Landing page is live on Vercel
- [ ] Forms submit successfully
- [ ] Posted to LinkedIn
- [ ] Posted to Twitter
- [ ] Sent DMs to 10-20 people
- [ ] Responded to any comments
- [ ] Noted signup count
- [ ] Sent welcome email to signups (if any)

---

## 🎯 Tomorrow's Tasks

1. **Respond to signups** - Personal email thanking them
2. **Check analytics** - What worked? What didn't?
3. **Iterate** - Fix any issues, improve copy based on feedback
4. **Continue sharing** - More LinkedIn comments, relevant communities
5. **Start conversations** - Reach out to 5 signups for quick chat

---

## 💰 Domain (Do Later This Week)

Once you have a few signups and want to look more professional:

1. **Buy domain:** coachos.ai or coachos.io
   - Namecheap: ~£30/year
   - Google Domains: ~£30/year

2. **Connect to Vercel:**
   - Vercel dashboard → Project → Settings → Domains
   - Add your domain
   - Follow DNS instructions
   - Wait 10-60 mins for propagation

3. **Update links:**
   - Edit your LinkedIn/Twitter posts with new domain
   - Update email signature

---

## 📈 Week 1 Goal

- **50+ signups** on waitlist
- **5-10 detailed conversations** with prospects
- **Clear validation** that people want this
- **Start MVP development** with confidence

---

## 🚀 You've Got This!

The landing page is beautiful, the copy is strong, and the positioning is clear.

Now just get it live and start talking to people.

**Remember:** 
- Done is better than perfect
- You can iterate based on real feedback
- Every signup is a potential beta tester
- This is just the beginning

---

**Need help?** Everything is documented in the other files.

**Ready?** Open your terminal and type: `vercel`

Let's go! 🎉
