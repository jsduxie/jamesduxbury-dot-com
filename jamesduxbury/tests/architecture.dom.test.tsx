// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArchitectureDetail } from '../src/components/architecture/ArchitectureDetail';
import { ArchDiagram } from '../src/components/architecture/ArchDiagram';
import { architectureSections } from '../src/data/architecture';
import { runText as plain } from '../src/data/about';

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

describe('ArchDiagram', () => {
  it('renders lanes, nodes and edges', () => {
    const { container } = render(<ArchDiagram />);
    for (const label of ['visitor browser', 'next.js on vercel', 'neon postgres', 'external']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    for (const node of ['public pages', '/api/visit', 'server actions', 'content tables']) {
      expect(screen.getByText(node)).toBeInTheDocument();
    }
    expect(container.querySelectorAll('path[marker-end]').length).toBeGreaterThan(0);
  });

  it('describes a hovered node and dims unconnected ones', () => {
    render(<ArchDiagram />);
    expect(screen.getByText(/hover a component/)).toBeInTheDocument();
    const visit = screen.getByText('/api/visit').closest('g')!;
    fireEvent.mouseEnter(visit);
    expect(screen.getByText(/^> \/api\/visit: records anonymous views/)).toBeInTheDocument();
    expect(screen.getByText('content tables').closest('g')!.getAttribute('class')).toContain(
      'opacity-25',
    );
    fireEvent.mouseLeave(visit);
    expect(screen.getByText(/hover a component/)).toBeInTheDocument();
  });
});
