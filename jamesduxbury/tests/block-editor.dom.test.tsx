// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BlockEditor } from '../src/components/admin/BlockEditor';
import type { Features } from '../src/data/about';

const ALL: Features = {
  bold: true,
  italic: true,
  code: true,
  link: true,
  list: true,
  heading: true,
  image: true,
};

function wire(container: HTMLElement): string {
  return (container.querySelector('input[name="body"]') as HTMLInputElement).value;
}

function editor() {
  return screen.getByLabelText('block editor') as HTMLTextAreaElement;
}

describe('BlockEditor editing', () => {
  it('opens a block for editing on click', () => {
    render(<BlockEditor column="body" initial="hello world" features={ALL} />);
    fireEvent.click(screen.getByText('hello world'));
    expect(editor()).toHaveValue('hello world');
  });

  it('commits an edit on blur', () => {
    const { container } = render(<BlockEditor column="body" initial="hello" features={ALL} />);
    fireEvent.click(screen.getByText('hello'));
    fireEvent.change(editor(), { target: { value: 'hello there' } });
    fireEvent.blur(editor());
    expect(wire(container)).toBe('hello there');
  });

  it('keeps the hidden field in sync before blur (submit mid-edit)', () => {
    const { container } = render(<BlockEditor column="body" initial="hello" features={ALL} />);
    fireEvent.click(screen.getByText('hello'));
    fireEvent.change(editor(), { target: { value: 'unsaved edit' } });
    expect(wire(container)).toBe('unsaved edit');
  });

  it('splits one block into many on a blank line', () => {
    const { container } = render(<BlockEditor column="body" initial="one" features={ALL} />);
    fireEvent.click(screen.getByText('one'));
    fireEvent.change(editor(), { target: { value: 'one\n\ntwo' } });
    fireEvent.blur(editor());
    expect(wire(container)).toBe('one\n\ntwo');
    expect(screen.getByText('two')).toBeInTheDocument();
  });

  it('converts a paragraph to a heading', () => {
    const { container } = render(<BlockEditor column="body" initial="Title" features={ALL} />);
    fireEvent.click(screen.getByText('Title'));
    fireEvent.change(editor(), { target: { value: '### Title' } });
    fireEvent.blur(editor());
    expect(wire(container)).toBe('### Title');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title');
  });

  it('starts empty and adds the first block', () => {
    const { container } = render(<BlockEditor column="body" initial="" features={ALL} />);
    expect(wire(container)).toBe('');
    fireEvent.click(screen.getByText('+ start writing'));
    fireEvent.change(editor(), { target: { value: 'first words' } });
    fireEvent.blur(editor());
    expect(wire(container)).toBe('first words');
  });

  it('splits a block on a single newline', () => {
    const { container } = render(<BlockEditor column="body" initial="one" features={ALL} />);
    fireEvent.click(screen.getByText('one'));
    fireEvent.change(editor(), { target: { value: 'one\ntwo' } });
    fireEvent.blur(editor());
    expect(wire(container)).toBe('one\n\ntwo');
    expect(screen.getByText('two')).toBeInTheDocument();
  });

  it('opens the correct sibling after a split shifts indices', () => {
    render(<BlockEditor column="body" initial={'one\n\ntwo'} features={ALL} />);
    fireEvent.click(screen.getByText('one'));
    fireEvent.change(editor(), { target: { value: 'one\n\nuno' } });
    fireEvent.blur(editor());
    fireEvent.click(screen.getByText('two'));
    expect(editor()).toHaveValue('two');
  });
});

