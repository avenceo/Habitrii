import LegalDocLayout from './LegalDocLayout';

/**
 * Privacy Policy.
 *
 * Content merged from:
 *  - Habitrii_Privacy_Policy_Branded.docx (the branded template)
 *  - The June 2026 Virginia compliance review, which:
 *      - Removed the two Audos references (former §2.3, and the Audos row
 *        in the §5 vendor table) now that signup/email capture is handled
 *        directly by the Habitrii web app rather than via Audos. If a new
 *        vendor takes on that role, add it back to the §5 table.
 *      - Added §8.2, a dedicated Virginia (VCDPA) rights section — the
 *        policy previously had California and EU sections but nothing for
 *        Virginia, despite AVEN LLC being based here.
 *      - Added "Portability" to the general §8.1 "All users" rights list.
 *
 * IMPORTANT — this document has NOT yet been reviewed by a licensed Virginia
 * attorney, and the VCDPA threshold determination (whether Habitrii is even
 * subject to VCDPA yet) has not been formally confirmed by counsel. Keep the
 * draftNotice banner visible until that review is complete.
 */

const EFFECTIVE_DATE = '[Insert effective date before publishing]';
const LAST_UPDATED = '[Insert effective date before publishing]';

const TOC_ITEMS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-we-collect', label: 'Information we collect' },
  { id: 'how-we-use-information', label: 'How we use information' },
  { id: 'personality-data', label: 'Personality data' },
  { id: 'third-party-services', label: 'Third-party services' },
  { id: 'data-retention', label: 'Data retention' },
  { id: 'data-security', label: 'Data security' },
  { id: 'your-rights', label: 'Your rights' },
  { id: 'cookies', label: 'Cookies and tracking' },
  { id: 'childrens-privacy', label: "Children's privacy" },
  { id: 'third-party-links', label: 'Third-party links' },
  { id: 'international-transfers', label: 'International transfers' },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact' },
];

