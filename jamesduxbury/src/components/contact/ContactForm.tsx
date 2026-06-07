'use client';

import { useState, type FormEvent } from 'react';
import { CONTACT_FEATURES } from '@/admin/blocks';
import { BlockEditor } from '@/components/admin/BlockEditor';

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>({ kind: 'idle' });
  // remounting the editor clears it after a successful send
  const [editorKey, setEditorKey] = useState(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.kind === 'sending') return;

    const message = String(new FormData(e.currentTarget).get('message') ?? '').trim();
    if (!message) {
      setState({ kind: 'error', message: 'Message cannot be empty.' });
      return;
    }

    setState({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setState({ kind: 'success' });
        setName('');
        setEmail('');
        setEditorKey((k) => k + 1);
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setState({
          kind: 'error',
          message: data.error ?? `Message failed to send (${res.status})`,
        });
      }
    } catch (err) {
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Message failed to send.',
      });
    }
  };

  const fieldLabel = 'font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs';
  const fieldInput =
    'mt-2 w-full border border-border bg-bg px-3 py-2.5 font-mono text-sm text-text placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-border">
      <div className="px-4 py-5 sm:px-6">
        <label htmlFor="contact-name" className={fieldLabel}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldInput}
          placeholder="Your name"
        />
      </div>

      <div className="px-4 py-5 sm:px-6">
        <label htmlFor="contact-email" className={fieldLabel}>
          Channel · Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldInput}
          placeholder="you@example.com"
        />
      </div>

      <div className="px-4 py-5 sm:px-6">
        <span className={fieldLabel}>Message</span>
        <BlockEditor key={editorKey} column="message" initial="" features={CONTACT_FEATURES} />
      </div>

      <div className="flex flex-col items-stretch gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          {state.kind === 'success' && (
            <span className="text-live">{`>`} message sent · thank you</span>
          )}
          {state.kind === 'error' && (
            <span className="text-danger">
              {`>`} error · {state.message}
            </span>
          )}
          {state.kind === 'idle' && <span>{`>`} signal will be routed to a secure inbox</span>}
          {state.kind === 'sending' && <span>{`>`} sending…</span>}
        </div>
        <button
          type="submit"
          disabled={state.kind === 'sending'}
          className="rounded-full border border-accent bg-accent/10 px-5 py-2 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.kind === 'sending' ? 'sending…' : 'send →'}
        </button>
      </div>
    </form>
  );
};
