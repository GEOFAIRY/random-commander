import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | EDH Commander Randomizer',
  description:
    'Terms of service for EDH Commander Randomizer. Understand the terms governing your use of our free MTG commander generator tool.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen items-center bg-surface text-text-primary">
      <main className="w-full max-w-180 mx-auto py-20 px-10 bg-surface-card max-sm:py-12 max-sm:px-6 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-10 [&_h1]:tracking-tight [&_h1]:mb-4 max-sm:[&_h1]:text-2xl max-sm:[&_h1]:leading-snug [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-text-secondary [&_p]:mb-4 [&_a]:text-text-primary [&_a]:font-medium">
        <Link href="/" className="inline-block mb-6 text-text-secondary no-underline text-sm hover:text-text-primary">
          &larr; Back to Randomizer
        </Link>

        <h1>Terms of Service</h1>
        <p>Last updated: March 16, 2026</p>

        <p>
          By using EDH Commander Randomizer (&quot;the site&quot;), you agree to these terms. If you
          do not agree, please do not use the site.
        </p>

        <h2>Use of the Site</h2>
        <p>
          EDH Commander Randomizer is a free tool that generates random commander suggestions for
          Magic: The Gathering&apos;s Commander (EDH) format. You may use it for personal,
          non-commercial purposes. You agree not to abuse, disrupt, or interfere with the
          site&apos;s operation.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          Magic: The Gathering is a trademark of Wizards of the Coast LLC. Card names, images, and
          related data are the property of their respective owners. Card images and data are provided
          by{' '}
          <a href="https://scryfall.com" target="_blank" rel="noopener noreferrer">
            Scryfall
          </a>{' '}
          under fair use. Deck statistics are provided by{' '}
          <a href="https://edhrec.com" target="_blank" rel="noopener noreferrer">
            EDHREC
          </a>
          . This site is not affiliated with, endorsed by, or sponsored by Wizards of the Coast,
          Scryfall, or EDHREC.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          The site is provided &quot;as is&quot; without warranties of any kind, either express or
          implied. We do not guarantee that the site will be available, error-free, or that the data
          displayed (including card legality, deck statistics, or partner pairings) will be accurate
          or up to date.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, EDH Commander Randomizer and its operator shall not
          be liable for any damages arising from your use of the site, including but not limited to
          direct, indirect, incidental, or consequential damages.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          This site relies on third-party APIs (Scryfall, EDHREC) and advertising services (Google
          AdSense). Your use of these services is subject to their respective terms and privacy
          policies. We are not responsible for the availability or content of third-party services.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes
          constitutes acceptance of the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about these terms, contact us at{' '}
          <a href="mailto:krs19@xtra.co.nz">krs19@xtra.co.nz</a>.
        </p>
      </main>
    </div>
  );
}
