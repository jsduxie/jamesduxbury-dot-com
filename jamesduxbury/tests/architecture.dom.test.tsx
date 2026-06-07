// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArchitectureDetail } from '../src/components/architecture/ArchitectureDetail';

describe('ArchitectureDetail', () => {
  it('renders the system diagram lanes', () => {
    render(<ArchitectureDetail />);
    expect(screen.getByText('visitor browser')).toBeInTheDocument();
    expect(screen.getByText('next.js on vercel')).toBeInTheDocument();
    expect(screen.getByText('neon postgres')).toBeInTheDocument();
    expect(screen.getByText('ci and deployment')).toBeInTheDocument();
  });

  it('renders every design decision', () => {
    render(<ArchitectureDetail />);
    for (const title of [
      'no ORM',
      'a single-user allowlist instead of roles',
      'insert-if-missing seed',
      'ISR with revalidation on save',
      'first-party analytics',
      'images in Vercel Blob',
      'no chart library',
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('explains the build approach', () => {
    render(<ArchitectureDetail />);
    expect(screen.getByText(/enforced coverage thresholds/)).toBeInTheDocument();
  });
});
