import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import { CONTACT_FEATURES, parseBlocks } from '@/admin/blocks';
import { insertMessage } from '@/db/messages';
import { runText, type AboutRun, type Block } from '@/data/about';
import { SAFE_HREF } from '@/lib/href';

interface ContactPayload {
  name: string;
  email: string;
  blocks: Block[];
}

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ESCAPE[c] ?? c);
}

/** Strip CR/LF and clamp length to mitigate header injection. */
function sanitiseHeaderValue(value: string, maxLength: number): string {
  return value
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function runsSafe(runs: AboutRun[]): boolean {
  return runs.every(
    (run) => typeof run === 'string' || !('link' in run) || SAFE_HREF.test(run.link.href),
  );
}

// the editor only offers paragraphs, lists and safe links; reject anything else outright
function blocksSafe(blocks: Block[]): boolean {
  return blocks.every((b) => {
    if (b.kind === 'p') return runsSafe(b.runs);
    if (b.kind === 'list') return b.items.every(runsSafe);
    return false;
  });
}

// links render as escaped text, never anchors, so a received message can never be a live link
function runsToHtml(runs: AboutRun[]): string {
  return runs
    .map((run) => {
      if (typeof run === 'string') return escapeHtml(run);
      if ('strong' in run) return `<strong>${escapeHtml(run.strong)}</strong>`;
      if ('em' in run) return `<em>${escapeHtml(run.em)}</em>`;
      if ('code' in run) return `<code>${escapeHtml(run.code)}</code>`;
      return escapeHtml(run.link.text || run.link.href);
    })
    .join('');
}

function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((b) => {
      if (b.kind === 'list')
        return `<ul>${b.items.map((i) => `<li>${runsToHtml(i)}</li>`).join('')}</ul>`;
      if (b.kind === 'image') return '';
      return `<p>${runsToHtml(b.runs)}</p>`;
    })
    .join('');
}

function blocksToText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      if (b.kind === 'list') return b.items.map((i) => `- ${runText(i)}`).join('\n');
      if (b.kind === 'image') return '';
      return runText(b.runs);
    })
    .join('\n\n')
    .trim();
}

function parsePayload(raw: unknown): ContactPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const name = typeof r.name === 'string' ? r.name.trim() : '';
  const email = typeof r.email === 'string' ? r.email.trim() : '';
  const message = typeof r.message === 'string' ? r.message : '';

  if (!name || !email || !message.trim()) return null;
  if (name.length > 200 || email.length > 320 || message.length > 5000) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const blocks = parseBlocks(message, CONTACT_FEATURES);
  if (!blocks.length || !blocksSafe(blocks)) return null;

  return { name, email, blocks };
}

export async function POST(req: Request) {
  let payload: ContactPayload | null = null;
  try {
    const body = (await req.json()) as unknown;
    payload = parsePayload(body);
  } catch {
    payload = null;
  }

  if (!payload) {
    return Response.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const { name, email, blocks } = payload;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const headerSafeName = sanitiseHeaderValue(name, 200);
  const headerSafeEmail = sanitiseHeaderValue(email, 320);

  const correlationId = randomUUID();

  // Two delivery channels; the request only fails if both do
  let stored = false;
  try {
    await insertMessage(name, email, blocks);
    stored = true;
  } catch (error) {
    console.error(`[contact:${correlationId}] message insert failed`, error);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${headerSafeName}" <${process.env.EMAIL_USER}>`,
      replyTo: headerSafeEmail,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      text: `From: ${name} <${email}>\n\n${blocksToText(blocks)}`,
      html: `<p><strong>From:</strong> ${safeName} (${safeEmail})</p>${blocksToHtml(blocks)}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    // Log full error server-side; never return transport / auth / host details to the client.
    console.error(`[contact:${correlationId}]`, error);
    if (stored) {
      // Persisted for the admin inbox, so the submission is not lost
      return Response.json({ success: true });
    }
    return Response.json(
      {
        success: false,
        error: 'Message failed to send. Please try again later.',
        correlationId,
      },
      { status: 500 },
    );
  }
}
