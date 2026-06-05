import { getSql } from '@/db';

export interface VisitTotals {
  allTime: number;
  last7Days: number;
  last30Days: number;
}

export interface DayCount {
  day: string;
  views: number;
}

export interface PathCount {
  path: string;
  views: number;
}

export interface SourceCount {
  source: string;
  views: number;
}

export interface CountryCount {
  country: string;
  views: number;
}

export interface PathDuration {
  path: string;
  avgMs: number;
  samples: number;
}

export interface RecentSession {
  sessionId: string;
  startedAt: string;
  country: string | null;
  paths: string[];
  totalMs: number | null;
}

interface TotalsRow {
  all_time: number;
  last_7: number;
  last_30: number;
}

export async function getVisitTotals(): Promise<VisitTotals> {
  const rows = (await getSql()`
    SELECT
      count(*)::int AS all_time,
      count(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS last_7,
      count(*) FILTER (WHERE created_at > now() - interval '30 days')::int AS last_30
    FROM page_views
  `) as TotalsRow[];
  const row = rows[0];
  return { allTime: row.all_time, last7Days: row.last_7, last30Days: row.last_30 };
}

export async function getViewsPerDay(days: number): Promise<DayCount[]> {
  const rows = (await getSql()`
    SELECT to_char(d, 'YYYY-MM-DD') AS day, count(pv.id)::int AS views
    FROM generate_series(now()::date - (${days}::int - 1), now()::date, interval '1 day') AS d
    LEFT JOIN page_views pv ON pv.created_at::date = d::date
    GROUP BY d ORDER BY d
  `) as DayCount[];
  return rows;
}

export async function getTopPaths(days: number): Promise<PathCount[]> {
  const rows = (await getSql()`
    SELECT path, count(*)::int AS views
    FROM page_views
    WHERE created_at > now() - make_interval(days => ${days})
    GROUP BY path ORDER BY views DESC, path LIMIT 10
  `) as PathCount[];
  return rows;
}

export async function getTopReferrers(days: number): Promise<SourceCount[]> {
  // groups referrers by host
  const rows = (await getSql()`
    SELECT coalesce(substring(referrer FROM '^[a-z][a-z0-9+.-]*://([^/]+)'), referrer) AS source,
      count(*)::int AS views
    FROM page_views
    WHERE referrer IS NOT NULL AND created_at > now() - make_interval(days => ${days})
    GROUP BY source ORDER BY views DESC, source LIMIT 10
  `) as SourceCount[];
  return rows;
}

export async function getTopCountries(days: number): Promise<CountryCount[]> {
  const rows = (await getSql()`
    SELECT country, count(*)::int AS views
    FROM page_views
    WHERE country IS NOT NULL AND created_at > now() - make_interval(days => ${days})
    GROUP BY country ORDER BY views DESC, country LIMIT 10
  `) as CountryCount[];
  return rows;
}

export async function getAvgDurations(days: number): Promise<PathDuration[]> {
  const rows = (await getSql()`
    SELECT path, avg(duration_ms)::int AS avg_ms, count(duration_ms)::int AS samples
    FROM page_views
    WHERE duration_ms IS NOT NULL AND created_at > now() - make_interval(days => ${days})
    GROUP BY path ORDER BY avg_ms DESC LIMIT 10
  `) as { path: string; avg_ms: number; samples: number }[];
  return rows.map((r) => ({ path: r.path, avgMs: r.avg_ms, samples: r.samples }));
}

export async function getRecentSessions(limit: number): Promise<RecentSession[]> {
  const rows = (await getSql()`
    SELECT session_id,
      to_char(min(created_at), 'YYYY-MM-DD HH24:MI') AS started_at,
      max(country) AS country,
      array_agg(path ORDER BY created_at, id) AS paths,
      sum(duration_ms)::int AS total_ms
    FROM page_views
    GROUP BY session_id
    ORDER BY min(created_at) DESC
    LIMIT ${limit}
  `) as {
    session_id: string;
    started_at: string;
    country: string | null;
    paths: string[];
    total_ms: number | null;
  }[];
  return rows.map((r) => ({
    sessionId: r.session_id,
    startedAt: r.started_at,
    country: r.country,
    paths: r.paths,
    totalMs: r.total_ms,
  }));
}

export interface MessageCounts {
  total: number;
  unread: number;
}

export async function getMessageCounts(): Promise<MessageCounts> {
  const rows = (await getSql()`
    SELECT count(*)::int AS total, count(*) FILTER (WHERE NOT read)::int AS unread FROM messages
  `) as { total: number; unread: number }[];
  return rows[0];
}
