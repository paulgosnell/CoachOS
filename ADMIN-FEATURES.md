# Coach OS - Admin Dashboard Features

**Status:** ✅ Complete
**Date:** 2025-01-11

---

## 🎯 Overview

Complete admin dashboard for monitoring Coach OS performance, analyzing coaching sessions, and managing user feedback.

### What's Included:

1. **Admin Dashboard** - Overview with key metrics
2. **User Management** - View all users and their activity
3. **Session Analytics** - Analyze coaching sessions and frameworks
4. **Feedback System** - Collect and manage user feedback
5. **Database Views** - Optimized queries for admin data

---

## 🚀 Setup Instructions

### Step 1: Run Admin Schema

After running the main schema (`schema-fixed.sql`), run the admin schema:

```bash
# In Supabase SQL Editor
# Run: supabase/admin-schema.sql
```

This creates:
- Admin flag in profiles
- Feedback table
- Session analytics table
- Admin activity log
- Helper views for efficient queries

### Step 2: Make Yourself Admin

In Supabase SQL Editor, run:

```sql
UPDATE profiles
SET is_admin = TRUE
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with your actual email.

### Step 3: Access Admin Dashboard

Navigate to: `https://your-domain.com/admin`

If you're not an admin, you'll be redirected to the regular dashboard.

---

## 📊 Admin Dashboard Features

### 1. Admin Home (`/admin`)

**Stats Displayed:**
- Total Users
- Total Conversations
- Total Messages
- New/Total Feedback
- Active users (last 7 days)
- New conversations (last 7 days)

**Quick Actions:**
- Manage Users
- View Sessions
- Review Feedback

---

### 2. User Management (`/admin/users`)

**View:**
- List of all users
- User details (name, email, joined date)
- Activity metrics per user:
  - Total conversations
  - Total messages
  - Average sentiment score
  - Last active date
  - Activity in last 7 days

**Highlights:**
- See which users haven't completed onboarding
- Identify most/least active users
- Track sentiment trends per user

---

### 3. Session Analytics (`/admin/sessions`)

**Session List Shows:**
- Session title and date
- User (name/email)
- Framework used (GROW, CLEAR, OSKAR, etc.)
- Sentiment (positive, neutral, negative, mixed)
- Session type
- Duration
- Success rating (1-5)
- Breakthrough detection 🌟

**Metrics Per Session:**
- Message count
- Clarity score (0-100%)
- Depth score (0-100%)
- Action items count
- Value score (0-100%)

**Summary Stats:**
- Avg duration across all sessions
- Avg messages per session
- Total breakthroughs
- Avg clarity score

**Use Cases:**
- Identify which frameworks are most effective
- See if AI is getting to value quickly
- Track sentiment patterns
- Find breakthrough moments
- Measure coaching quality

---

### 4. Feedback Management (`/admin/feedback`)

**Feedback Types:**
- 🐛 Bug
- ✨ Feature Request
- 🚀 Improvement
- 💬 General

**Categories:**
- AI Coach Quality
- UI/UX
- Performance
- Voice Features
- Onboarding
- Other

**Status Tracking:**
- New (blue)
- Reviewed (purple)
- In Progress (yellow)
- Resolved (green)
- Closed (gray)

**Priority Levels:**
- Low
- Medium
- High
- Urgent

---

## 🔧 User Feedback System

### For Users:

1. Click **"Send Feedback"** button on dashboard
2. Select feedback type (bug, feature, improvement, general)
3. Choose category
4. Write subject and message
5. Submit

Feedback is immediately visible in admin dashboard.

### For Admins:

- All feedback visible at `/admin/feedback`
- Shows type, category, subject, message, status, priority
- Can see submission date and user info
- Filter by status/type (future enhancement)

---

## 📈 Database Schema

### Tables Added:

#### `feedback`
```sql
- id (UUID)
- user_id (references profiles)
- type (bug, feature, improvement, general)
- category (ai_quality, ui_ux, performance, etc.)
- subject (text)
- message (text)
- status (new, reviewed, in_progress, resolved, closed)
- priority (low, medium, high, urgent)
- admin_notes (text, for internal use)
- created_at, updated_at
```

#### `session_analytics`
```sql
- id (UUID)
- conversation_id (references conversations)
- user_id (references profiles)
- sentiment, sentiment_score
- key_topics (array)
- frameworks_detected (array)
- message_count, user_message_count, coach_message_count
- clarity_score, depth_score (0-1)
- action_items_count
- breakthrough_detected (boolean)
- value_delivered (text)
- analyzed_at
```

#### `admin_activity_log`
```sql
- id (UUID)
- admin_user_id (references profiles)
- action (viewed_user, viewed_session, etc.)
- resource_type, resource_id
- details (JSONB)
- ip_address, user_agent
- created_at
```

### Fields Added to `conversations`:
```sql
- framework_used (TEXT) - e.g., 'grow', 'clear', 'oskar'
- sentiment (TEXT) - e.g., 'positive', 'neutral', 'negative'
- success_rating (INTEGER 1-5)
- value_score (DECIMAL 0-1)
- session_notes (TEXT)
- analyzed_at (TIMESTAMPTZ)
```

