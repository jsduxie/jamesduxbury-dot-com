import '@testing-library/jest-dom/vitest';
import { neonConfig } from '@neondatabase/serverless';
import { loadEnvLocal } from '../src/db/env';

loadEnvLocal();

// jsdom looks like a browser to the driver; the warning does not apply to tests
neonConfig.disableWarningInBrowsers = true;

// jsdom lacks matchMedia, which the skeletons use for prefers-reduced-motion
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// jsdom lacks IntersectionObserver, which framer-motion's whileInView needs
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];
  };
}
