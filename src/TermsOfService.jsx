import LegalDocLayout from './LegalDocLayout';

/**
 * Terms of Service.
 *
 * Content merged from:
 *  - Habitrii_Terms_of_Service_Branded.docx (the branded template)
 *  - The June 2026 Virginia compliance review, which added:
 *      - 7.2 Automatic Renewal Disclosure (Virginia's automatic-renewal
 *        statute, Va. Code §§59.1-207.45–.49, amended 2026)
 *      - 20. Accessibility (WCAG 2.1 AA commitment statement)
 *  - The August 2026 content-protection update, which expanded:
 *      - 10. Intellectual property (explicit license grant, content-protection
 *        prohibitions incl. redistribution/screenshot-reposting/scraping/account
 *        sharing/watermark circumvention, and an enforcement clause)
 *      - 11. Prohibited uses (cross-reference to Section 10)
 *
 * IMPORTANT — this document has NOT yet been reviewed by a licensed Virginia
 * attorney. The draftNotice banner below must stay visible until that review
 * is complete. Do not delete it as a "cleanup" step — only remove it once
 * Haiden confirms sign-off, and replace EFFECTIVE_DATE / LAST_UPDATED with
 * real dates at that point.
 */

const EFFECTIVE_DATE = '[Insert effective date before publishing]';
const LAST_UPDATED = '[Insert effective date before publishing]';

const TOC_ITEMS = [
  { id: 'acceptance', label: 'Acceptance of terms' },
  { id: 'educational-purpose', label: 'Educational purpose' },
  { id: 'personality-disclaimer', label: 'Personality disclaimer' },
  { id: 'eligibility', label: 'Eligibility (18+)' },
  { id: 'account-registration', label: 'Account registration' },
  { id: 'subscription-tiers', label: 'Tiers and pricing' },
  { id: 'payments-billing', label: 'Payments and billing' },
  { id: 'refund-policy', label: 'Refund policy' },
  { id: 'ai-features', label: 'AI-powered features' },
  { id: 'intellectual-property', label: 'Intellectual property and license' },
  { id: 'prohibited-uses', label: 'Prohibited uses' },
  { id: 'disclaimers', label: 'Disclaimers' },
  { id: 'limitation-of-liability', label: 'Limitation of liability' },
  { id: 'indemnification', label: 'Indemnification' },
  { id: 'governing-law', label: 'Governing law' },
  { id: 'changes-to-terms', label: 'Changes to these terms' },
  { id: 'severability', label: 'Severability' },
  { id: 'entire-agreement', label: 'Entire agreement' },
  { id: 'age-acknowledgment', label: 'Age acknowledgment' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'contact', label: 'Contact' },
];

