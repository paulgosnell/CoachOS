# Coach OS - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your keys:
```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - AI provider key

### 3. Set Up Database
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the schema in `supabase/schema.sql`
4. Verify tables are created in **Table Editor**

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
coach-os/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── callback/
│   │   ├── onboarding/        # User onboarding flow
│   │   ├── dashboard/         # Main dashboard
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   ├── lib/                   # Utilities and configs
│   │   └── supabase/          # Supabase client utilities
│   └── types/                 # TypeScript types
├── supabase/
│   ├── schema.sql             # Database schema
│   └── README.md              # Database setup guide
├── public/                    # Static assets
├── .env.local                 # Environment variables (git-ignored)
└── tailwind.config.ts         # Design system config
```

## 🎨 Design System

All design tokens are configured in `tailwind.config.ts`:

### Colors
- **Titanium**: Primary neutral palette
- **Deep Blue**: Brand color (#0C2340)
- **Silver**: Accent colors

### Typography
- Font: Inter (loaded from Google Fonts)
- Sizes: 2xs (10px) to display (72px)

### Components
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Cards: `.card`, `.card-elevated`
- Inputs: `.input`
- Messages: `.message-user`, `.message-coach`

## 🔐 Authentication Flow

1. **Sign Up** → `/auth/signup`
   - Creates user in `auth.users`
   - Triggers `handle_new_user()` function
   - Creates profile in `profiles` table

2. **Email Confirmation** → `/auth/callback`
   - Verifies email
   - Redirects to `/onboarding`

3. **Onboarding** → `/onboarding`
   - Collects business profile
   - Marks `onboarding_completed = true`
   - Redirects to `/dashboard`

4. **Dashboard** → `/dashboard`
   - Protected route
   - Checks authentication
   - Checks onboarding status

## 📊 Database Tables

### Core Tables
- **profiles** - User profiles
- **business_profiles** - Business context
- **goals** - User goals and priorities

### Conversations
- **conversations** - Session groups
- **messages** - Individual messages
- **conversation_embeddings** - Vector embeddings for RAG

### Memory System
- **daily_summaries** - Daily recaps
- **weekly_summaries** - Weekly rollups
- **action_items** - Tasks and commitments

### Coaching
- **coaching_sessions** - Structured GROW sessions

## 🔒 Security

### Row Level Security (RLS)
All tables have RLS enabled. Users can only access their own data.

### Policies
```sql
-- Example: users can only view their own messages
CREATE POLICY "Users can manage own messages" ON messages
  FOR ALL USING (auth.uid() = user_id);
```

## 🧪 Testing Authentication

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Get Started" → Sign Up
4. Create account with email/password
5. Check email for confirmation link
6. Click link → redirects to `/onboarding`

## 📝 Next Steps (MVP Development)

### Phase 2: Onboarding Flow
- [ ] Multi-step form for business profile
- [ ] Voice recording for initial interview
- [ ] Goal setting interface
- [ ] Coach preference selection

### Phase 3: Chat Interface
- [ ] Real-time chat UI
- [ ] Message persistence
- [ ] Conversation history
- [ ] Context display

### Phase 4: AI Integration
- [ ] OpenAI/Claude integration
- [ ] Streaming responses
- [ ] Context assembly (3-tier)
- [ ] Prompt engineering

### Phase 5: Memory System
- [ ] Embedding generation (background job)
- [ ] RAG search implementation
- [ ] Daily summary generation
- [ ] Weekly rollups

### Phase 6: Voice
- [ ] Voice input (Whisper)
- [ ] Voice output (ElevenLabs/OpenAI TTS)
- [ ] Real-time transcription
- [ ] Audio storage

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Add all variables from `.env.local` to Vercel project settings.

### Database
Supabase handles database hosting. No additional setup needed.

## 📚 Key Documentation

- [PRD](./coach-os-prd.md) - Product vision and features
- [Technical Architecture](./coach-os-technical-architecture.md) - System design
- [Design System](./coach-os-design-system.md) - Visual guidelines
- [Tone of Voice](./coach-os-tone-of-voice.md) - Brand communication
- [Database Setup](./supabase/README.md) - Database guide

## 🐛 Common Issues

### "Invalid API key" error
- Check `.env.local` has correct Supabase keys
- Restart dev server after changing env vars

### Database table not found
- Run the schema in `supabase/schema.sql`
- Check table exists in Supabase dashboard

### Authentication not working
- Verify Supabase URL and keys are correct
- Check email confirmation was clicked
- Clear cookies and try again

## 💡 Development Tips

1. **Use React DevTools** - Debug component state
2. **Check Supabase logs** - See database queries
3. **Use browser DevTools** - Monitor network requests
4. **Hot reload** - Changes reflect immediately
5. **TypeScript** - Fix type errors as you go

## 📞 Support

- **Documentation**: See markdown files in project root
- **Supabase docs**: https://supabase.com/docs
- **Next.js docs**: https://nextjs.org/docs
- **Contact**: paul@p0stman.com

---

**Status**: Phase 1 (Foundation) Complete ✅
**Next**: Phase 2 (Onboarding Flow)
