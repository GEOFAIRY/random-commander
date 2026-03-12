import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | EDH Commander Randomizer',
  description:
    'Learn how the EDH Commander Randomizer works. A free random MTG commander generator with color filters, partner support, and EDHREC stats for Magic: The Gathering.',
};

const detailsClasses = 'mb-2 border border-edhrec-border rounded-lg px-4 py-3 open:pb-1';
const summaryClasses = 'font-medium cursor-pointer text-[15px]';
const detailPClasses = '!mt-2 !mb-1 !text-sm !leading-snug';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen items-center bg-surface text-text-primary">
      <main className="w-full max-w-180 mx-auto py-20 px-10 bg-surface-card max-sm:py-12 max-sm:px-6 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-10 [&_h1]:tracking-tight [&_h1]:mb-4 max-sm:[&_h1]:text-2xl max-sm:[&_h1]:leading-snug [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-text-secondary [&_p]:mb-4 [&_a]:text-text-primary [&_a]:font-medium">
        <Link href="/" className="inline-block mb-6 text-text-secondary no-underline text-sm hover:text-text-primary">
          &larr; Back to Randomizer
        </Link>

        <h1>About EDH Commander Randomizer</h1>
        <p>
          EDH Commander Randomizer is a free tool for Magic: The Gathering players looking to
          discover their next Commander deck. Whether you&apos;re stuck in a deckbuilding rut or
          want a fresh challenge, hit randomize to get a random legendary creature ready to lead your
          next EDH deck. Filter by color identity, see EDHREC popularity stats, and explore partner
          pairings — all in one place.
        </p>

        <h2>How It Works</h2>
        <p>
          Click the randomize button to fetch a random commander from the full pool of
          tournament-legal commanders via the Scryfall database. Use the color filter buttons to
          narrow results to specific color identities. The tool automatically detects partner
          commanders and fetches a matching partner card. EDHREC deck stats are displayed alongside
          each commander so you can see how popular they are and what archetypes they support.
        </p>

        <h2>Frequently Asked Questions</h2>

        <details className={detailsClasses} open>
          <summary className={summaryClasses}>What is EDH / Commander?</summary>
          <p className={detailPClasses}>
            EDH (Elder Dragon Highlander), officially known as Commander, is the most popular casual
            format in Magic: The Gathering. Each player builds a 100-card singleton deck led by a
            legendary creature — the commander — whose color identity defines the deck.
          </p>
        </details>

        <details className={detailsClasses}>
          <summary className={summaryClasses}>How does the random commander generator work?</summary>
          <p className={detailPClasses}>
            The tool queries the Scryfall API for a random card that is legal as a commander in the
            Commander format. You can optionally filter by one or more colors to narrow down the
            results to your preferred color identity.
          </p>
        </details>

        <details className={detailsClasses}>
          <summary className={summaryClasses}>Does it support partner commanders?</summary>
          <p className={detailPClasses}>
            Yes. When a commander with the Partner keyword or a specific partner ability (like
            &quot;Choose a Background&quot; or &quot;Partner with&quot;) is rolled, the tool
            automatically fetches a compatible partner card.
          </p>
        </details>

        <details className={detailsClasses}>
          <summary className={summaryClasses}>Where does the deck data come from?</summary>
          <p className={detailPClasses}>
            Deck popularity, rank, and archetype data are provided by{' '}
            <a href="https://edhrec.com" target="_blank" rel="noopener noreferrer">
              EDHREC
            </a>
            , the largest Commander deck database. The tool links directly to each commander&apos;s
            EDHREC page for deeper analysis.
          </p>
        </details>

        <details className={detailsClasses}>
          <summary className={summaryClasses}>Is this tool free to use?</summary>
          <p className={detailPClasses}>
            Yes, the EDH Commander Randomizer is completely free. Card data is provided by{' '}
            <a href="https://scryfall.com" target="_blank" rel="noopener noreferrer">
              Scryfall
            </a>{' '}
            and deck statistics by EDHREC.
          </p>
        </details>

        <details className={detailsClasses}>
          <summary className={summaryClasses}>Can I filter by color identity?</summary>
          <p className={detailPClasses}>
            Yes. Use the mana symbol buttons at the top of the randomizer to filter commanders by
            White, Blue, Black, Red, Green, or Colorless. You can select multiple colors to find
            multicolored commanders.
          </p>
        </details>
      </main>
    </div>
  );
}
