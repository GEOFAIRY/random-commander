import type { Metadata } from 'next';
import styles from './about.module.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | EDH Commander Randomizer',
  description:
    'Learn how the EDH Commander Randomizer works. A free random MTG commander generator with color filters, partner support, and EDHREC stats for Magic: The Gathering.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
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

        <details open>
          <summary>What is EDH / Commander?</summary>
          <p>
            EDH (Elder Dragon Highlander), officially known as Commander, is the most popular casual
            format in Magic: The Gathering. Each player builds a 100-card singleton deck led by a
            legendary creature — the commander — whose color identity defines the deck.
          </p>
        </details>

        <details>
          <summary>How does the random commander generator work?</summary>
          <p>
            The tool queries the Scryfall API for a random card that is legal as a commander in the
            Commander format. You can optionally filter by one or more colors to narrow down the
            results to your preferred color identity.
          </p>
        </details>

        <details>
          <summary>Does it support partner commanders?</summary>
          <p>
            Yes. When a commander with the Partner keyword or a specific partner ability (like
            &quot;Choose a Background&quot; or &quot;Partner with&quot;) is rolled, the tool
            automatically fetches a compatible partner card.
          </p>
        </details>

        <details>
          <summary>Where does the deck data come from?</summary>
          <p>
            Deck popularity, rank, and archetype data are provided by{' '}
            <a href="https://edhrec.com" target="_blank" rel="noopener noreferrer">
              EDHREC
            </a>
            , the largest Commander deck database. The tool links directly to each commander&apos;s
            EDHREC page for deeper analysis.
          </p>
        </details>

        <details>
          <summary>Is this tool free to use?</summary>
          <p>
            Yes, the EDH Commander Randomizer is completely free. Card data is provided by{' '}
            <a href="https://scryfall.com" target="_blank" rel="noopener noreferrer">
              Scryfall
            </a>{' '}
            and deck statistics by EDHREC.
          </p>
        </details>

        <details>
          <summary>Can I filter by color identity?</summary>
          <p>
            Yes. Use the mana symbol buttons at the top of the randomizer to filter commanders by
            White, Blue, Black, Red, Green, or Colorless. You can select multiple colors to find
            multicolored commanders.
          </p>
        </details>
      </main>
    </div>
  );
}
