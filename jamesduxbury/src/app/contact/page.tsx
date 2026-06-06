import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { Widget } from '@/components/console/Widget';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactChannels } from '@/components/contact/ContactChannels';

export const metadata: Metadata = {
  title: 'Contact · James Duxbury',
  description:
    'Get in touch with James Duxbury — software engineer in AI and application security.',
};

export default function ContactPage() {
  return (
    <PageShell widthClass="max-w-4xl">
      <Widget channel="06" label="CONTACT" id="contact">
        <div className="px-4 py-5 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {`>`} open channels
          </p>
        </div>
        <ContactChannels />
        <div className="px-4 py-5 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {`>`} or send a message directly
          </p>
        </div>
        <ContactForm />
      </Widget>
    </PageShell>
  );
}
