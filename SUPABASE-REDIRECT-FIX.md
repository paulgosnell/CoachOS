# Fixing Supabase Email Confirmation Redirects

## The Problem

When users click the email confirmation link, they're redirected to the homepage with a `?code=xxx` parameter instead of being automatically logged in and sent to onboarding.

**Current behavior:**
```
User clicks email link → https://coach-os-agent.vercel.app/?code=xxx → Stuck on homepage
```

**Expected behavior:**
```
User clicks email link → https://coach-os-agent.vercel.app/auth/callback?code=xxx → Auto-login → Redirect to /onboarding
```

## The Fix

### Option 1: Update Supabase Redirect URL (Recommended)

This is the proper solution that will work for all users going forward.

#### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your Coach OS project
3. Navigate to **Authentication** → **URL Configuration**

#### Step 2: Update Redirect URLs

Find the **Redirect URLs** section and add:

```
https://coach-os-agent.vercel.app/auth/callback
```

**Also add for local development:**
```
http://localhost:3000/auth/callback
```

**Important**: Make sure these are in the **Redirect URLs** list, not just the Site URL.

#### Step 3: Update Site URL

Set the **Site URL** to:
```
https://coach-os-agent.vercel.app
```

#### Step 4: Update Email Templates (Optional)

If you want even more control, you can customize the redirect URL in each email template:

1. Go to **Authentication** → **Email Templates**
2. Edit **Confirm signup** template
3. Find the confirmation URL variable: `{{ .ConfirmationURL }}`
4. Optionally change the redirect parameter in the email link

### Option 2: Client-Side Fallback (Already Implemented)

The homepage (`src/app/page.tsx`) now has client-side code that automatically handles confirmation codes:

```typescript
useEffect(() => {
  const code = searchParams.get('code')
  if (code) {
    const handleConfirmation = async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        router.push('/onboarding')
      }
    }
    handleConfirmation()
  }
}, [searchParams, router])
```

**This means:**
- ✅ Email confirmations will work even if redirected to homepage
- ✅ Users will be auto-logged in and sent to onboarding
- ✅ No action required from you - it's already deployed

However, **Option 1 is still recommended** for cleaner URLs and proper auth flow.

## Testing the Fix

### Test with Option 2 (Already Works)

1. Register a new test account
2. Click the confirmation link in your email
3. You should be automatically redirected to `/onboarding`
4. Check that you're logged in

### After Implementing Option 1

1. Register another test account
2. Click the confirmation link
3. URL should show `/auth/callback?code=xxx` briefly
4. Then redirect to `/onboarding`
5. Cleaner flow, no code visible to user

## Why This Happened

Supabase has two redirect configurations:

1. **Site URL** - Base URL for your app
2. **Redirect URLs** - Allowed callback URLs after authentication

By default, Supabase redirects to the Site URL (`/`) with the code parameter. We need to explicitly tell it to use `/auth/callback` instead.

## Auth Callback Route

The auth callback route at `src/app/auth/callback/route.ts` handles the code exchange:

```typescript
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
}
```

**This route:**
- ✅ Exchanges the code for a session (logs user in)
- ✅ Redirects to `/onboarding`
- ✅ Handles the auth flow server-side

## Other Auth Flows

The same redirect URL fix applies to:

- **Password reset** - Should redirect to `/auth/callback`
- **Magic links** - Should redirect to `/auth/callback`
- **Email change** - Should redirect to `/auth/callback`

Make sure all email templates use the callback URL.

## Environment-Specific Configuration

### Development (localhost:3000)

**Redirect URLs:**
```
http://localhost:3000/auth/callback
```

**Site URL:**
```
http://localhost:3000
```

### Production (Vercel)

**Redirect URLs:**
```
https://coach-os-agent.vercel.app/auth/callback
```

**Site URL:**
```
https://coach-os-agent.vercel.app
```

### Custom Domain (Future)

When you add a custom domain:

**Redirect URLs:**
```
https://coachos.app/auth/callback
https://coach-os-agent.vercel.app/auth/callback
```

**Site URL:**
```
https://coachos.app
```

Keep the Vercel URL as a fallback during DNS transition.

## Troubleshooting

### "Invalid redirect URL" Error

**Cause**: The redirect URL is not in the allowed list.

**Fix**: Add it to Supabase Dashboard → Authentication → URL Configuration → Redirect URLs

### Code Parameter Not Being Removed

**Cause**: Client-side fallback is replacing the URL but browser shows old URL.

**Fix**: This is cosmetic - the user is logged in and redirected. Option 1 will fix this.

### User Not Redirected to Onboarding

**Cause**: User already completed onboarding.

**Fix**: Check `src/app/onboarding/page.tsx` - it redirects to `/dashboard` if already completed.

### Multiple Redirects / Redirect Loop

**Cause**: Both client-side and server-side handling are triggering.

**Fix**: This should not happen as the homepage only handles codes if they exist. Check browser console for errors.

## Security Considerations

### Why Use /auth/callback?

1. **Server-side verification** - Code exchange happens server-side
2. **Secure session creation** - Session is created in httpOnly cookie
3. **No token exposure** - Token never visible in client JavaScript
4. **Proper auth flow** - Follows OAuth best practices

### Why Client-Side Fallback is OK

The client-side fallback on the homepage:
- Uses Supabase's secure `exchangeCodeForSession()` method
- Creates the same httpOnly session cookie
- Is equivalent to the server-side callback
- Just less clean from a URL/UX perspective

Both methods are secure. Option 1 is just cleaner.

## Next Steps

1. **Update Supabase redirect URLs** (Option 1)
2. **Test with new signup** to verify proper flow
3. **Update email templates** if needed
4. **Add custom domain** when ready (optional)

---

**Status**: ✅ **Fixed** (Client-side fallback deployed)
**Recommended**: Configure Supabase redirect URLs for cleaner flow
**Priority**: Medium (works now, but should be cleaned up)
