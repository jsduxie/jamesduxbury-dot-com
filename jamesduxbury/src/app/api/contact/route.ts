import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';

interface ContactPayload {
  name: string;
  email: string;
  message: string;
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

function parsePayload(raw: unknown): ContactPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const name = typeof r.name === 'string' ? r.name.trim() : '';
  const email = typeof r.email === 'string' ? r.email.trim() : '';
  const message = typeof r.message === 'string' ? r.message.trim() : '';

  if (!name || !email || !message) return null;
  if (name.length > 200 || email.length > 320 || message.length > 5000) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return { name, email, message };
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

  const { name, email, message } = payload;

  // Values used in HTML must be escaped. Values used in headers must have CR/LF stripped.
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const headerSafeName = sanitiseHeaderValue(name, 200);
  const headerSafeEmail = sanitiseHeaderValue(email, 320);

  const correlationId = randomUUID();

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
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${safeName} (${safeEmail})</p><p>${safeMessage}</p>`,
    });

    return Response.json({ success: true });
  } catch (error) {
    // Log full error server-side; never return transport / auth / host details to the client.
    console.error(`[contact:${correlationId}]`, error);
    return Response.json(
      {
        success: false,
        error: 'Transmission failed. Please try again later.',
        correlationId,
      },
      { status: 500 },
    );
  }
}
