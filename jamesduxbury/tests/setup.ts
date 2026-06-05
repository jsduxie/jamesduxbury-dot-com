import '@testing-library/jest-dom/vitest';
import { neonConfig } from '@neondatabase/serverless';
import { loadEnvLocal } from '../src/db/env';

loadEnvLocal();

// jsdom looks like a browser to the driver; the warning does not apply to tests
neonConfig.disableWarningInBrowsers = true;

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
