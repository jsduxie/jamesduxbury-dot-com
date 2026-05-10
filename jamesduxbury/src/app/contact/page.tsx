import type { Metadata } from 'next';
import Link from 'next/link';
import { Widget } from '@/components/console/Widget';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactChannels } from '@/components/contact/ContactChannels';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact · James Duxbury',
  description:
    'Get in touch with James Duxbury — software engineer in AI and application security.',
};

export default function ContactPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← / home
        </Link>

        <Widget channel="06" label="TRANSMIT" id="contact">
          <div className="px-4 py-5 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {`>`} open channels
            </p>
          </div>
          <ContactChannels />
          <div className="px-4 py-5 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {`>`} or transmit a message directly
            </p>
          </div>
          <ContactForm />
        </Widget>
      </main>
      <Footer />
    </>
  );
}