describe('BlockEditor toolbar', () => {
  it('disables the toolbar until a block is focused', () => {
    render(<BlockEditor column="body" initial="hi" features={ALL} />);
    expect(screen.getByRole('button', { name: 'bold' })).toBeDisabled();
    fireEvent.click(screen.getByText('hi'));
    expect(screen.getByRole('button', { name: 'bold' })).toBeEnabled();
  });

  it('wraps the selection in bold', () => {
    render(<BlockEditor column="body" initial="hello" features={ALL} />);
    fireEvent.click(screen.getByText('hello'));
    const area = editor();
    area.setSelectionRange(0, 5);
    fireEvent.click(screen.getByRole('button', { name: 'bold' }));
    expect(area).toHaveValue('**hello**');
  });

  it('keeps the text selected after toggling bold', async () => {
    render(<BlockEditor column="body" initial="hello" features={ALL} />);
    fireEvent.click(screen.getByText('hello'));
    const area = editor();
    area.setSelectionRange(0, 5);
    fireEvent.click(screen.getByRole('button', { name: 'bold' }));
    await waitFor(() => expect(area).toHaveValue('**hello**'));
    await waitFor(() => expect(area.selectionStart).toBe(2));
    expect(area.selectionEnd).toBe(7);
  });

  it('toggles bold off when the selection is already bold', () => {
    render(<BlockEditor column="body" initial="**hello**" features={ALL} />);
    fireEvent.click(screen.getByText('hello'));
    const area = editor();
    area.setSelectionRange(2, 7);
    fireEvent.click(screen.getByRole('button', { name: 'bold' }));
    expect(area).toHaveValue('hello');
  });

  it('unbolds the middle of a bold span and keeps the ends bold', () => {
    render(<BlockEditor column="body" initial="**hello world**" features={ALL} />);
    fireEvent.click(screen.getByText('hello world'));
    const area = editor();
    area.setSelectionRange(5, 10);
    fireEvent.click(screen.getByRole('button', { name: 'bold' }));
    expect(area).toHaveValue('**hel**lo wo**rld**');
  });

  it('normalises an overlapping bold selection into one span', () => {
    render(<BlockEditor column="body" initial="**Hello James** more text" features={ALL} />);
    fireEvent.click(screen.getByText('Hello James'));
    const area = editor();
    area.setSelectionRange(area.value.indexOf('James'), area.value.length);
    fireEvent.click(screen.getByRole('button', { name: 'bold' }));
    expect(area).toHaveValue('**Hello James more text**');
  });

  it('wraps the selection in code', () => {
    render(<BlockEditor column="body" initial="hello" features={ALL} />);
    fireEvent.click(screen.getByText('hello'));
    const area = editor();
    area.setSelectionRange(0, 5);
    fireEvent.click(screen.getByRole('button', { name: 'code' }));
    expect(area).toHaveValue('`hello`');
  });

  it('marks a wrapper button active when the selection is already wrapped', () => {
    render(<BlockEditor column="body" initial="**hi**" features={ALL} />);
    fireEvent.click(screen.getByText('hi'));
    const area = editor();
    area.setSelectionRange(2, 4);
    fireEvent.select(area);
    expect(screen.getByRole('button', { name: 'bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'italic' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('gives each toolbar button a tooltip title', () => {
    render(<BlockEditor column="body" initial="hi" features={ALL} />);
    expect(screen.getByRole('button', { name: 'bold' })).toHaveAttribute('title', 'Bold (**text**)');
    expect(screen.getByRole('button', { name: 'code' })).toHaveAttribute(
      'title',
      'Inline code (`code`)',
    );
  });

  it('wraps the selection in a link', () => {
    render(<BlockEditor column="body" initial="hello" features={ALL} />);
    fireEvent.click(screen.getByText('hello'));
    const area = editor();
    area.setSelectionRange(0, 5);
    fireEvent.click(screen.getByRole('button', { name: 'link' }));
    expect(area).toHaveValue('[hello](https://)');
  });

  it('prefixes the line for list and heading', () => {
    render(<BlockEditor column="body" initial="hello" features={ALL} />);
    fireEvent.click(screen.getByText('hello'));
    fireEvent.click(screen.getByRole('button', { name: 'list' }));
    expect(editor()).toHaveValue('- hello');
    fireEvent.click(screen.getByRole('button', { name: 'heading' }));
    expect(editor()).toHaveValue('### - hello');
  });

  it('reports an upload error and leaves the document unchanged', async () => {
    const uploadAction = vi.fn(async () => ({ error: 'too big' }));
    const { container } = render(
      <BlockEditor column="body" initial="hello" features={ALL} uploadAction={uploadAction} />,
    );
    fireEvent.click(screen.getByText('hello'));
    fireEvent.click(screen.getByRole('button', { name: 'image' }));
    const file = new File(['x'], 'x.png', { type: 'image/png' });
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText('> too big')).toBeInTheDocument());
    expect(wire(container)).toBe('hello');
  });

  it('uploads and inserts an image at the caret', async () => {
    const uploadAction = vi.fn(async () => ({ url: 'https://blob.dev/x.png' }));
    const { container } = render(
      <BlockEditor column="body" initial="hello" features={ALL} uploadAction={uploadAction} />,
    );
    fireEvent.click(screen.getByText('hello'));
    fireEvent.click(screen.getByRole('button', { name: 'image' }));
    const file = new File(['x'], 'x.png', { type: 'image/png' });
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [file] } });
    await waitFor(() => expect(wire(container)).toContain('![image](https://blob.dev/x.png)'));
    expect(uploadAction).toHaveBeenCalledOnce();
  });
});

describe('BlockEditor structure', () => {
  it('inserts a block between two existing blocks', () => {
    const { container } = render(
      <BlockEditor column="body" initial={'one\n\ntwo'} features={ALL} />,
    );
    fireEvent.click(screen.getAllByLabelText('insert block')[1]);
    fireEvent.change(editor(), { target: { value: 'mid' } });
    fireEvent.blur(editor());
    expect(wire(container)).toBe('one\n\nmid\n\ntwo');
  });

  it('reorders a block downward by dragging its handle', () => {
    const { container } = render(
      <BlockEditor column="body" initial={'one\n\ntwo\n\nthree'} features={ALL} />,
    );
    const handles = screen.getAllByLabelText('reorder block');
    fireEvent.dragStart(handles[0]);
    fireEvent.dragOver(handles[2]);
    fireEvent.drop(handles[2]);
    expect(wire(container)).toBe('two\n\none\n\nthree');
  });

  it('reorders a block to the very top', () => {
    const { container } = render(
      <BlockEditor column="body" initial={'one\n\ntwo\n\nthree'} features={ALL} />,
    );
    const handles = screen.getAllByLabelText('reorder block');
    fireEvent.dragStart(handles[2]);
    fireEvent.dragOver(handles[0]);
    fireEvent.drop(handles[0]);
    expect(wire(container)).toBe('three\n\none\n\ntwo');
  });
});

describe('BlockEditor feature gating', () => {
  const restricted: Features = { ...ALL, code: false, heading: false, image: false };

  it('hides disallowed toolbar buttons', () => {
    render(<BlockEditor column="body" initial="hi" features={restricted} />);
    expect(screen.queryByRole('button', { name: 'heading' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'image' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'code' })).toBeNull();
    expect(screen.getByRole('button', { name: 'bold' })).toBeInTheDocument();
  });

  it('downgrades disallowed markup on commit', () => {
    const { container } = render(<BlockEditor column="body" initial="hi" features={restricted} />);
    fireEvent.click(screen.getByText('hi'));
    fireEvent.change(editor(), { target: { value: '### Heading' } });
    fireEvent.blur(editor());
    expect(wire(container)).toBe('Heading');
  });
});
