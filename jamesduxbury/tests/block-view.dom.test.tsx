// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BlockView, renderBlocks } from '../src/components/about/BlockView';
import type { Block } from '../src/data/about';

describe('BlockView', () => {
  it('renders a heading and an unordered list', () => {
    const blocks: Block[] = [
      { kind: 'heading', runs: ['Section'] },
      { kind: 'list', items: [['one'], ['two']] },
    ];
    render(<>{renderBlocks(blocks)}</>);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Section');
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['one', 'two']);
  });

  it('renders an inline code run in a code element', () => {
    render(<BlockView block={{ kind: 'p', runs: ['run ', { code: 'npm test' }] }} />);
    const code = screen.getByText('npm test');
    expect(code.tagName).toBe('CODE');
  });

  it('renders an inline image with its alt text', () => {
    render(
      <BlockView block={{ kind: 'image', url: 'https://blob.dev/x.png', alt: 'a diagram' }} />,
    );
    expect(screen.getByAltText('a diagram')).toHaveAttribute('src', 'https://blob.dev/x.png');
  });
});

describe('link rendering gate', () => {
  const link = (href: string): Block => ({ kind: 'p', runs: [{ link: { text: 'docs', href } }] });

  it('renders a safe link as a new-tab anchor', () => {
    render(<BlockView block={link('https://x.dev')} />);
    const anchor = screen.getByRole('link', { name: 'docs' });
    expect(anchor).toHaveAttribute('href', 'https://x.dev');
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a javascript: link as plain text, never an anchor', () => {
    render(<BlockView block={link('javascript:alert(1)')} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('docs')).toBeInTheDocument();
  });

  it('renders links as plain text in text mode', () => {
    render(<BlockView block={link('https://x.dev')} linkMode="text" />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('docs')).toBeInTheDocument();
  });
});
