// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArchitectureDetail } from '../src/components/architecture/ArchitectureDetail';
import { architectureSections } from '../src/data/architecture';
import type { AboutParagraph } from '../src/data/about';

const plain = (p: AboutParagraph) =>
  p.map((run) => (typeof run === 'string' ? run : 'strong' in run ? run.strong : run.em)).join('');

const byKind = (kind: string) => architectureSections.filter((s) => s.kind === kind);

describe('ArchitectureDetail renders seeded DB content', () => {
  it('renders every decision card with its title', async () => {
    render(await ArchitectureDetail());
    for (const d of byKind('decision')) {
      expect(screen.getByText(d.title!)).toBeInTheDocument();
      expect(screen.getByText(plain(d.body[0]))).toBeInTheDocument();
    }
  });

  it('renders the intro, stack and build sections', async () => {
    render(await ArchitectureDetail());
    for (const kind of ['intro', 'stack', 'build']) {
      for (const s of byKind(kind)) {
        expect(screen.getByText(plain(s.body[0]))).toBeInTheDocument();
      }
    }
  });

  it('renders the headed page sections', async () => {
    render(await ArchitectureDetail());
    for (const heading of ['system', 'design decisions', 'how it was built']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
  });
});
