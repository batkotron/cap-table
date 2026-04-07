import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cap Table - Free, Open-Source Cap Table Tool for Founders',
  description:
    'Free cap table tool for early-stage founders. Track founders, options, SAFEs, and priced rounds. No signup, no fees, open-source.',
  authors: [{ name: 'Michael Batko', url: 'https://batko.ai' }],
  openGraph: {
    title: 'Cap Table',
    description:
      'Free cap table tool for early-stage founders. Track ownership across rounds. Open-source.',
    url: 'https://batkotron.github.io/cap-table',
    siteName: 'Cap Table',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
