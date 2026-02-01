import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "EDH Commander Randomizer",
    description: "Get a random commander",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="//cdn.jsdelivr.net/npm/mana-font@latest/css/mana.css"
                    rel="stylesheet"
                    type="text/css"
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                {children}
            </body>
        </html>
    );
}
