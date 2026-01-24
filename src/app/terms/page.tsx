import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Coach OS - The rules and guidelines for using our AI coaching platform.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-titanium-950">
      {/* Header */}
      <header className="border-b border-white/5 py-4">
        <div className="container mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-silver-dark hover:text-silver transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Coach OS
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto max-w-4xl px-6">
          <h1 className="mb-8 font-serif text-4xl font-bold">Terms of Service</h1>
          <p className="mb-8 text-silver-dark">Last updated: January 2025</p>

          <div className="prose prose-invert prose-lg max-w-none space-y-8 text-silver-light">
            <section>
              <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
              <p>
                By accessing or using Coach OS ("the Service"), operated by Thrive Venture
                Labs Limited ("we", "us", or "our"), you agree to be bound by these Terms
                of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">2. Description of Service</h2>
              <p>
                Coach OS is an AI-powered coaching platform that provides business and
                executive coaching through voice and text interfaces. The Service uses
                artificial intelligence to deliver framework-based coaching, track goals,
                and extract action items from conversations.
              </p>
              <p>
                <strong>Important:</strong> Coach OS is not a substitute for professional
                medical, psychological, or therapeutic advice. If you are experiencing
                mental health difficulties, please consult a qualified healthcare professional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">3. Account Registration</h2>
              <p>To use the Service, you must:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              <p>
                You agree to notify us immediately of any unauthorised use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">4. Subscription and Payment</h2>
              <p>
                Coach OS offers both free and paid subscription tiers. Paid subscriptions
                are billed on a recurring basis (monthly or annually) until cancelled.
              </p>
              <p>
                <strong>Cancellation:</strong> You may cancel your subscription at any time
                through your account settings. Cancellation takes effect at the end of
                your current billing period. We do not provide refunds for partial periods.
              </p>
              <p>
                <strong>Price Changes:</strong> We may change subscription prices with 30
                days notice. Continued use of the Service after price changes constitutes
                acceptance of the new prices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">5. Acceptable Use</h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Attempt to gain unauthorised access to the Service</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use the Service for any illegal or harmful purpose</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Use automated systems to access the Service without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">6. Intellectual Property</h2>
              <p>
                The Service, including its design, features, and content (excluding user
                content), is owned by Thrive Venture Labs Limited and protected by
                copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong>Your Content:</strong> You retain ownership of the content you
                provide to the Service (conversations, goals, etc.). By using the Service,
                you grant us a licence to use this content solely to provide and improve
                the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">7. AI-Generated Content</h2>
              <p>
                The coaching responses, summaries, and insights provided by Coach OS are
                generated by artificial intelligence. While we strive for accuracy and
                helpfulness:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>AI responses may not always be accurate or appropriate</li>
                <li>The Service does not provide professional advice</li>
                <li>You should use your own judgement when acting on AI suggestions</li>
                <li>We do not guarantee specific outcomes from using the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Thrive Venture Labs Limited shall
                not be liable for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits or revenues, whether incurred
                directly or indirectly.
              </p>
              <p>
                Our total liability for any claims arising from your use of the Service
                shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">9. Disclaimer of Warranties</h2>
              <p>
                The Service is provided "as is" and "as available" without warranties of
                any kind, either express or implied, including but not limited to implied
                warranties of merchantability, fitness for a particular purpose, and
                non-infringement.
              </p>
              <p>
                We do not warrant that the Service will be uninterrupted, error-free, or
                secure, or that defects will be corrected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Thrive Venture Labs Limited and
                its officers, directors, employees, and agents from any claims, damages,
                losses, or expenses arising from your use of the Service or violation of
                these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">11. Termination</h2>
              <p>
                We may suspend or terminate your access to the Service at any time for
                any reason, including violation of these Terms. Upon termination, your
                right to use the Service will immediately cease.
              </p>
              <p>
                You may terminate your account at any time by contacting us or using the
                account deletion feature.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">12. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. We will notify you of material
                changes by email or through the Service. Your continued use of the Service
                after changes take effect constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the
                laws of England and Wales. Any disputes arising from these Terms or
                your use of the Service shall be subject to the exclusive jurisdiction
                of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">14. Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p>
                <strong>Thrive Venture Labs Limited</strong><br />
                Email: legal@ceocoachos.com
              </p>
            </section>
          </div>
        </div>
      </article>
    </main>
  )
}