### Views Created:

#### `admin_user_summary`
Optimized view for user list with:
- User details
- Total conversations and messages
- Last active date
- Avg sentiment
- Recent activity (last 7 days)

#### `admin_session_summary`
Optimized view for session list with:
- Session details
- User info
- Message counts
- All analytics scores
- Framework and sentiment

#### `admin_framework_effectiveness`
Aggregate view showing:
- Sessions per framework
- Avg success rating per framework
- Avg sentiment, clarity, depth
- Breakthrough count
- Avg duration

---

## 🔐 Security

**Row Level Security (RLS):**

- ✅ Users can only submit and view their own feedback
- ✅ Admins can view all feedback
- ✅ Only admins can update feedback status
- ✅ Session analytics visible to user or admin only
- ✅ Admin activity log only visible to admins
- ✅ Profiles table includes `is_admin` flag (default FALSE)

**Admin Check:**
- All admin pages check `isAdmin()` on load
- Redirects non-admins to dashboard
- All admin API routes verify admin status
- Returns 401 Unauthorized if not admin

---

## 📊 Analytics & Insights

### What You Can Track:

1. **User Engagement:**
   - Who's using the service most?
   - Who hasn't engaged recently?
   - Are users completing onboarding?

2. **Session Quality:**
   - Are sessions delivering value?
   - Which frameworks work best?
   - Is AI getting to actionable insights?
   - Are users having breakthrough moments?

3. **Sentiment Trends:**
   - Overall user sentiment
   - Sentiment by framework
   - Users with negative sentiment (need follow-up)

4. **Feature Requests:**
   - What do users want?
   - Common pain points
   - Bug reports

5. **Coaching Effectiveness:**
   - Clarity scores (is AI clear and actionable?)
   - Depth scores (is AI going deep vs surface?)
   - Action items generated
   - Success ratings

---

## 🎯 Use Cases

### Scenario 1: Improving Coaching Quality

**Problem:** Users say AI is too exploratory, not getting to value.

**Solution:**
1. Go to `/admin/sessions`
2. Look at sessions with low `value_score` or `clarity_score`
3. Check `depth_score` - if high but clarity low, AI is going deep but not actionable
4. Read actual conversations (future feature: session detail view)
5. Adjust AI prompts to be more directive

### Scenario 2: Framework Effectiveness

**Question:** Which coaching framework works best?

**Solution:**
1. Go to Supabase and query `admin_framework_effectiveness` view
2. Compare avg success ratings across frameworks
3. Look at breakthrough counts
4. Adjust onboarding to recommend most effective framework

### Scenario 3: User Retention

**Problem:** Users sign up but don't engage.

**Solution:**
1. Go to `/admin/users`
2. Filter by `onboarding_completed = false` (visually shown)
3. See users with 0 conversations
4. Reach out personally or improve onboarding flow

### Scenario 4: Feature Prioritization

**Question:** What should we build next?

**Solution:**
1. Go to `/admin/feedback`
2. Count feature requests by category
3. Prioritize high-urgency + frequently requested features
4. Update status as you work on them

---

## 🚧 Future Enhancements

### Planned Features:

1. **Session Detail View** (`/admin/sessions/[id]`)
   - Full conversation transcript
   - AI analysis breakdown
   - Manual scoring/notes
   - Framework adherence tracking

2. **AI Analysis Automation**
   - Auto-analyze sessions after completion
   - Generate sentiment scores
   - Detect frameworks used
   - Calculate clarity/depth scores
   - Flag breakthroughs

3. **User Detail View** (`/admin/users/[id]`)
   - All user's conversations
   - Goals progress tracking
   - Coaching history
   - Engagement timeline

4. **Feedback Management**
   - Update status/priority inline
   - Add admin notes
   - Assign to team members
   - Link feedback to features/bugs

5. **Advanced Analytics**
   - Charts and graphs (use recharts)
   - Trend analysis over time
   - Cohort analysis
   - Retention metrics
   - Framework effectiveness dashboard

6. **Export Features**
   - Export sessions to CSV
   - Export feedback to CSV
   - Generate reports

7. **Notifications**
   - Alert admins on new urgent feedback
   - Daily/weekly summary emails
   - Low sentiment alerts

---

## 🔧 Technical Implementation

### API Routes:

```
GET /api/admin/users          - List all users with stats
GET /api/admin/sessions       - List all sessions with analytics
GET /api/admin/feedback       - List all feedback

GET /api/feedback             - User's own feedback
POST /api/feedback            - Submit feedback
```

### Admin Utilities:

```typescript
// src/lib/admin.ts

isAdmin(): Promise<boolean>
// Check if current user is admin

requireAdmin(): Promise<void>
// Throw error if not admin (use in server components)
```

### Components:

