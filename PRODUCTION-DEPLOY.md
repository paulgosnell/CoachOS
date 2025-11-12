# Coach OS - Production Deployment Guide

**Status:** ✅ Ready for Production
**Date:** 2025-01-11
**Version:** 1.0

---

## 🎯 Quick Start (15 Minutes)

Follow these steps to deploy Coach OS to production:

1. **Set up Supabase** (5 min)
2. **Deploy to Vercel** (5 min)
3. **Configure environment variables** (2 min)
4. **Run database schema** (2 min)
5. **Test and verify** (1 min)

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [ ] GitHub account (repo already pushed)
- [ ] Supabase account (free tier works)
- [ ] Vercel account (free tier works)
- [ ] OpenAI API key (for GPT-4o and embeddings)
- [ ] Domain name (optional, Vercel provides free subdomain)

---

## 1️⃣ Supabase Setup

### Step 1.1: Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `coach-os` (or your preferred name)
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing:** Free tier is fine for MVP
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 1.2: Run Database Schema

1. In your Supabase project, click **"SQL Editor"** in sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase/schema-fixed.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or Cmd/Ctrl + Enter)
6. Wait for success message (should see "Success. No rows returned")

### Step 1.3: Fix Missing Profiles (If Applicable)

If you already created test accounts, run the profile fix:

1. In SQL Editor, create another new query
2. Copy contents of `supabase/fix-missing-profiles.sql`
3. Paste and run
4. Verify output shows `missing: 0`

### Step 1.4: Enable pgvector Extension

1. In Supabase, go to **"Database" → "Extensions"**
2. Search for **"vector"**
3. Click **"Enable"** if not already enabled
4. Confirm it shows as "Enabled"

### Step 1.5: Get API Keys

