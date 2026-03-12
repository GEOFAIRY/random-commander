import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EDH Commander Randomizer | Random MTG Commander Generator',
  description:
    'Free random EDH commander generator for Magic: The Gathering. Instantly get a random commander with color filters, EDHREC stats, deck popularity, and partner support. Find your next Commander deck idea.',
  keywords: [
    'EDH',
    'commander',
    'randomizer',
    'MTG',
    'Magic the Gathering',
    'random commander',
    'commander generator',
    'EDH deck builder',
    'random EDH commander',
    'commander picker',
  ],
  metadataBase: new URL('https://edhrandomizer.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EDH Commander Randomizer | Random MTG Commander Generator',
    description:
      'Free random EDH commander generator for Magic: The Gathering. Instantly generate a random commander with color filters and EDHREC stats.',
    url: 'https://edhrandomizer.com',
    siteName: 'EDH Commander Randomizer',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'EDH Commander Randomizer',
    description:
      'Free random EDH commander generator for Magic: The Gathering. Instantly generate a random commander with color filters and EDHREC stats.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          href="//cdn.jsdelivr.net/npm/mana-font@1.18.0/css/mana.css"
          rel="stylesheet"
          type="text/css"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1462786245330262"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-surface text-text-primary font-(family-name:--font-geist-sans)`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'EDH Commander Randomizer',
              url: 'https://edhrandomizer.com',
              description:
                'Free random EDH commander generator for Magic: The Gathering. Generate a random commander with color filters and EDHREC stats.',
              applicationCategory: 'GameApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
        <nav className="w-full max-w-250 mx-auto flex items-center justify-between px-10 py-3 max-sm:px-6">
          <Link href="/" className="text-sm font-semibold text-text-primary no-underline hover:text-text-secondary">
            EDH Randomizer
          </Link>
          <div className="flex gap-6">
            <Link href="/favorites" className="text-sm text-text-secondary no-underline hover:text-text-primary">
              Favorites
            </Link>
            <Link href="/about" className="text-sm text-text-secondary no-underline hover:text-text-primary">
              About
            </Link>
          </div>
        </nav>
        {children}
        <footer className="mt-auto w-full max-w-225 mx-auto px-4 py-2 text-center text-text-secondary text-xs flex gap-9 justify-center items-center flex-wrap">
          <div>
            <p className="m-0 leading-none">
              Made by <a href="https://github.com/GEOFAIRY">GEOFAIRY</a>
            </p>
          </div>
          <div>
            Open Source at <a href="https://github.com/GEOFAIRY/random-commander">GitHub</a>
          </div>
          <div>
            <div>
              <p className="m-0 leading-none">
                Card information and Image provided by <a href="https://scryfall.com/">Scryfall</a>
              </p>
            </div>
            <div>
              <p className="m-0 leading-none">
                Deck usage information provided by <a href="https://edhrec.com">EDHRecs</a>
              </p>
            </div>
          </div>
          <div>
            <p className="m-0 leading-none">
              Contact at <a href="mailto:krs19@xtra.co.nz">krs19@xtra.co.nz</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
