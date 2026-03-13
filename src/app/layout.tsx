import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
        {children}
      </body>
    </html>
  );
}
