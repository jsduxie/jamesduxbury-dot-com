import { markMessageRead } from '@/admin/actions';
import { getSql } from '@/db';
import { AdminPanel } from '@/components/admin/AdminPanel';

interface MessageRow {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  received_at: string;
}

export default async function MessagesPage() {
  const rows = (await getSql()`
    SELECT id, name, email, message, read,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') AS received_at
    FROM messages ORDER BY created_at DESC
  `) as MessageRow[];

  const unread = rows.filter((row) => !row.read).length;

  return (
    <AdminPanel title="messages" meta={`${unread} unread · ${rows.length} total`}>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.id} className={`px-4 py-5 sm:px-6 ${row.read ? 'opacity-60' : ''}`}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-mono text-sm text-text">{row.name}</span>
              <a
                href={`mailto:${row.email}`}
                className="font-mono text-xs text-muted transition-colors hover:text-accent"
              >
                {row.email}
              </a>
              <span className="ml-auto font-mono text-[0.65rem] text-muted/70">
                {row.received_at}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap font-mono text-sm text-text/90">{row.message}</p>
            {!row.read && (
              <form action={markMessageRead.bind(null, row.id)} className="mt-3">
                <button
                  type="submit"
                  className="font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-text"
                >
                  mark as read
                </button>
              </form>
            )}
          </div>
        ))}
        {rows.length === 0 && (
          <p className="px-4 py-5 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:px-6">
            {`>`} inbox empty
          </p>
        )}
      </div>
    </AdminPanel>
  );
}