1. Go to **"Settings" → "API"**
2. Copy these values (you'll need them for Vercel):
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public** key (long JWT token)
   - **service_role** key (keep this secret!)

---

## 2️⃣ Vercel Deployment

### Step 2.1: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..." → "Project"**
3. Import your Coach OS repository from GitHub
4. Click **"Import"**

### Step 2.2: Configure Build Settings

Vercel should auto-detect Next.js. Verify:

- **Framework Preset:** Next.js
- **Root Directory:** `.` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

### Step 2.3: Add Environment Variables

Click **"Environment Variables"** and add these:

#### Required:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
OPENAI_API_KEY=sk-your-openai-api-key
```

#### Optional (for production):
```
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

**Where to get values:**
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From Supabase Settings → API
- `OPENAI_API_KEY`: From [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- `NEXT_PUBLIC_APP_URL`: Your custom domain (or leave as Vercel's auto-generated URL)

### Step 2.4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You should see "🎉 Congratulations!" when done
4. Click **"Visit"** to see your live site

---

## 3️⃣ Post-Deployment Configuration

### Step 3.1: Update Supabase Redirect URLs

1. Go back to Supabase
2. Navigate to **"Authentication" → "URL Configuration"**
3. Add your Vercel URL to **"Redirect URLs"**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/*
   ```
4. Add to **"Site URL"**: `https://your-app.vercel.app`
5. Click **"Save"**

### Step 3.2: Configure Custom Domain (Optional)

1. In Vercel, go to **"Settings" → "Domains"**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)
5. Update `NEXT_PUBLIC_APP_URL` in Vercel to your custom domain
6. Redeploy (Vercel → Deployments → ... → Redeploy)

### Step 3.3: Set Up Email Templates (Optional but Recommended)

1. Go to Supabase **"Authentication" → "Email Templates"**
2. For each template (Confirm signup, Magic link, etc.):
   - Click **"Edit"**
   - Copy content from `email-templates/confirmation.html` (or others)
   - Replace variables with Supabase template syntax
   - Save

---

## 4️⃣ Verification Checklist

Test these flows on your live site:

### Authentication Flow
- [ ] Sign up with new email
- [ ] Receive confirmation email
- [ ] Click confirmation link (should redirect to onboarding)
- [ ] Complete onboarding (4 steps)
- [ ] Reach dashboard
- [ ] Log out
- [ ] Log back in

### Chat Flow
- [ ] Click "Quick Check-in" from dashboard
- [ ] Send a message
- [ ] Receive AI response (streaming)
- [ ] Refresh page - messages persist
- [ ] Send another message
- [ ] Check conversation appears in sidebar (desktop)

### Goals & Sessions
- [ ] Click "Your Goals" from dashboard
- [ ] See goals from onboarding
- [ ] Click "Book Session"
- [ ] See "Coming Soon" page

### Database Verification (Supabase)
- [ ] Go to **"Table Editor" → "profiles"**
- [ ] See your profile with `onboarding_completed = true`
- [ ] Check **"messages"** table - see your chat messages
- [ ] Check **"conversations"** table - see conversation created
- [ ] Check **"conversation_embeddings"** - embeddings being generated (may take a few seconds)

---

## 5️⃣ Monitoring & Maintenance

### Vercel Analytics

1. Enable Vercel Analytics (free):
   - Go to **"Analytics"** tab in Vercel
   - Click **"Enable"**

### Error Tracking

Errors are logged to:
- **Vercel Functions** - Check "Functions" tab for API errors
- **Browser Console** - Client-side errors (check in dev tools)

### Database Monitoring

1. Supabase Dashboard → **"Database" → "Usage"**
2. Monitor:
   - Database size (free tier: 500MB)
   - Monthly active users (free tier: 50,000)
   - Bandwidth (free tier: 5GB)

### Regular Maintenance Tasks

**Weekly:**
- [ ] Check Vercel deployment logs for errors
- [ ] Monitor Supabase database size
- [ ] Review conversation quality (read some chats)

**Monthly:**
- [ ] Vacuum database (run `VACUUM ANALYZE;` in SQL Editor)
- [ ] Review user feedback
- [ ] Check OpenAI API usage and costs

---

## 6️⃣ Environment-Specific Settings

### Development
```bash
# .env.local (already in repo, keep for local dev)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-key
OPENAI_API_KEY=sk-your-dev-key
```

### Staging (Optional)
Create a separate:
- Supabase project (`coach-os-staging`)
- Vercel deployment (separate Git branch)
- Environment variables for staging

### Production
- Use separate OpenAI API key for production
- Enable rate limiting (Vercel Pro feature)
- Set up custom domain with SSL
- Enable Vercel DDoS protection

---

## 7️⃣ Scaling Considerations

### When You Hit Free Tier Limits

**Supabase Free → Pro ($25/mo):**
- More database storage (8GB vs 500MB)
- No database pausing
- Daily backups
- Better support

**Vercel Free → Pro ($20/mo):**
- More bandwidth
- Advanced analytics
- DDoS protection
- Password protection for previews

**OpenAI Costs:**
- GPT-4o: ~$0.005 per message (5 messages = $0.025)
- Embeddings: ~$0.0001 per message
- Budget for ~1000 messages = $5-7/month

### Performance Optimization

If the app gets slow:

1. **Database Indexing** - Indexes already added, but can optimize queries
2. **Caching** - Add Redis for frequent queries (Vercel KV)
3. **Image Optimization** - Use Next.js Image component
4. **Edge Functions** - Move API routes to edge runtime

---

## 8️⃣ Backup & Recovery

### Database Backups

**Automatic (Supabase Pro):**
- Daily backups included
- 7-day retention

**Manual (Free Tier):**
```bash
# Export schema
supabase db dump > backup.sql

# Or use Supabase Dashboard:
# Database → Backups → Create Backup
```

### Code Backups

- GitHub repository (already pushed)
- Vercel keeps deployment history
- Tag important releases: `git tag v1.0.0`

---

## 9️⃣ Security Checklist

Before going fully public:

- [ ] All environment variables are secret (not in code)
- [ ] Supabase RLS policies enabled (already done in schema)
- [ ] OpenAI API key has usage limits set
- [ ] Vercel has 2FA enabled on your account
- [ ] Supabase has 2FA enabled
- [ ] GitHub repository is private (if needed)
- [ ] Rate limiting considered (Vercel Pro or custom)
- [ ] Email confirmation required for signup (already enabled)

---

## 🔟 Troubleshooting

### Issue: "Invalid API Key" when chatting

**Solution:**
1. Check Vercel environment variables
2. Ensure `OPENAI_API_KEY` is set correctly
3. Redeploy after adding/changing env vars

### Issue: Email confirmation not working

**Solutions:**
1. Check Supabase → Authentication → URL Configuration
2. Ensure redirect URL includes `/auth/callback`
3. Check email spam folder
4. Verify Supabase email sending is working (Settings → Auth → Email)

### Issue: Database errors on signup

**Solution:**
1. Verify all tables created (run schema again if needed)
2. Run `fix-missing-profiles.sql`
3. Check Supabase logs (Logs → Database)

### Issue: Messages not persisting

**Solution:**
1. Check messages table exists
2. Verify RLS policies allow inserts
3. Check browser console for errors
4. Verify `user_id` is being set correctly

### Issue: Embeddings not generating

**Solution:**
1. Check `conversation_embeddings` table exists
2. Verify pgvector extension is enabled
3. Check Vercel function logs (may timeout on free tier)
4. Embeddings run async, give it 10-30 seconds

### Issue: "Conversation not found" error

**Solution:**
1. Verify conversation was created
2. Check conversation has `session_type` field set
3. Clear browser cache and try again

---

## 1️⃣1️⃣ Cost Breakdown

### Minimal MVP ($0-10/month)

- **Supabase:** Free tier (up to 50K MAU, 500MB DB)
- **Vercel:** Free tier (100GB bandwidth)
- **OpenAI:** Pay-as-you-go (~$5-10 for 1000 messages)
- **Domain:** $12/year (optional)

**Total: ~$0-10/month** (excluding domain)

### Scaling to 100 Users ($50-75/month)

- **Supabase Pro:** $25/month
- **Vercel Pro:** $20/month
- **OpenAI:** ~$50-100/month (10K messages)

**Total: ~$95-145/month**

---

## 1️⃣2️⃣ Success Metrics to Track

### Key Metrics (Week 1)

- [ ] Signups: Target 10-20
- [ ] Onboarding completion rate: Target >80%
- [ ] Messages sent: Target 100+
- [ ] Daily active users: Track growth
- [ ] Average session duration: Target >5 minutes

### Monitor These

- **Vercel Analytics**: Page views, unique visitors
- **Supabase**: Database size, query performance
- **OpenAI Dashboard**: API usage and costs
- **User Feedback**: Collect through support email

---

## ✅ Final Pre-Launch Checklist

Before announcing publicly:

- [ ] Tested signup → onboarding → chat flow
- [ ] Verified email confirmation works
- [ ] Tested on mobile device
- [ ] Tested in incognito/private browsing
- [ ] Checked all environment variables are set
- [ ] Domain configured (if using custom domain)
- [ ] Email templates updated (or using default)
- [ ] Set OpenAI usage limits (prevent unexpected costs)
- [ ] Prepared support email (hello@your-domain.com)
- [ ] Created simple landing page or updated index
- [ ] Tested voice features (if planning to use)
- [ ] Reviewed Supabase email rate limits (free tier: 4 emails/hour per user)

---

## 🚀 Launch!

Once everything is checked:

1. **Soft Launch**: Share with 5-10 friends first
2. **Monitor**: Watch for errors in first 24 hours
3. **Iterate**: Fix any issues quickly
4. **Public Launch**: Share on social media, Product Hunt, etc.

---

## 📞 Support Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

### Coach OS Docs (This Repo)
- `DATABASE-SETUP.md` - Database schema details
- `CODE-AUDIT.md` - Code audit and known issues
- `SEO-IMPLEMENTATION.md` - SEO and metadata
- `README-DEV.md` - Development guide

### Getting Help
- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
- **Vercel Discord**: [vercel.com/discord](https://vercel.com/discord)
- **OpenAI Forum**: [community.openai.com](https://community.openai.com)

---

## 🎉 You're Live!

Congratulations! Your AI Executive Coach is now in production.

**Next Steps:**
1. Monitor usage and gather feedback
2. Iterate based on real user behavior
3. Add features from the roadmap (Phase 7+)
4. Scale infrastructure as you grow

**Remember:**
- Start small, iterate fast
- Monitor costs closely
- Listen to user feedback
- Keep the core experience excellent

Good luck! 🚀

---

**Status:** ✅ **PRODUCTION READY**
**Last Updated:** 2025-01-11
**Deployment Time:** ~15 minutes
**Estimated Costs:** $0-10/month for MVP
