import {
  getAvgDurations,
  getFlowPages,
  getPageTransitions,
  getRecentSessions,
  getTopCountries,
  getTopPaths,
  getTopReferrers,
  getViewsPerDay,
  getVisitTotals,
} from '@/db/analytics';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { VisitFlow } from '@/components/admin/VisitFlow';

function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function CountList({ rows }: { rows: { label: string; views: number }[] }) {
  const max = Math.max(...rows.map((row) => row.views), 1);
  return (
    <div className="divide-y divide-border">
      {rows.map((row) => (
        <div key={row.label} className="relative px-4 py-3 sm:px-6">
          <div
            className="absolute inset-y-0 left-0 bg-accent/10"
            style={{ width: `${(row.views / max) * 100}%` }}
          />
          <div className="relative flex items-baseline justify-between gap-4">
            <span className="truncate font-mono text-sm text-text">{row.label}</span>
            <span className="font-mono text-xs text-muted">{row.views}</span>
          </div>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="px-4 py-4 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:px-6">
          {`>`} no data yet
        </p>
      )}
    </div>
  );
}

export default async function AnalyticsPage() {
  const [totals, perDay, topPaths, referrers, countries, durations, sessions, transitions, flow] =
    await Promise.all([
      getVisitTotals(),
      getViewsPerDay(30),
      getTopPaths(30),
      getTopReferrers(30),
      getTopCountries(30),
      getAvgDurations(30),
      getRecentSessions(12),
      getPageTransitions(30),
      getFlowPages(30),
    ]);

  const maxDay = Math.max(...perDay.map((d) => d.views), 1);
  const totalCards = [
    { label: 'all-time', value: totals.allTime },
    { label: 'last 30 days', value: totals.last30Days },
    { label: 'last 7 days', value: totals.last7Days },
  ];

  return (
    <>
      <AdminPanel title="page views">
        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {totalCards.map((card) => (
            <div key={card.label} className="px-4 py-5 sm:px-6">
              <p className="font-mono text-2xl text-text">{card.value}</p>
              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminPanel title="views per day" meta="last 30 days">
        <div className="flex h-32 items-end gap-px px-4 py-4 sm:px-6">
          {perDay.map((day) => (
            <div
              key={day.day}
              title={`${day.day} · ${day.views} views`}
              className="flex-1 bg-accent/60 transition-colors hover:bg-accent"
              style={{ height: `${Math.max((day.views / maxDay) * 100, day.views > 0 ? 4 : 1)}%` }}
            />
          ))}
        </div>
      </AdminPanel>

      <AdminPanel title="visit flow" meta="last 30 days">
        <div className="px-4 py-5 sm:px-6">
          <VisitFlow transitions={transitions} />
        </div>
      </AdminPanel>

      <AdminPanel title="entries, exits and drop-off" meta="last 30 days">
        <div className="divide-y divide-border">
          {flow.map((page) => (
            <div
              key={page.path}
              className="flex items-baseline justify-between gap-4 px-4 py-3 sm:px-6"
            >
              <span className="truncate font-mono text-sm text-text">{page.path}</span>
              <span className="whitespace-nowrap font-mono text-xs text-muted">
                {page.views} views · {page.entries} in · {page.exits} out ·{' '}
                {Math.round(page.dropOff * 100)}% drop-off
              </span>
            </div>
          ))}
          {flow.length === 0 && (
            <p className="px-4 py-4 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:px-6">
              {`>`} no data yet
            </p>
          )}
        </div>
      </AdminPanel>

      <div className="grid gap-x-6 lg:grid-cols-2">
        <AdminPanel title="top pages" meta="last 30 days">
          <CountList rows={topPaths.map((r) => ({ label: r.path, views: r.views }))} />
        </AdminPanel>
        <AdminPanel title="top referrers" meta="last 30 days">
          <CountList rows={referrers.map((r) => ({ label: r.source, views: r.views }))} />
        </AdminPanel>
        <AdminPanel title="top countries" meta="last 30 days">
          <CountList rows={countries.map((r) => ({ label: r.country, views: r.views }))} />
        </AdminPanel>
        <AdminPanel title="avg time on page" meta="last 30 days">
          <div className="divide-y divide-border">
            {durations.map((row) => (
              <div
                key={row.path}
                className="flex items-baseline justify-between gap-4 px-4 py-3 sm:px-6"
              >
                <span className="truncate font-mono text-sm text-text">{row.path}</span>
                <span className="whitespace-nowrap font-mono text-xs text-muted">
                  {formatDuration(row.avgMs)} · {row.samples}{' '}
                  {row.samples === 1 ? 'sample' : 'samples'}
                </span>
              </div>
            ))}
            {durations.length === 0 && (
              <p className="px-4 py-4 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:px-6">
                {`>`} no data yet
              </p>
            )}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="recent sessions">
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <div key={session.sessionId} className="px-4 py-4 sm:px-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-xs text-muted">{session.startedAt}</span>
                {session.country && (
                  <span className="font-mono text-xs text-muted">{session.country}</span>
                )}
                {session.totalMs !== null && (
                  <span className="font-mono text-xs text-muted">
                    {formatDuration(session.totalMs)}
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-sm text-text/90">{session.paths.join(' → ')}</p>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="px-4 py-4 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:px-6">
              {`>`} no sessions yet
            </p>
          )}
        </div>
      </AdminPanel>
    </>
  );
}
