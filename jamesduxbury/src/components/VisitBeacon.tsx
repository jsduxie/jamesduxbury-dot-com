'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function VisitBeacon() {
  const pathname = usePathname();
  // ids are bigserial strings end-to-end
  const view = useRef<{ id: string | null; start: number }>({ id: null, start: 0 });

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    let sessionId = sessionStorage.getItem('visit-session');
    // document.referrer goes stale after client-side navigation, so only the first view sends it
    const referrer = sessionId ? null : document.referrer || null;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('visit-session', sessionId);
    }

    let cancelled = false;
    view.current = { id: null, start: Date.now() };
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId, path: pathname, referrer }),
      keepalive: true,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) view.current.id = data.id;
      })
      .catch(() => {});

    const finish = () => {
      if (view.current.id === null) return;
      const body = JSON.stringify({
        id: view.current.id,
        durationMs: Date.now() - view.current.start,
      });
      navigator.sendBeacon('/api/visit', new Blob([body], { type: 'application/json' }));
      view.current.id = null;
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') finish();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', finish);
    return () => {
      finish();
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', finish);
    };
  }, [pathname]);

  return null;
}
