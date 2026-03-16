import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | EDH Commander Randomizer',
  description:
    'Privacy policy for EDH Commander Randomizer. Learn how we handle your data, cookies, and third-party services.',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen items-center bg-surface text-text-primary">
      <main className="w-full max-w-180 mx-auto py-20 px-10 bg-surface-card max-sm:py-12 max-sm:px-6 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-10 [&_h1]:tracking-tight [&_h1]:mb-4 max-sm:[&_h1]:text-2xl max-sm:[&_h1]:leading-snug [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-text-secondary [&_p]:mb-4 [&_a]:text-text-primary [&_a]:font-medium [&_ul]:text-text-secondary [&_ul]:mb-4 [&_ul]:pl-6 [&_ul]:list-disc [&_li]:mb-1 [&_li]:leading-relaxed">
        <Link href="/" className="inline-block mb-6 text-text-secondary no-underline text-sm hover:text-text-primary">
          &larr; Back to Randomizer
        </Link>

        <h1>Privacy Policy</h1>
        <p>Last updated: March 16, 2026</p>

        <p>
          EDH Commander Randomizer (&quot;we&quot;, &quot;our&quot;, or &quot;the site&quot;) is
          committed to protecting your privacy. This policy explains what data we collect, how we use
          it, and your rights regarding that data.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We do not require you to create an account or provide any personal information to use this
          site. The site does not collect names, email addresses, or other personally identifiable
          information unless you voluntarily contact us.
        </p>

        <h2>Local Storage</h2>
        <p>
          Your favorites and history are stored exclusively in your browser&apos;s local storage.
          This data never leaves your device and is not transmitted to our servers or any third party.
          You can clear this data at any time through the site&apos;s interface or your browser
          settings.
        </p>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services that may collect data:</p>

        <ul>
          <li>
            <strong>Google AdSense</strong> — We use Google AdSense to display advertisements.
            Google may use cookies and web beacons to serve ads based on your prior visits to this
            site or other websites. You can opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </li>
          <li>
            <strong>Scryfall API</strong> — Card data and images are fetched from{' '}
            <a href="https://scryfall.com" target="_blank" rel="noopener noreferrer">
              Scryfall
            </a>
            . Your requests to Scryfall are subject to their own{' '}
            <a href="https://scryfall.com/docs/privacy" target="_blank" rel="noopener noreferrer">
              privacy policy
            </a>.
          </li>
          <li>
            <strong>EDHREC</strong> — Deck popularity and archetype data are fetched from{' '}
            <a href="https://edhrec.com" target="_blank" rel="noopener noreferrer">
              EDHREC
            </a>
            . Requests are subject to their privacy policy.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          This site does not set first-party cookies. However, third-party services such as Google
          AdSense may set cookies on your device for ad personalization and analytics purposes. You
          can manage cookie preferences through your browser settings.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          This site is not directed at children under the age of 13. We do not knowingly collect
          personal information from children.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Changes will be posted on this page
          with an updated revision date.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, contact us at{' '}
          <a href="mailto:krs19@xtra.co.nz">krs19@xtra.co.nz</a>.
        </p>
      </main>
    </div>
  );
}
