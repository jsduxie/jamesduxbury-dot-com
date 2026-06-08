'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { ALL_FEATURES, parseBlocks, serialiseBlock, serialiseBlocks } from '@/admin/blocks';
import { selectionWrapped, toggleWrap } from '@/admin/markup';
import { uploadProseImage } from '@/admin/actions';
import { BlockView } from '@/components/about/BlockView';
import type { Block, Feature, Features } from '@/data/about';
import { BlockIcon } from './blockIcons';

type UploadAction = (formData: FormData) => Promise<{ url?: string; error?: string }>;

interface BlockEditorProps {
  column: string;
  initial: string;
  features?: Features;
  uploadAction?: UploadAction;
}

// flat 1px accent border on focus, no ring glow, to match the site's terminal styling
const fieldInput =
  'w-full border border-border bg-bg px-3 py-2.5 font-mono text-sm text-text placeholder:text-muted/60 transition-colors selection:bg-accent/30 selection:text-text focus:border-accent focus:outline-none';
// idle and active colours are mutually exclusive so the active state is not lost to a class clash;
// the active state mirrors the site's accent idiom (status chips, the status-bar CTA)
const toolButton =
  'flex h-8 w-8 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-40';
const toolButtonIdle = 'border-border text-muted hover:border-accent hover:text-accent';
const toolButtonActive = 'border-accent/60 bg-accent/10 text-accent';

// inline markers wrap a selection; block markers prefix the caret's line
const WRAPS: Partial<Record<Feature, string>> = { bold: '**', italic: '*', code: '`' };
const PREFIXES: Partial<Record<Feature, string>> = { heading: '### ', list: '- ' };
const TOOLBAR: Feature[] = ['bold', 'italic', 'code', 'link', 'list', 'heading', 'image'];
const TITLES: Record<Feature, string> = {
  bold: 'Bold (**text**)',
  italic: 'Italic (*text*)',
  code: 'Inline code (`code`)',
  link: 'Link ([text](url))',
  list: 'List item (- item)',
  heading: 'Heading (### title)',
  image: 'Upload an image',
};

function autosize(el: HTMLTextAreaElement) {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

function DragHandle() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </svg>
  );
}