```typescript
// src/components/FeedbackModal.tsx
// User-facing feedback submission modal

// src/components/dashboard/DashboardClient.tsx
// Dashboard with feedback button
```

---

## 🧪 Testing Admin Features

### Test as Admin:

1. **Make yourself admin:**
   ```sql
   UPDATE profiles SET is_admin = TRUE WHERE email = 'your@email.com';
   ```

2. **Access admin dashboard:**
   - Navigate to `/admin`
   - Should see admin home

3. **Test each section:**
   - Click "Manage Users" - should see user list
   - Click "View Sessions" - should see sessions
   - Click "Review Feedback" - should see feedback

4. **Submit test feedback:**
   - Go to `/dashboard`
   - Click "Send Feedback"
   - Submit test feedback
   - Check `/admin/feedback` - should appear

### Test as Non-Admin:

1. **Access dashboard normally:**
   - Should NOT see admin links
   - `/admin` should redirect to `/dashboard`

2. **Submit feedback:**
   - Should be able to submit
   - Should only see own feedback at `/api/feedback`

---

## 📝 Admin Workflow

### Daily:

1. Check `/admin` for new feedback
2. Review any urgent items
3. Glance at user activity stats

### Weekly:

1. Review `/admin/sessions`
2. Check framework effectiveness
3. Identify low-quality sessions
4. Look for sentiment trends
5. Process feedback (update statuses)

### Monthly:

1. Analyze user engagement trends
2. Review retention metrics
3. Identify power users
4. Re-engage inactive users
5. Plan feature roadmap based on feedback

---

## 🎓 Session Analysis Guide

### Understanding Metrics:

**Clarity Score (0-100%):**
- How clear and actionable is the coaching?
- Low clarity = vague, theoretical, not actionable
- High clarity = specific, concrete, actionable advice

**Depth Score (0-100%):**
- How deep vs surface-level is the conversation?
- Low depth = shallow, generic advice
- High depth = explores underlying issues, root causes

**Value Score (0-100%):**
- Overall value delivered in session
- Combination of clarity, depth, actionability
- Low value = wasted time, no progress
- High value = clear next steps, insights gained

**Sentiment Score (-1 to +1):**
- User's emotional state during conversation
- Negative: frustrated, confused, unhappy
- Neutral: factual, transactional
- Positive: energized, hopeful, motivated

**Breakthrough Detection:**
- Did user have an "aha!" moment?
- Indicators: sudden clarity, excitement, new perspective
- Marked with 🌟 in UI

### Ideal Session Profile:

- **Clarity:** >70%
- **Depth:** 50-80% (not too shallow, not overwhelming)
- **Value:** >60%
- **Sentiment:** >0.3 (positive)
- **Duration:** 10-30 minutes
- **Messages:** 8-20 (good back-and-forth)
- **Action Items:** 2-5
- **Framework:** Any (GROW often best)

### Red Flags:

⚠️ **Low Clarity + High Depth:**
- AI going deep but not actionable
- Fix: Prompt AI to be more directive

⚠️ **Short Duration + Few Messages:**
- User dropped off quickly
- Fix: Improve engagement, ask better questions

⚠️ **Negative Sentiment:**
- User frustrated or confused
- Fix: Follow up personally, improve prompts

⚠️ **No Action Items:**
- Session didn't lead to next steps
- Fix: AI should always end with actions

⚠️ **Very Long Duration (>60 min):**
- Could indicate circular conversation
- Fix: AI should drive toward conclusion

---

## 📚 References

### Related Files:

- `supabase/admin-schema.sql` - Database schema
- `src/lib/admin.ts` - Admin utilities
- `src/app/admin/*` - Admin pages
- `src/app/api/admin/*` - Admin API routes
- `src/components/FeedbackModal.tsx` - Feedback form

### Documentation:

- `DATABASE-SETUP.md` - Main database setup
- `PRODUCTION-DEPLOY.md` - Deployment guide
- `CODE-AUDIT.md` - Code audit and status

---

## ✅ Admin Features Checklist

### Setup:
- [ ] Run `admin-schema.sql` in Supabase
- [ ] Make yourself admin (UPDATE profiles)
- [ ] Verify tables created (feedback, session_analytics, etc.)
- [ ] Test access to `/admin`

### Features to Test:
- [ ] Admin dashboard home shows stats
- [ ] User management page loads
- [ ] Sessions page loads
- [ ] Feedback page loads
- [ ] User can submit feedback
- [ ] Feedback appears in admin panel
- [ ] Non-admins can't access `/admin`

### Future Enhancements:
- [ ] Session detail view
- [ ] AI auto-analysis of sessions
- [ ] Charts and graphs
- [ ] Export to CSV
- [ ] Feedback status management
- [ ] User detail view

---

**Status:** ✅ **Ready for Production**
**Build:** ✅ Passing
**Database:** ✅ Schema ready
**Security:** ✅ RLS configured
**UI:** ✅ Complete

---

**Built:** 2025-01-11
**Version:** 1.0
**Ready for:** Deployment and user testing