export default function PrivacyPolicy({ onBack }) {
  return (
    <LegalDocLayout
      title="Privacy policy"
      effectiveDate={EFFECTIVE_DATE}
      lastUpdated={LAST_UPDATED}
      draftNotice="Draft — pending review by a licensed Virginia attorney before publishing, including confirmation of VCDPA applicability."
      tocItems={TOC_ITEMS}
      onBack={onBack}
    >
      <section id="introduction">
        <h2>1. Introduction</h2>
        <p>
          AVEN LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;)
          operates Habitrii, accessible at habitrii.aven4life.com
          (&ldquo;Service&rdquo;). This Privacy Policy explains what
          information we collect, how we use it, and your rights regarding
          your personal data. By using the Service, you agree to the
          collection and use of information as described herein.
        </p>
      </section>

      <section id="information-we-collect">
        <h2>2. Information we collect</h2>

        <h3>2.1 Information you provide directly</h3>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>When collected</th>
              <th>Required?</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email address</td>
              <td>At signup</td>
              <td>Yes</td>
              <td>Account &amp; communication</td>
            </tr>
            <tr>
              <td>Knowledge level</td>
              <td>Onboarding</td>
              <td>Yes</td>
              <td>Personalization</td>
            </tr>
            <tr>
              <td>MBTI personality type</td>
              <td>Onboarding</td>
              <td>Optional</td>
              <td>Penny personalization</td>
            </tr>
            <tr>
              <td>Western astrology sign</td>
              <td>Onboarding</td>
              <td>Optional</td>
              <td>Penny personalization</td>
            </tr>
            <tr>
              <td>Chinese zodiac sign</td>
              <td>Onboarding</td>
              <td>Optional</td>
              <td>Penny personalization</td>
            </tr>
            <tr>
              <td>Lesson interaction choices</td>
              <td>During CYOA sessions</td>
              <td>Yes</td>
              <td>Service functionality</td>
            </tr>
            <tr>
              <td>Penny check-in responses</td>
              <td>After each lesson</td>
              <td>Yes</td>
              <td>AI personalization</td>
            </tr>
          </tbody>
        </table>

        <h3>2.2 Information collected automatically</h3>
        <p>When you use the Service, we may automatically collect:</p>
        <ul>
          <li>Usage data &mdash; lesson completion status, CYOA branch choices, session progress</li>
          <li>Device information &mdash; browser type, operating system, screen resolution</li>
          <li>IP address &mdash; collected for security and analytics purposes</li>
          <li>Analytics data &mdash; page views, session duration, navigation patterns</li>
        </ul>
      </section>

      <section id="how-we-use-information">
        <h2>3. How we use your information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Deliver and personalize the CYOA lesson path based on your knowledge level</li>
          <li>Personalize Penny AI responses based on your profile (knowledge level, MBTI, astrology signs)</li>
          <li>Display your lesson progress and completion status</li>
          <li>Send your profile data and lesson responses to the Anthropic Claude API to generate Penny&rsquo;s personalized check-in responses</li>
          <li>Manage subscription billing through Stripe for Growth and Transformation subscribers</li>
          <li>Send service-related emails (account confirmation, billing receipts)</li>
          <li>Analyze usage patterns to improve lesson content and user experience</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </section>

      <section id="personality-data">
        <h2>4. Personality data &mdash; special notice</h2>
        <p>
          Personality data (MBTI type, Western astrology sign, Chinese
          zodiac sign) is:
        </p>
        <ul>
          <li>Optional &mdash; you can use the full Service without providing it</li>
          <li>Used exclusively to personalize your Habitrii experience</li>
          <li>Sent to Anthropic when you interact with Penny, solely to generate your personalized response</li>
          <li>Not shared with third parties for advertising, profiling, or any purpose outside the Service</li>
          <li>For entertainment and self-reflection only &mdash; not used for predictions or professional assessments</li>
        </ul>
      </section>

      <section id="third-party-services">
        <h2>5. Third-party services</h2>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Purpose</th>
              <th>Privacy policy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Anthropic (Claude API)</td>
              <td>Powers Penny AI check-in responses. Your profile and lesson data are sent to Anthropic&rsquo;s API for processing.</td>
              <td>anthropic.com/privacy</td>
            </tr>
            <tr>
              <td>Stripe</td>
              <td>Processes payments for Growth and Transformation subscriptions. We do not store full payment card details.</td>
              <td>stripe.com/privacy</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Hosts the Habitrii web application and serverless API functions.</td>
              <td>vercel.com/legal/privacy-policy</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="data-retention">
        <h2>6. Data retention</h2>
        <table>
          <thead>
            <tr>
              <th>Data type</th>
              <th>Retention period</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Account data (email, profile)</td>
              <td>Life of account, plus 30 days after deletion request</td>
            </tr>
            <tr>
              <td>Lesson progress and choices</td>
              <td>Life of account</td>
            </tr>
            <tr>
              <td>Subscription and billing records</td>
              <td>7 years (required for tax and financial compliance)</td>
            </tr>
            <tr>
              <td>Anonymized analytics</td>
              <td>Indefinitely (cannot be linked back to you)</td>
            </tr>
          </tbody>
        </table>
        <p>You may request deletion of your personal data at any time (see Section 8).</p>
      </section>

      <section id="data-security">
        <h2>7. Data security</h2>
        <p>
          We implement reasonable technical and organizational measures to
          protect your personal information, including:
        </p>
        <ul>
          <li>HTTPS encryption for all data in transit</li>
          <li>Secure environment variable storage for API keys (never exposed to the browser)</li>
          <li>Third-party services (Stripe, Anthropic, Vercel) with industry-standard security practices</li>
        </ul>
        <p>
          No method of transmission over the internet is 100% secure. If you
          believe your account has been compromised, contact us immediately
          at habitrii@aven4life.com.
        </p>
      </section>

      <section id="your-rights">
        <h2>8. Your rights</h2>

        <h3>8.1 All users</h3>
        <ul>
          <li>Access &mdash; Request a copy of the personal data we hold about you</li>
          <li>Correction &mdash; Request that we correct inaccurate or incomplete data</li>
          <li>Deletion &mdash; Request that we delete your personal data</li>
          <li>Portability &mdash; Request a copy of your personal data in a portable, readily usable format</li>
          <li>Opt-out &mdash; Unsubscribe from marketing communications at any time</li>
        </ul>

        <h3>8.2 Virginia residents (Virginia Consumer Data Protection Act)</h3>
        <p>If you are a Virginia resident, you have the right to:</p>
        <ul>
          <li>Confirm whether we are processing your personal data, and access that data</li>
          <li>Correct inaccuracies in your personal data</li>
          <li>Delete personal data provided by or obtained about you</li>
          <li>Obtain a copy of your personal data in a portable and, to the extent technically feasible, readily usable format</li>
          <li>Opt out of the processing of your personal data for purposes of targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects concerning you</li>
        </ul>
        <p>
          As described in Section 3, we do not currently sell personal data,
          use it for targeted advertising, or use it for profiling that
          produces legal or similarly significant effects &mdash; so these
          opt-out rights are not currently applicable to our processing, but
          you may still contact us with questions.
        </p>
        <p>
          <strong>How to exercise these rights:</strong> Email
          habitrii@aven4life.com with the subject line &ldquo;Virginia
          Privacy Request.&rdquo; We will authenticate your request and
          respond within the time periods required by Virginia law.
        </p>
        <p>
          <strong>Appeals:</strong> If we decline to take action on your
          request, we will explain our reasons. You may appeal that decision
          by emailing habitrii@aven4life.com with the subject line
          &ldquo;Virginia Privacy Appeal.&rdquo; If your appeal is denied,
          you may contact the Office of the Virginia Attorney General,
          Consumer Protection Section.
        </p>

        <h3>8.3 California residents (CCPA / CPRA)</h3>
        <p>California residents have the right to:</p>
        <ul>
          <li>Know what personal information we collect, use, disclose, and sell</li>
          <li>Delete personal information we have collected (subject to certain exceptions)</li>
          <li>Correct inaccurate personal information</li>
          <li>Opt out of the sale or sharing of personal information (we do not sell personal information)</li>
          <li>Limit the use of sensitive personal information</li>
          <li>Non-discrimination for exercising your privacy rights</li>
        </ul>
        <p>
          To submit a CCPA request: email habitrii@aven4life.com with
          subject line &ldquo;CCPA Privacy Request.&rdquo;
        </p>

        <h3>8.4 EU / EEA residents (GDPR)</h3>
        <p>
          EU/EEA residents have the right to: access (Article 15),
          rectification (Article 16), erasure / right to be forgotten
          (Article 17), restriction of processing (Article 18), data
          portability (Article 20), object to processing (Article 21), and
          withdraw consent at any time. You may also lodge a complaint with
          your local data protection supervisory authority.
        </p>
        <p>
          Our legal bases: contract performance, legitimate interests, and
          consent for optional personality data.
        </p>
        <p>
          To exercise GDPR rights: email habitrii@aven4life.com with subject
          line &ldquo;GDPR Privacy Request.&rdquo; We will respond within 30
          days.
        </p>
      </section>

      <section id="cookies">
        <h2>9. Cookies and tracking</h2>
        <p>We use cookies and similar technologies to:</p>
        <ul>
          <li>Maintain your session state while using the Service</li>
          <li>Remember your preferences and progress</li>
          <li>Collect analytics data to improve the Service</li>
        </ul>
        <p>
          Types: Essential (required for functionality) and Analytics
          (usage insights). You can control cookie settings through your
          browser, though disabling essential cookies may prevent the
          Service from functioning correctly.
        </p>
      </section>

      <section id="childrens-privacy">
        <h2>10. Children&rsquo;s privacy &mdash; strict 18+ requirement</h2>
        <p>
          Habitrii is exclusively for adults 18 years of age and older. We
          do not permit use by minors under any circumstances, including
          with parental or guardian consent.
        </p>
        <p>
          We do not knowingly collect personal information from anyone under
          18. If we learn we have inadvertently collected data from a person
          under 18, we will immediately suspend access, delete all personal
          information, and take steps to prevent future access. Contact
          habitrii@aven4life.com if you believe we have collected
          information from a minor.
        </p>
      </section>

      <section id="third-party-links">
        <h2>11. Links to third-party sites</h2>
        <p>
          The Service may contain links to third-party websites. We are not
          responsible for the privacy practices of those sites and encourage
          you to review their privacy policies.
        </p>
      </section>

      <section id="international-transfers">
        <h2>12. International data transfers</h2>
        <p>
          Habitrii is operated from the United States. If you access the
          Service from outside the United States, your information may be
          transferred to, stored, and processed in the United States. For
          EU/EEA users, transfers are made pursuant to appropriate
          safeguards as required by applicable law.
        </p>
      </section>

      <section id="changes">
        <h2>13. Changes to this privacy policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will
          notify you of material changes by posting the revised policy with
          an updated date and sending an email notification. Your continued
          use after the effective date constitutes acceptance of the
          updated Privacy Policy.
        </p>
      </section>

      <section id="contact">
        <h2>14. Contact information</h2>
        <p>AVEN LLC &mdash; Habitrii</p>
        <p>
          Privacy requests: habitrii@aven4life.com (subject line:
          &ldquo;CCPA Privacy Request,&rdquo; &ldquo;GDPR Privacy
          Request,&rdquo; or &ldquo;Virginia Privacy Request&rdquo;)
        </p>
        <p>General inquiries: habitrii@aven4life.com</p>
      </section>
    </LegalDocLayout>
  );
}
