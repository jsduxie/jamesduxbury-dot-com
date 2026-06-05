import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { JetBrains_Mono } from 'next/font/google';
import { StatusBar } from '@/components/console/StatusBar';
import { VisitBeacon } from '@/components/VisitBeacon';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'James Duxbury — Software Engineer in AI and Cybersecurity',
  description:
    'Final-year MEng Computer Science student at Durham. AI / NLP research, application security, full-stack engineering. Accredited Affiliate Member of the Chartered Institute of Information Security (AfCIIS).',
  authors: [{ name: 'James Duxbury' }],
  openGraph: {
    title: 'James Duxbury — Software Engineer in AI and Cybersecurity',
    description:
      'Portfolio of James Duxbury — MEng Computer Science, Durham. AI, NLP, application security, full-stack engineering.',
    url: SITE_URL,
    siteName: 'James Duxbury',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'James Duxbury — Software Engineer in AI and Cybersecurity',
    description:
      'Portfolio of James Duxbury — MEng Computer Science, Durham. AI, NLP, application security, full-stack engineering.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg bg-dot-grid bg-[length:24px_24px] font-sans text-text antialiased">
        <StatusBar />
        <VisitBeacon />
        {children}
      </body>
    </html>
  );
}