export default function TermsOfService({ onBack }) {
  return (
    <LegalDocLayout
      title="Terms of service"
      effectiveDate={EFFECTIVE_DATE}
      lastUpdated={LAST_UPDATED}
      draftNotice="Draft — pending review by a licensed Virginia attorney before publishing."
      tocItems={TOC_ITEMS}
      onBack={onBack}
    >
      <section id="acceptance">
        <h2>1. Acceptance of terms</h2>
        <p>
          By accessing or using Habitrii (&ldquo;Service&rdquo;), you agree to be bound
          by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not
          access or use the Service. Habitrii is operated by AVEN LLC, a
          Virginia limited liability company (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        </p>
      </section>

      <section id="educational-purpose">
        <h2>2. Educational purpose &mdash; not financial advice</h2>
        <p>
          Habitrii is an educational and entertainment platform only. Nothing
          in the Service constitutes financial, investment, legal, or tax
          advice.
        </p>
        <p>
          All content is provided for informational and entertainment
          purposes only. No content, lesson, AI response, or personality
          insight should be interpreted as a recommendation to take any
          specific financial action. You should consult a qualified
          financial advisor, attorney, or other licensed professional before
          making any financial decisions.
        </p>
      </section>

      <section id="personality-disclaimer">
        <h2>3. Personality features disclaimer</h2>
        <p>Habitrii offers optional personality-based insights using:</p>
        <ul>
          <li>Myers-Briggs Type Indicator (MBTI)</li>
          <li>Western astrology</li>
          <li>Chinese astrology</li>
        </ul>
        <p>
          These features are provided for entertainment and self-reflection
          purposes only. They are NOT:
        </p>
        <ul>
          <li>Scientifically validated or predictive</li>
          <li>Financial, psychological, or professional guidance of any kind</li>
          <li>A substitute for advice from a qualified professional</li>
        </ul>
      </section>

      <section id="eligibility">
        <h2>4. Eligibility &mdash; strict 18+ requirement</h2>
        <p>
          Habitrii is intended exclusively for adults 18 years of age or
          older. There are no exceptions for minors with parental or
          guardian consent.
        </p>
        <p>
          By accessing or using the Service, you represent and warrant that
          you are at least 18 years old. If we discover or have reason to
          believe that a user is under 18, we will immediately suspend or
          terminate that account and delete any associated data.
        </p>
      </section>

      <section id="account-registration">
        <h2>5. Account registration</h2>
        <p>
          To access certain features, you must provide a valid email
          address. By registering, you agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>Keep your information current</li>
          <li>Maintain the security of your account</li>
          <li>Accept responsibility for all activity that occurs under your account</li>
        </ul>
      </section>

      <section id="subscription-tiers">
        <h2>6. Subscription tiers and pricing</h2>
        <h3>6.1 Foundation (free) tier</h3>
        <p>
          The Foundation tier is free, requires no payment information, and
          does not expire. For the first thirty (30) days after account
          creation, it includes full access to the Mind &amp; Money world (8
          lessons). Thereafter, it includes permanent access to the first
          three (3) lessons of the Mind &amp; Money world, Penny AI check-ins
          for those lessons, and optional personality onboarding. Access to the remaining
          Mind &amp; Money lessons and to all other worlds requires a paid
          subscription. Additional worlds are released over time and become
          available to the subscription tiers indicated at purchase. We may
          modify the content included in any tier and will communicate
          material changes in advance.
        </p>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Price</th>
              <th>Content included</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Foundation</td>
              <td>Free</td>
              <td>Full Mind &amp; Money world (8 lessons) for the first 30 days; thereafter the first 3 lessons free forever, Penny AI check-ins, optional personality onboarding</td>
            </tr>
            <tr>
              <td>Growth</td>
              <td>$9.99/month or $79/year</td>
              <td>Full Mind &amp; Money world (8 lessons), plus Budgeting Foundations, Debt &amp; Credit, and progress dashboard as released</td>
            </tr>
            <tr>
              <td>Transformation</td>
              <td>$19.99/month or $149/year</td>
              <td>Everything in Growth, plus Safety &amp; Stability, Advanced &amp; Values, Money Mirror, and early access</td>
            </tr>
          </tbody>
        </table>
        <p>
          All prices are in U.S. dollars. We reserve the right to modify
          pricing at any time with reasonable advance notice to existing
          subscribers.
        </p>
      </section>

      <section id="payments-billing">
        <h2>7. Payments and billing</h2>

        <h3>7.1 Payment processing</h3>
        <p>
          Paid subscriptions are processed through Stripe, a third-party
          payment processor. By subscribing, you:
        </p>
        <ul>
          <li>Authorize AVEN LLC to charge your payment method on a recurring monthly or annual basis</li>
          <li>Agree to Stripe&rsquo;s terms of service and privacy policy</li>
          <li>Acknowledge that subscriptions renew automatically unless cancelled before the renewal date</li>
        </ul>
        <p>
          You may cancel your subscription at any time through your account
          settings. Cancellation takes effect at the end of the current
          billing period.
        </p>

        <h3>7.2 Automatic renewal disclosure</h3>
        <p>
          By subscribing to Growth or Transformation, you authorize AVEN LLC
          to automatically charge your payment method on a recurring basis
          (monthly or annual, depending on your selected plan) at the
          then-current subscription price, until you cancel. Your
          subscription will automatically renew at the end of each billing
          period unless you cancel before the renewal date.
        </p>
        <p>
          If we increase the price of your subscription, we will provide you
          with advance notice before the change takes effect on your next
          renewal, and you may cancel before that date to avoid the new
          price. You can turn off automatic renewal at any time through your
          account settings; doing so cancels your subscription effective at
          the end of the current billing period, and you will not be charged
          again.
        </p>
      </section>

      <section id="refund-policy">
        <h2>8. Refund policy</h2>
        <p>
          Due to the digital nature of the Service, all subscription
          payments are final and non-refundable unless otherwise required by
          applicable law. If you believe you were charged in error, contact
          us at habitrii@aven4life.com within 7 days of the charge.
        </p>
      </section>

      <section id="ai-features">
        <h2>9. AI-powered features</h2>
        <p>
          Habitrii uses artificial intelligence, including the Anthropic
          Claude API, to power Penny &mdash; our AI companion. When
          interacting with Penny:
        </p>
        <ul>
          <li>Your profile data (knowledge level, MBTI, astrology signs) and lesson responses are sent to Anthropic&rsquo;s API to generate personalized responses</li>
          <li>AI responses are for educational and entertainment purposes only</li>
          <li>We do not guarantee the accuracy or completeness of AI-generated content</li>
          <li>AI responses do not constitute financial, legal, or professional advice</li>
        </ul>
      </section>

      <section id="intellectual-property">
        <h2>10. Intellectual property and content license</h2>

        <h3>10.1 Ownership</h3>
        <p>
          All content, curriculum, lessons, design, code, brand assets, and
          materials within the Service (collectively, &ldquo;Service
          Content&rdquo;) are owned by AVEN LLC or its licensors and are
          protected by applicable copyright, trademark, and other
          intellectual property laws.
        </p>

        <h3>10.2 Your license</h3>
        <p>
          Subject to your compliance with these Terms and, for paid tiers,
          an active subscription, AVEN LLC grants you a limited, personal,
          non-exclusive, non-transferable, revocable license to access and
          use Service Content solely for your own personal, non-commercial
          educational use. All rights not expressly granted to you are
          reserved by AVEN LLC.
        </p>

        <h3>10.3 Content protections</h3>
        <p>You may not, and may not permit or assist anyone else to:</p>
        <ul>
          <li>Reproduce, copy, distribute, publicly display, publish, or republish Service Content, in whole or in part &mdash; including by posting screenshots, screen recordings, photographs, or transcriptions of lesson content to any website, social media platform, or file-sharing service</li>
          <li>Sell, resell, rent, sublicense, or otherwise commercially exploit Service Content</li>
          <li>Create derivative works, courses, or materials based on Service Content</li>
          <li>Scrape, harvest, crawl, or systematically download Service Content by any manual or automated means</li>
          <li>Share your account credentials or otherwise make your account available to any other person, or access the Service through another person&rsquo;s account</li>
          <li>Remove, alter, obscure, or circumvent any watermark, copyright notice, subscription-tier restriction, or other technical protection measure applied to the Service or Service Content</li>
        </ul>
        <p>
          Brief excerpts for your own personal note-taking, and any use that
          qualifies as fair use under applicable law, are not restricted by
          this section.
        </p>

        <h3>10.4 Enforcement</h3>
        <p>
          If we reasonably believe you have violated this Section 10, we may
          suspend or terminate your account without refund, in addition to
          any other rights and remedies available to us under applicable
          law.
        </p>
      </section>

      <section id="prohibited-uses">
        <h2>11. Prohibited uses</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose or in violation of applicable law</li>
          <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure</li>
          <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
          <li>Use automated scripts, bots, or other means to access the Service without permission</li>
          <li>Interfere with or disrupt the integrity or performance of the Service</li>
          <li>Misrepresent your identity or create accounts on behalf of others</li>
          <li>Reproduce, redistribute, or publicly post Service Content except as permitted in Section 10</li>
        </ul>
      </section>

      <section id="disclaimers">
        <h2>12. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
          IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, AVEN LLC
          DISCLAIMS ALL WARRANTIES INCLUDING IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT.
        </p>
      </section>

      <section id="limitation-of-liability">
        <h2>13. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, AVEN LLC SHALL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE
          GREATER OF: (A) THE TOTAL AMOUNT YOU PAID IN THE TWELVE MONTHS
          PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).
        </p>
      </section>

      <section id="indemnification">
        <h2>14. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless AVEN LLC from
          and against any claims, liabilities, damages, and expenses arising
          out of or in connection with your use of the Service, your
          violation of these Terms, or your violation of any applicable law
          or the rights of any third party.
        </p>
      </section>

      <section id="governing-law">
        <h2>15. Governing law and dispute resolution</h2>
        <p>
          These Terms are governed by the laws of the Commonwealth of
          Virginia. Any dispute shall be resolved exclusively in the state
          or federal courts located in Virginia, and you consent to the
          personal jurisdiction of such courts.
        </p>
      </section>

      <section id="changes-to-terms">
        <h2>16. Changes to these terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will
          notify you by posting revised Terms with an updated date and, for
          material changes, sending an email notification. Your continued
          use after the effective date constitutes acceptance of the revised
          Terms.
        </p>
      </section>

      <section id="severability">
        <h2>17. Severability</h2>
        <p>
          If any provision is found unenforceable or invalid, that provision
          will be limited to the minimum extent necessary, and the remaining
          provisions will continue in full force.
        </p>
      </section>

      <section id="entire-agreement">
        <h2>18. Entire agreement</h2>
        <p>
          These Terms, together with our Privacy Policy, constitute the
          entire agreement between you and AVEN LLC regarding the Service.
        </p>
      </section>

      <section id="age-acknowledgment">
        <h2>19. Age requirement acknowledgment</h2>
        <p>
          By using the Service, you explicitly acknowledge that: (a) you are
          at least 18 years of age; (b) you are not using the Service on
          behalf of a minor; (c) you understand that no parental consent
          permits access for anyone under 18; and (d) misrepresentation of
          your age may result in immediate account termination.
        </p>
      </section>

      <section id="accessibility">
        <h2>20. Accessibility</h2>
        <p>
          AVEN LLC is committed to making Habitrii usable by everyone,
          including people with disabilities. We aim to meet the Web Content
          Accessibility Guidelines (WCAG) 2.1 Level AA as our internal
          accessibility standard. If you encounter an accessibility barrier
          while using the Service, please contact us at
          habitrii@aven4life.com so we can address it.
        </p>
      </section>

      <section id="contact">
        <h2>21. Contact information</h2>
        <p>AVEN LLC &mdash; Habitrii</p>
        <p>Support email: habitrii@aven4life.com</p>
        <p>General inquiries: habitrii@aven4life.com</p>
      </section>
    </LegalDocLayout>
  );
}
