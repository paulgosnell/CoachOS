import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, userName: string) {
  try {
    await resend.emails.send({
      from: 'Coach OS <onboarding@coachos.app>',
      to,
      subject: 'Welcome to Coach OS',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Coach OS</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1a1a; margin: 0;">Welcome to Coach OS</h1>
            </div>

            <p>Hi ${userName},</p>

            <p>Welcome to Coach OS! We're excited to have you on board.</p>

            <p>You now have access to:</p>
            <ul style="padding-left: 20px;">
              <li>AI-powered coaching conversations</li>
              <li>Personalized coaching frameworks</li>
              <li>Progress tracking and insights</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Get Started
              </a>
            </div>

            <p>If you have any questions, just reply to this email.</p>

            <p>Best regards,<br>The Coach OS Team</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              Coach OS - Your AI Executive Coach
            </p>
          </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendSubscriptionActivatedEmail(to: string, userName: string, expiresAt: Date) {
  try {
    await resend.emails.send({
      from: 'Coach OS <onboarding@resend.dev>',
      to,
      subject: 'Your Coach OS Pro Subscription is Active',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Subscription Activated</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1a1a; margin: 0;">🎉 You're now a Pro member!</h1>
            </div>

            <p>Hi ${userName},</p>

            <p>Your payment was successful and your Coach OS Pro subscription is now active.</p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Pro Features Unlocked:</h3>
              <ul style="padding-left: 20px; margin-bottom: 0;">
                <li>✓ Unlimited chat conversations</li>
                <li>✓ Voice coaching sessions</li>
                <li>✓ Priority framework access</li>
                <li>✓ Action item tracking</li>
                <li>✓ Session history & insights</li>
                <li>✓ Custom voice preferences</li>
                <li>✓ Priority support</li>
              </ul>
            </div>

            <p><strong>Subscription Details:</strong></p>
            <ul style="padding-left: 20px;">
              <li>Plan: Coach OS Pro</li>
              <li>Price: £9.99/month</li>
              <li>Renews: ${expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Using Pro Features
              </a>
            </div>

            <p>Need help? Just reply to this email and we'll be happy to assist.</p>

            <p>Best regards,<br>The Coach OS Team</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              Coach OS - Your AI Executive Coach<br>
              You can manage your subscription in your account settings.
            </p>
          </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Failed to send subscription activated email:', error)
  }
}
