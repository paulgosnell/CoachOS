# Coach OS - Complete Setup Guide

## 🎯 What You Have Now

✅ **Phase 1: MVP Foundation (COMPLETE)**
- Next.js 14 app with TypeScript
- TailwindCSS with complete design system
- Supabase authentication (signup/login)
- Database schema ready to deploy
- Protected routes (dashboard/onboarding)
- Mobile-first responsive design
- Premium business-class UI

## 🚀 Deploy in 30 Minutes

### Step 1: Supabase Setup (10 mins)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose a name (e.g., "coach-os-prod")
   - Set strong database password
   - Choose region closest to your users

2. **Run Database Schema**
   - In Supabase dashboard → SQL Editor
   - Click "New Query"
   - Copy entire `supabase/schema.sql`
   - Click "Run"
   - Wait for completion (creates 11 tables)

3. **Verify Tables Created**
   - Go to Table Editor
   - Confirm you see: profiles, business_profiles, goals, conversations, messages, etc.

4. **Get API Keys**
   - Go to Settings → API
   - Copy:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 2: Get AI Provider Keys (5 mins)

**Option A: OpenAI (Recommended)**
1. Go to https://platform.openai.com/api-keys
2. Create new key
3. Copy → `OPENAI_API_KEY`

**Option B: Anthropic Claude**
1. Go to https://console.anthropic.com
2. Create API key
3. Copy → `ANTHROPIC_API_KEY`

### Step 3: Deploy to Vercel (10 mins)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Coach OS MVP Foundation"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Add environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     OPENAI_API_KEY=your-openai-key
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     ```
   - Click "Deploy"
   - Wait 2-3 minutes

3. **Test Deployment**
   - Visit your Vercel URL
   - Try signing up
   - Check email confirmation
   - Verify you can log in

### Step 4: Configure Email (5 mins)

1. **Supabase Email Settings**
   - Go to Authentication → Email Templates
   - Customize confirmation email
   - Add your branding

2. **Custom Domain (Optional)**
   - Vercel → Settings → Domains
   - Add your domain (e.g., coachos.ai)
   - Update DNS records

## ✅ Post-Deployment Checklist

- [ ] Supabase database schema deployed
- [ ] All tables visible in Table Editor
- [ ] RLS policies enabled
- [ ] Environment variables set in Vercel
- [ ] App deployed and accessible
- [ ] Can create account
- [ ] Email confirmation works
- [ ] Can log in
- [ ] Protected routes work (dashboard redirects if not logged in)

## 🧪 Test Your Deployment

### Test 1: Sign Up Flow
1. Go to your app URL
2. Click "Get Started"
3. Fill in signup form
4. Submit
5. ✅ Should see "Check your email"

### Test 2: Email Confirmation
1. Check email inbox
2. Click confirmation link
3. ✅ Should redirect to `/onboarding`

### Test 3: Authentication
1. Log out
2. Try to access `/dashboard` directly
3. ✅ Should redirect to `/auth/login`
4. Log in
5. ✅ Should reach dashboard

### Test 4: Database
1. Go to Supabase → Table Editor
2. Click "profiles" table
3. ✅ Should see your user profile

## 📊 What's Built (Phase 1)

### Pages
- ✅ Home page with hero and features
- ✅ Sign up page with form validation
- ✅ Login page with authentication
- ✅ Email callback handler
- ✅ Onboarding page (placeholder)
- ✅ Dashboard page (basic layout)

### Authentication
- ✅ Email/password signup
- ✅ Email confirmation
- ✅ Login with password
- ✅ Protected routes
- ✅ Session management
- ✅ Auto profile creation

### Database
- ✅ 11 tables created
- ✅ Indexes optimized
- ✅ RLS policies enabled
- ✅ Triggers for auto-updates
- ✅ Vector search ready (pgvector)

### Design System
- ✅ Complete color palette
- ✅ Typography system
- ✅ Component library
- ✅ Responsive breakpoints
- ✅ Dark mode (default)
- ✅ Animations and transitions

## 🔜 Next Development Phases

### Phase 2: Onboarding (Next Priority)
**Goal**: Collect business profile and goals

**To Build**:
- [ ] Multi-step form (business info, role, goals)
- [ ] Progress indicator
- [ ] Voice recording for initial interview
- [ ] Save to `business_profiles` table
- [ ] Mark `onboarding_completed = true`
- [ ] Redirect to dashboard

**Files to Create**:
- `src/app/onboarding/steps/...`
- `src/components/onboarding/...`

### Phase 3: Chat Interface
**Goal**: Real-time coaching conversations

**To Build**:
- [ ] Chat UI component
- [ ] Message input (text)
- [ ] Message display (user vs coach)
- [ ] Conversation persistence
- [ ] New conversation button
- [ ] Conversation history sidebar

**Files to Create**:
- `src/app/chat/page.tsx`
- `src/components/chat/...`

### Phase 4: AI Integration
**Goal**: Connect OpenAI/Claude for responses

**To Build**:
- [ ] API route `/api/chat`
- [ ] Streaming responses
- [ ] Context assembly (3-tier)
- [ ] System prompt with coaching personality
- [ ] Message storage

**Files to Create**:
- `src/app/api/chat/route.ts`
- `src/lib/ai/...`

### Phase 5: Memory System
**Goal**: Full context awareness

**To Build**:
- [ ] Embedding generation (background)
- [ ] RAG search function
- [ ] Daily summary generation
- [ ] Context retrieval utilities

### Phase 6: Voice
**Goal**: Voice input/output

**To Build**:
- [ ] Voice recording UI
- [ ] Whisper transcription
- [ ] ElevenLabs TTS
- [ ] Audio storage

## 💡 Development Tips

### Local Development
```bash
# Install dependencies
npm install

