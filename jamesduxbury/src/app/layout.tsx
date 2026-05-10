import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { JetBrains_Mono } from 'next/font/google';
import { StatusBar } from '@/components/console/StatusBar';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'James Duxbury — Software Engineer in AI and Cybersecurity',
  description:
    'Final-year MEng Computer Science student at Durham. AI / NLP research, application security, full-stack engineering. Accredited Affiliate Member of the Chartered Institute of Information Security (AfCIIS).',
  authors: [{ name: 'James Duxbury' }],
  openGraph: {
    title: 'James Duxbury — Software Engineer in AI and Cybersecurity',
    description:
      'Portfolio of James Duxbury — MEng Computer Science, Durham. AI, NLP, application security, full-stack engineering.',
    type: 'website',
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
        {children}
      </body>
    </html>
  );
}
