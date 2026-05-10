import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
