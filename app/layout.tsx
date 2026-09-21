import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Travel Zine Generator',
  description: 'Printable A5 city-trip booklet: four themes, English and Ukrainian.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Oswald + PT Serif, bundled offline (SIL OFL). */}
        <link rel="stylesheet" href="/fonts/fonts.css" />
        {/* Japanese echo (東京) falls back to a system font offline. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
