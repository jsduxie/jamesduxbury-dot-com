// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisitFlow } from '../src/components/admin/VisitFlow';

const transitions = [
  { from: '/', to: '/work', count: 6 },
  { from: '/', to: '/about', count: 2 },
  { from: '/work', to: '/contact', count: 1 },
];

describe('VisitFlow', () => {
  it('renders a ribbon per transition with proportional widths', () => {
    const { container } = render(<VisitFlow transitions={transitions} />);
    const ribbons = container.querySelectorAll('path');
    expect(ribbons).toHaveLength(3);
    const widths = [...ribbons].map((p) => Number(p.getAttribute('stroke-width')));
    expect(widths[0]).toBeGreaterThan(widths[1]);
    expect(widths[1]).toBeGreaterThan(widths[2]);
    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-label',
      'visit flow between pages',
    );
  });

  it('labels every source and target page', () => {
    const { container } = render(<VisitFlow transitions={transitions} />);
    const labels = [...container.querySelectorAll('text')].map((t) => t.textContent);
    expect(labels).toContain('/');
    expect(labels).toContain('/work');
    expect(labels).toContain('/about');
    expect(labels).toContain('/contact');
  });

  it('renders an empty state without transitions', () => {
    render(<VisitFlow transitions={[]} />);
    expect(screen.getByText(/no multi-page sessions yet/)).toBeInTheDocument();
  });
});