# Copy env vars
cp .env.example .env.local
# Fill in your keys

# Run dev server
npm run dev
```

### Database Changes
When you modify the schema:
1. Update `supabase/schema.sql`
2. Run new migration in Supabase SQL Editor
3. Document changes in `supabase/README.md`

### Adding New Tables
```sql
-- Example: Add new table
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  -- ... other columns
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Add policy
CREATE POLICY "Users can manage own data" ON new_table
  FOR ALL USING (auth.uid() = user_id);
```

## 🆘 Troubleshooting

### Build Fails on Vercel
- Check environment variables are set
- Verify no TypeScript errors locally: `npm run type-check`
- Check build logs in Vercel dashboard

### Authentication Not Working
- Verify Supabase keys in `.env.local`
- Check email confirmation was clicked
- Clear browser cookies and try again
- Check Supabase logs in dashboard

### Database Errors
- Verify schema was run successfully
- Check RLS policies are enabled
- Verify user is authenticated
- Check Supabase logs

### Can't Access Protected Routes
- Make sure user is logged in
- Check session is valid (not expired)
- Verify middleware is running
- Check browser console for errors

## 📞 Need Help?

1. **Check Documentation**
   - [PRD](./coach-os-prd.md) - Product vision
   - [Technical Architecture](./coach-os-technical-architecture.md) - System design
   - [Design System](./coach-os-design-system.md) - UI guidelines
   - [Development Guide](./README-DEV.md) - Dev setup

2. **Common Resources**
   - Supabase Docs: https://supabase.com/docs
   - Next.js Docs: https://nextjs.org/docs
   - Vercel Docs: https://vercel.com/docs

3. **Contact**
   - Email: paul@p0stman.com

---

## 🎉 Congratulations!

You now have:
- ✅ Production-ready authentication
- ✅ Secure database with RLS
- ✅ Beautiful UI with design system
- ✅ Deployed and accessible app
- ✅ Solid foundation for MVP features

**Next Step**: Build the onboarding flow to collect business profiles!
