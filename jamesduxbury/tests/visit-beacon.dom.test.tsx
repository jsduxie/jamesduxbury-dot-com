// @vitest-environment jsdom
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let pathname = '/work';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

import { VisitBeacon } from '../src/components/VisitBeacon';

const fetchMock = vi.fn();
const sendBeacon = vi.fn();

beforeEach(() => {
  pathname = '/work';
  sessionStorage.clear();
  fetchMock.mockReset().mockResolvedValue({ ok: true, json: async () => ({ id: '7' }) });
  sendBeacon.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  Object.defineProperty(navigator, 'sendBeacon', { value: sendBeacon, configurable: true });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('VisitBeacon', () => {
  it('posts the view with a per-tab session id and external referrer', async () => {
    render(<VisitBeacon />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.path).toBe('/work');
    expect(body.sessionId).toBe(sessionStorage.getItem('visit-session'));
    expect(body.sessionId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('reuses the session id and omits the referrer on subsequent views', async () => {
    sessionStorage.setItem('visit-session', '11111111-2222-3333-4444-555555555555');
    render(<VisitBeacon />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.sessionId).toBe('11111111-2222-3333-4444-555555555555');
    expect(body.referrer).toBeNull();
  });

  it('sends a duration beacon when the page is hidden, once only', async () => {
    render(<VisitBeacon />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    document.dispatchEvent(new Event('visibilitychange'));

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(await (sendBeacon.mock.calls[0][1] as Blob).text());
    expect(sent.id).toBe('7');
    expect(sent.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('does not track admin pages', async () => {
    pathname = '/admin/projects';
    render(<VisitBeacon />);
    await new Promise((r) => setTimeout(r, 20));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
