import '@testing-library/jest-dom/vitest';
import { loadEnvLocal } from '../src/db/env';

loadEnvLocal();

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
