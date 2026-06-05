import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  getAvgDurations,
  getMessageCounts,
  getRecentSessions,
  getTopCountries,
  getTopPaths,
  getTopReferrers,
  getViewsPerDay,
  getVisitTotals,
} from '../src/db/analytics';

const sql = neon(process.env.DATABASE_URL!);
const sessionId = randomUUID();
const pathA = `/test-analytics-a-${Date.now()}`;
const pathB = `/test-analytics-b-${Date.now()}`;

beforeAll(async () => {
  // five views, four on pathA, one on pathB, two with durations
  const rows = [
    { path: pathA, duration: 30_000, minutesAgo: 5 },
    { path: pathB, duration: 30_000, minutesAgo: 4 },
    { path: pathA, duration: null, minutesAgo: 3 },
    { path: pathA, duration: null, minutesAgo: 2 },
    { path: pathA, duration: null, minutesAgo: 1 },
  ];
  for (const row of rows) {
    await sql`
      INSERT INTO page_views (session_id, path, referrer, country, duration_ms, created_at)
      VALUES (${sessionId}, ${row.path}, 'https://ref.example/some/page', 'ZZ',
        ${row.duration}, now() - make_interval(mins => ${row.minutesAgo}))
    `;
  }
});

afterAll(async () => {
  await sql`DELETE FROM page_views WHERE session_id = ${sessionId}`;
});

describe('analytics queries', () => {
  it('counts totals across windows', async () => {
    const totals = await getVisitTotals();
    expect(totals.last7Days).toBeGreaterThanOrEqual(5);
    expect(totals.last30Days).toBeGreaterThanOrEqual(totals.last7Days);
    expect(totals.allTime).toBeGreaterThanOrEqual(totals.last30Days);
  });

  it('fills every day of the chart window, including zero days', async () => {
    const days = await getViewsPerDay(30);
    expect(days).toHaveLength(30);
    for (const day of days) {
      expect(day.day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(day.views).toBeGreaterThanOrEqual(0);
    }
    expect(days[days.length - 1].views).toBeGreaterThanOrEqual(5);
  });

  it('ranks pages by views', async () => {
    const top = await getTopPaths(30);
    const ours = top.find((row) => row.path === pathA);
    expect(ours?.views).toBe(4);
  });

  it('groups referrers by host', async () => {
    const top = await getTopReferrers(30);
    const ours = top.find((row) => row.source === 'ref.example');
    expect(ours?.views).toBeGreaterThanOrEqual(5);
  });

  it('ranks countries', async () => {
    const top = await getTopCountries(30);
    const ours = top.find((row) => row.country === 'ZZ');
    expect(ours?.views).toBeGreaterThanOrEqual(5);
  });

  it('averages duration per path over recorded views only', async () => {
    const durations = await getAvgDurations(30);
    const ours = durations.find((row) => row.path === pathA);
    expect(ours).toEqual({ path: pathA, avgMs: 30_000, samples: 1 });
  });

  it('returns the session with its path sequence', async () => {
    const sessions = await getRecentSessions(50);
    const ours = sessions.find((s) => s.sessionId === sessionId);
    expect(ours?.paths).toEqual([pathA, pathB, pathA, pathA, pathA]);
    expect(ours?.country).toBe('ZZ');
    expect(ours?.totalMs).toBe(60_000);
    expect(ours?.startedAt).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });

  it('counts messages without negative or impossible values', async () => {
    const counts = await getMessageCounts();
    expect(counts.total).toBeGreaterThanOrEqual(0);
    expect(counts.unread).toBeGreaterThanOrEqual(0);
    expect(counts.unread).toBeLessThanOrEqual(counts.total);
  });
});
