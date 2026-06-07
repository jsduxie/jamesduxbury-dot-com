'use client';

import { useActionState } from 'react';
import { runMaintenance } from '@/admin/actions';

const button =
  'border border-accent/60 bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:border-accent hover:bg-accent hover:text-text disabled:opacity-50';

export function MaintenancePanel() {
  const [report, action, pending] = useActionState(runMaintenance, null);

  return (
    <form action={action} className="space-y-4">
      <p className="font-mono text-sm text-muted">
        checks every stored image and document, clears references whose file has vanished, and
        deletes blobs no row points at
      </p>
      <button type="submit" disabled={pending} className={button}>
        {pending ? 'running…' : 'run maintenance'}
      </button>

      {report && (
        <div className="space-y-1 border border-border bg-bg/40 px-4 py-3 font-mono text-xs text-text/85">
          <p>{report.healed.length} reference(s) cleared</p>
          <p>{report.purged} unreferenced blob(s) deleted</p>
          {report.dangling.length > 0 && (
            <div className="text-danger">
              <p>{report.dangling.length} dangling reference(s) need a re-upload:</p>
              {report.dangling.map((d) => (
                <p key={`${d.table}.${d.column}.${d.url}`}>
                  {`>`} {d.table}.{d.column}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
