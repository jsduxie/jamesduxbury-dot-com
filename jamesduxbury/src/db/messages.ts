import { getSql } from '@/db';
import type { Block } from '@/data/about';

export interface Message {
  id: number;
  name: string;
  email: string;
  message: Block[];
  read: boolean;
  receivedAt: string;
}

interface MessageRow {
  id: number;
  name: string;
  email: string;
  message: Block[];
  read: boolean;
  received_at: string;
}

export async function getMessages(): Promise<Message[]> {
  const rows = (await getSql()`
    SELECT id, name, email, message, read,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') AS received_at
    FROM messages ORDER BY created_at DESC
  `) as MessageRow[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    message: r.message,
    read: r.read,
    receivedAt: r.received_at,
  }));
}

export async function insertMessage(name: string, email: string, message: Block[]): Promise<void> {
  await getSql()`
    INSERT INTO messages (name, email, message)
    VALUES (${name}, ${email}, ${JSON.stringify(message)})
  `;
}

export async function markRead(id: number): Promise<void> {
  await getSql()`UPDATE messages SET read = true WHERE id = ${id}`;
}
