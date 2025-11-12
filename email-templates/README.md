# Coach OS Email Templates

Professional, branded email templates for Supabase authentication flows.

## Templates Included

### 1. **confirmation.html** - Email Confirmation
- Used when users sign up for Coach OS
- Confirms email address before granting access
- Includes onboarding preview

### 2. **password-reset.html** - Password Reset
- Sent when users request password reset
- Includes security warning
- 1-hour expiration notice

### 3. **magic-link.html** - Magic Link Sign In
- Passwordless authentication option
- One-time use links
- Explains magic link concept

## Design System

All templates use the Coach OS design system:

**Colors:**
- Background: `#0A0A0A` (titanium-950)
- Card background: `#1A1A1A` (titanium-900)
- Primary text: `#C0C0C8` (silver)
- Secondary text: `#8E8E93` (silver-dark)
- Muted text: `#707078` (silver-darker)
- Accent: `#0C2340` (deep-blue)
- CTA button: `#FFFFFF` (white on dark)

**Typography:**
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- Headings: 600 weight
- Body: 400 weight

**Spacing:**
- Mobile-first responsive
- Max width: 600px
- Generous padding for readability

## Supabase Setup Instructions

### Step 1: Access Email Templates in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. You'll see templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

### Step 2: Update Confirmation Email

1. Click **"Confirm signup"**
2. Copy the entire contents of `confirmation.html`
3. Paste into the template editor
4. Click **Save**

**Important Variables:**
- `{{ .ConfirmationURL }}` - Auto-populated by Supabase
- `{{ .Token }}` - Available but not used (URL includes token)
- `{{ .Email }}` - User's email (optional to include)

### Step 3: Update Password Reset Email

1. Click **"Reset Password"**
2. Copy the entire contents of `password-reset.html`
3. Paste into the template editor
4. Click **Save**

### Step 4: Update Magic Link Email

1. Click **"Magic Link"**
2. Copy the entire contents of `magic-link.html`
3. Paste into the template editor
4. Click **Save**

### Step 5: Configure Email Settings

Go to **Authentication** → **Settings** → **Email**:

**Sender Details:**
- **From Email**: `coach@coachos.app` (or your verified domain)
- **From Name**: `Coach OS`

**Email Provider:**
- Default: Supabase's built-in provider (300 emails/hour)
- Recommended for production: Custom SMTP (SendGrid, Postmark, AWS SES)

## Testing Email Templates

### Test Locally

1. Sign up with a new email address
2. Check your inbox for the confirmation email
3. Verify:
   - ✅ Branding looks correct
   - ✅ Colors match Coach OS design
   - ✅ Links work properly
   - ✅ Mobile responsive
   - ✅ Buttons are clickable

### Test in Email Clients

**Desktop:**
- Gmail (web)
- Outlook (web)
- Apple Mail

**Mobile:**
- Gmail app (iOS/Android)
- Apple Mail (iOS)
- Outlook app

### Preview Tools

- [Litmus](https://www.litmus.com/) - Comprehensive email testing
- [Email on Acid](https://www.emailonacid.com/) - Multi-client preview
- [Mailtrap](https://mailtrap.io/) - Email sandbox testing

## Customization

### Adding Your Logo

Replace the text logo with an image:

```html
<!-- Before (text logo) -->
<p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #C0C0C8;">
  Coach OS
</p>

<!-- After (image logo) -->
<img src="https://yourdomain.com/logo.png"
     alt="Coach OS"
     width="120"
     height="40"
     style="display: block; margin: 0 auto;">
```

**Requirements:**
- Host logo on your domain or CDN
- Use `https://` URL
- Recommended size: 240x80px (retina)
- PNG with transparent background

### Changing Colors

Update inline styles throughout:

```html
<!-- Example: Change CTA button color -->
<a href="{{ .ConfirmationURL }}"
   style="background-color: #0C2340; color: #FFFFFF; ...">
  Confirm Email Address
</a>
```

### Adding Custom Content

Insert additional sections before the footer:

```html
<!-- Body Content -->
<tr>
  <td style="padding: 40px 40px 32px;">
    <!-- Existing content -->

    <!-- New custom section -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #C0C0C8;">
            Your custom message here
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

## Email Best Practices

### Deliverability

1. **Use Custom Domain**
   - Set up SPF, DKIM, DMARC records
   - Verify domain in your email provider
   - Use consistent "From" address

2. **Subject Lines**
   - Keep under 50 characters
   - Avoid spam trigger words
   - Be clear and direct

3. **Content**
   - Keep HTML under 100KB
   - Test in multiple email clients
   - Include plain text fallback

### Accessibility

- Use semantic HTML (`<table role="presentation">`)
- Include alt text for images
- Sufficient color contrast (WCAG AA)
- Readable font sizes (minimum 14px)
- Clear call-to-action buttons

### Mobile Optimization

- All templates are mobile-responsive
- Single column layout
- Large touch targets (buttons)
- Readable without zooming

## Supabase Email Variables

Available variables for all templates:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ .ConfirmationURL }}` | Full confirmation link | `https://app.com/auth/confirm?token=...` |
| `{{ .Token }}` | Raw confirmation token | `eyJhbGci...` |
| `{{ .Email }}` | User's email address | `user@example.com` |
| `{{ .TokenHash }}` | Hashed token | `a1b2c3...` |
| `{{ .SiteURL }}` | Your app URL | `https://coachos.app` |
| `{{ .RedirectTo }}` | Redirect after confirmation | `/onboarding` |

**Usage Example:**

```html
<p>Hi {{ .Email }},</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
```

## Advanced: Custom SMTP Setup

For production, use a dedicated email service:

### SendGrid Setup

1. Create SendGrid account
2. Verify sender domain
3. Generate API key
4. In Supabase → Authentication → Settings → SMTP:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **Username**: `apikey`
   - **Password**: Your SendGrid API key

### Postmark Setup

1. Create Postmark account
2. Verify sender signature
3. Get server API token
4. In Supabase SMTP settings:
   - **Host**: `smtp.postmarkapp.com`
   - **Port**: `587`
   - **Username**: Your server API token
   - **Password**: Your server API token

### Benefits of Custom SMTP

- ✅ Higher delivery rates
- ✅ Better analytics
- ✅ No rate limits
- ✅ Custom bounce handling
- ✅ Professional sender reputation

## Troubleshooting

### Emails Not Sending

1. Check Supabase logs (Authentication → Logs)
2. Verify email template syntax
3. Test with different email providers
4. Check spam folder

### Broken Links

- Ensure `{{ .ConfirmationURL }}` is correctly placed
- Check Site URL in Supabase settings
- Verify redirect URLs are whitelisted

### Styling Issues

- Use inline CSS only (email clients don't support `<style>` well)
- Test in multiple email clients
- Avoid complex layouts

### Mobile Display Problems

- Keep max-width at 600px
- Use `width="100%"` on tables
- Test on real mobile devices

## Resources

- [Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email Design Guide](https://www.goodemailcode.com/)
- [Can I Email](https://www.caniemail.com/) - CSS support checker
- [Really Good Emails](https://reallygoodemails.com/) - Inspiration

## Support

If you need help customizing these templates:

1. Check Supabase documentation
2. Review email client compatibility
3. Test thoroughly before deploying

---

**Last Updated**: 2025-01-11
**Templates Version**: 1.0
**Designed for**: Coach OS Brand Identity
