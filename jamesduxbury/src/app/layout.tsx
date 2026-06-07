import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { JetBrains_Mono } from 'next/font/google';
import { StatusBar } from '@/components/console/StatusBar';
import { VisitBeacon } from '@/components/VisitBeacon';
import { SITE_URL } from '@/lib/site';
import { getSiteSettings } from '@/db/queries';
import { cvDownloadName, cvHref } from '@/lib/cv';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = `${s.ownerName} — ${s.tagline}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: s.metaDescription,
    authors: [{ name: s.ownerName }],
    openGraph: {
      title,
      description: s.ogDescription,
      url: SITE_URL,
      siteName: s.ownerName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: s.ogDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${GeistSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg bg-dot-grid bg-[length:24px_24px] font-sans text-text antialiased">
        <StatusBar
          ownerName={settings.ownerName}
          siteVersion={settings.siteVersion}
          cvHref={cvHref(settings)}
          cvDownload={cvDownloadName(settings)}
        />
        <VisitBeacon />
        {children}
      </body>
    </html>
  );
}
