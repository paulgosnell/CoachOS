# Payment Integration Setup Guide

This guide walks you through setting up Revolut payments for Coach OS subscriptions.

## Prerequisites

- Revolut Merchant account (sign up at https://business.revolut.com/merchant)
- Supabase CLI installed (`brew install supabase/tap/supabase`)
- Your Revolut API key from the merchant dashboard

## Step 1: Configure Environment Variables

### Local Development (.env.local)
Add these to your `.env.local` file:

```bash
REVOLUT_API_KEY=your-revolut-api-key-here
REVOLUT_WEBHOOK_SECRET=your-webhook-secret-here
```

### Supabase Secrets
Set the Revolut API key as a Supabase secret so the edge function can access it:

```bash
npx supabase secrets set REVOLUT_API_KEY=your-revolut-api-key-here --project-ref pgtjqgvmgvpqrdiuhtjd
```

## Step 2: Deploy the Webhook Handler

The webhook handler is already deployed, but if you need to redeploy:

```bash
npx supabase functions deploy revolut-webhook-handler --no-verify-jwt --project-ref pgtjqgvmgvpqrdiuhtjd
```

**Important**: The `--no-verify-jwt` flag is required so Revolut can call the webhook without authentication.

## Step 3: Register the Webhook with Revolut

Two options:

### Option A: Use the Admin UI (Recommended)
1. Go to https://your-domain.com/admin/payments
2. Click "Register Webhook" button
3. The webhook URL will be automatically set to: `https://pgtjqgvmgvpqrdiuhtjd.supabase.co/functions/v1/revolut-webhook-handler`

### Option B: Manual API Call
```bash
curl -X POST https://merchant.revolut.com/api/1.0/webhooks \
  -H "Authorization: Bearer YOUR_REVOLUT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://pgtjqgvmgvpqrdiuhtjd.supabase.co/functions/v1/revolut-webhook-handler",
    "events": ["ORDER_COMPLETED"]
  }'
```

## Step 4: Test the Integration

### Using Revolut Sandbox
1. Set `REVOLUT_API_KEY` to your sandbox API key
2. Create a test payment via `/subscribe` page
3. Complete the payment in Revolut sandbox
4. Check the `subscriptions` table in Supabase to verify the subscription was created

### Test Flow
1. User clicks "Upgrade to Pro" on `/subscribe`
2. Backend creates Revolut order via `/api/payments/create-order`
3. User redirects to Revolut checkout and completes payment
4. Revolut sends `ORDER_COMPLETED` webhook to edge function
5. Edge function creates subscription in database
6. Trigger updates `profile.subscription_status` to 'pro'
7. User gains access to all pro features

## Architecture

```
User Payment Flow:
┌─────────────┐
│   User      │
│  /subscribe │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│ /api/payments/create-order   │
│ (Creates Revolut order)      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Revolut Checkout            │
│  (User completes payment)    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Supabase Edge Function                  │
│  /functions/v1/revolut-webhook-handler   │
│  (Receives ORDER_COMPLETED webhook)      │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  subscriptions table         │
│  (Creates active subscription)│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  profiles table              │
│  (subscription_status = pro) │
└──────────────────────────────┘
```

## Pricing

Currently configured:
- **Pro Plan**: £9.99/month
- **Duration**: 30 days per payment
- **Free Features**: Chat conversations
- **Pro Features**: Voice, Coaching Sessions, Goals, Progress tracking, Action items, Custom settings

To change pricing, edit: `src/app/api/payments/create-order/route.ts`

## Webhook Events

The edge function handles:
- `ORDER_COMPLETED`: Activates subscription when payment succeeds

## Security

- Webhook handler runs as Supabase edge function with `--no-verify-jwt` flag
- Uses service role key to update database
- Validates order metadata (user_id, plan)
- Prevents duplicate subscriptions by checking revolut_order_id

## Troubleshooting

### Webhook not firing
- Check webhook is registered: Go to `/admin/payments`
- Verify edge function is deployed: `npx supabase functions list`
- Check edge function logs: Supabase dashboard > Edge Functions > revolut-webhook-handler > Logs

### Subscription not activating
- Check edge function logs for errors
- Verify `REVOLUT_API_KEY` secret is set correctly
- Ensure order metadata includes `user_id` and `plan`

### Payment fails
- Check Revolut API key is valid
- Verify amount is in correct format (pence, not pounds)
- Check Revolut dashboard for error details

## Going Live

1. Switch from Revolut sandbox to production API key
2. Update `REVOLUT_API_KEY` in both .env.local and Supabase secrets
3. Re-register webhook with production credentials
4. Test with small amount first
5. Monitor initial transactions closely

## Support

- Revolut API Docs: https://developer.revolut.com/docs/merchant-api
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