export function BlockEditor({
  column,
  initial,
  features = ALL_FEATURES,
  uploadAction = uploadProseImage,
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => parseBlocks(initial, features));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // inserting opens a new block at the index instead of replacing the block already there
  const [inserting, setInserting] = useState(false);
  const [draft, setDraft] = useState('');
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const [error, setError] = useState<string | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef(0);
  const dragIndex = useRef<number | null>(null);
  // the gap the dragged block would drop into (0..length); ref drives the drop, state the line
  const dragOverRef = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  // a native file picker blurs the textarea; this stops blur from committing mid-upload
  const pickingRef = useRef(false);

  // committing splices the parsed draft in: replace the block, or insert before it when inserting
  function splice(source: Block[]): Block[] {
    if (editingIndex === null) return source;
    const parsed = parseBlocks(draft, features);
    const deleteCount = inserting ? 0 : 1;
    return [
      ...source.slice(0, editingIndex),
      ...parsed,
      ...source.slice(editingIndex + deleteCount),
    ];
  }

  // the wire value always reflects the live draft so a submit mid-edit captures the latest text
  const serialised = useMemo(() => {
    if (editingIndex === null) return serialiseBlocks(blocks);
    const parsed = parseBlocks(draft, features);
    const deleteCount = inserting ? 0 : 1;
    return serialiseBlocks([
      ...blocks.slice(0, editingIndex),
      ...parsed,
      ...blocks.slice(editingIndex + deleteCount),
    ]);
  }, [blocks, editingIndex, inserting, draft, features]);

  useEffect(() => {
    if (editingIndex === null) return;
    const el = areaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
    setSel([el.value.length, el.value.length]);
    autosize(el);
  }, [editingIndex]);

  function handleBlur() {
    if (pickingRef.current || editingIndex === null) return;
    setBlocks(splice(blocks));
    setEditingIndex(null);
    setInserting(false);
  }

  // commit first, then locate the clicked block in the settled list so a split cannot stale its index
  function openBlock(target: Block) {
    const next = splice(blocks);
    const index = next.indexOf(target);
    setBlocks(next);
    setInserting(false);
    if (index === -1) {
      setEditingIndex(null);
      return;
    }
    setEditingIndex(index);
    setDraft(serialiseBlock(next[index]));
  }

  function openAt(index: number, insert: boolean) {
    const next = splice(blocks);
    setBlocks(next);
    setInserting(insert);
    setEditingIndex(index);
    setDraft('');
  }

  function editSelection(
    transform: (text: string, start: number, end: number) => [string, number, number?],
  ) {
    const el = areaRef.current;
    if (!el) return;
    const [text, selStart, selEnd = selStart] = transform(
      draft,
      el.selectionStart,
      el.selectionEnd,
    );
    setDraft(text);
    requestAnimationFrame(() => {
      if (!el.isConnected) return;
      el.focus();
      el.setSelectionRange(selStart, selEnd);
      setSel([selStart, selEnd]);
      autosize(el);
    });
  }

  function applyFeature(feature: Feature) {
    const wrap = WRAPS[feature];
    if (wrap) {
      editSelection((text, start, end) => toggleWrap(text, start, end, wrap));
      return;
    }
    const prefix = PREFIXES[feature];
    if (prefix) {
      editSelection((text, start) => {
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        return [text.slice(0, lineStart) + prefix + text.slice(lineStart), start + prefix.length];
      });
      return;
    }
    if (feature === 'link') {
      editSelection((text, start, end) => {
        const label = text.slice(start, end) || 'text';
        const insert = `[${label}](https://)`;
        return [text.slice(0, start) + insert + text.slice(end), start + insert.length - 1];
      });
      return;
    }
    if (feature === 'image') {
      caretRef.current = areaRef.current?.selectionStart ?? draft.length;
      pickingRef.current = true;
      fileRef.current?.click();
    }
  }

  async function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) {
      pickingRef.current = false;
      return;
    }
    const data = new FormData();
    data.set('file', file);
    const result = await uploadAction(data);
    pickingRef.current = false;
    if (result.error || !result.url) {
      setError(result.error ?? 'Upload failed');
      return;
    }
    setError(null);
    const markup = `\n![image](${result.url})\n`;
    const at = caretRef.current;
    setDraft((d) => d.slice(0, at) + markup + d.slice(at));
    requestAnimationFrame(() => areaRef.current?.focus());
  }

  // the gap is the target insertion index in 0..length, so the top and bottom are reachable
  function markDragGap(e: React.DragEvent, index: number) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const gap = e.clientY > rect.top + rect.height / 2 ? index + 1 : index;
    dragOverRef.current = gap;
    setDragOver(gap);
  }

  function clearDrag() {
    dragIndex.current = null;
    dragOverRef.current = null;
    setDragOver(null);
  }

  function moveTo(to: number) {
    const from = dragIndex.current;
    clearDrag();
    if (from === null || to === from || to === from + 1) return;
    setBlocks((bs) => {
      const next = [...bs];
      const [moved] = next.splice(from, 1);
      next.splice(from < to ? to - 1 : to, 0, moved);
      return next;
    });
  }

  function isActive(feature: Feature): boolean {
    const wrap = WRAPS[feature];
    return editing && !!wrap && selectionWrapped(draft, sel[0], sel[1], wrap);
  }

  // the empty gutter cell keeps the textarea aligned with the handle column of the view rows
  function textarea(key: string) {
    return (
      <div key={key} className="flex items-start gap-2">
        <span aria-hidden="true" className="w-4 shrink-0" />
        <textarea
          ref={areaRef}
          rows={1}
          value={draft}
          aria-label="block editor"
          onChange={(e) => {
            setDraft(e.target.value);
            setSel([e.target.selectionStart, e.target.selectionEnd]);
            autosize(e.target);
          }}
          onSelect={(e) => setSel([e.currentTarget.selectionStart, e.currentTarget.selectionEnd])}
          onFocus={() => {
            pickingRef.current = false;
          }}
          onBlur={handleBlur}
          onKeyUp={(e) => setSel([e.currentTarget.selectionStart, e.currentTarget.selectionEnd])}
          onClick={(e) => setSel([e.currentTarget.selectionStart, e.currentTarget.selectionEnd])}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              areaRef.current?.blur();
            }
          }}
          className={`${fieldInput} block flex-1 resize-none overflow-hidden`}
        />
      </div>
    );
  }

  function dropLine(gap: number) {
    if (dragOver !== gap) return null;
    // click-through so the line never becomes the drop target (it would swallow a top-edge drop)
    return <div className="pointer-events-none ml-6 h-0.5 bg-accent" />;
  }

  function insertSlot(index: number) {
    if (editingIndex !== null) return null;
    return (
      <button
        type="button"
        aria-label="insert block"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => openAt(index, true)}
        className="group/ins relative ml-6 block h-2"
      >
        <span className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 border-t border-dashed border-accent group-hover/ins:block" />
      </button>
    );
  }

  // the view box mirrors the textarea's border and padding so clicking to edit causes no shift
  function blockRow(block: Block, i: number) {
    return (
      <div className="group/row flex items-start gap-2" onDragOver={(e) => markDragGap(e, i)}>
        <span
          aria-label="reorder block"
          role="button"
          draggable
          onDragStart={(e) => {
            dragIndex.current = i;
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', String(i));
            }
          }}
          onDragEnd={clearDrag}
          className="mt-2.5 shrink-0 cursor-grab text-muted opacity-0 transition-opacity active:cursor-grabbing group-hover/row:opacity-100"
        >
          <DragHandle />
        </span>
        <div
          role="button"
          tabIndex={0}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => openBlock(block)}
          onKeyDown={(e) => e.key === 'Enter' && openBlock(block)}
          className="flex-1 cursor-text border border-transparent px-3 py-2.5 font-mono text-sm leading-relaxed text-text/85"
        >
          <BlockView block={block} linkMode="text" paragraphClass="" />
        </div>
      </div>
    );
  }

  const editing = editingIndex !== null;

  return (
    <div className="mt-2">
      <div className="mb-2 flex gap-2">
        {TOOLBAR.filter((feature) => features[feature]).map((feature) => (
          <button
            key={feature}
            type="button"
            aria-label={feature}
            title={TITLES[feature]}
            aria-pressed={WRAPS[feature] ? isActive(feature) : undefined}
            disabled={!editing}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFeature(feature)}
            className={`${toolButton} ${isActive(feature) ? toolButtonActive : toolButtonIdle}`}
          >
            <BlockIcon name={feature} />
          </button>
        ))}
      </div>

      <div
        className="space-y-1 border border-border px-3 py-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          moveTo(dragOverRef.current ?? blocks.length);
        }}
      >
        {blocks.map((block, i) => (
          <Fragment key={i}>
            {dropLine(i)}
            {insertSlot(i)}
            {editingIndex === i && inserting && textarea(`ins-${i}`)}
            {editingIndex === i && !inserting ? textarea(`edit-${i}`) : blockRow(block, i)}
          </Fragment>
        ))}
        {dropLine(blocks.length)}
        {editingIndex === blocks.length ? (
          textarea('edit-new')
        ) : (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => openAt(blocks.length, false)}
            className="ml-6 block text-left font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
          >
            {blocks.length === 0 ? '+ start writing' : '+ block'}
          </button>
        )}
      </div>

      {error && <p className="mt-2 font-mono text-xs text-danger">{`> ${error}`}</p>}
      <input type="hidden" id={column} name={column} value={serialised} readOnly />
      {features.image && (
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={onFilePicked}
        />
      )}
    </div>
  );
}
