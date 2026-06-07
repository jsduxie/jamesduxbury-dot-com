'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_FEATURES, parseBlocks, serialiseBlock, serialiseBlocks } from '@/admin/blocks';
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

const fieldInput =
  'w-full border border-border bg-bg px-3 py-2.5 font-mono text-sm text-text placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';
const toolButton =
  'flex h-8 w-8 items-center justify-center border border-border text-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40';

// inline markers wrap a selection; block markers prefix the caret's line
const WRAPS: Partial<Record<Feature, string>> = { bold: '**', italic: '*' };
const PREFIXES: Partial<Record<Feature, string>> = { heading: '### ', list: '- ' };
const TOOLBAR: Feature[] = ['bold', 'italic', 'link', 'list', 'heading', 'image'];

function autosize(el: HTMLTextAreaElement) {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

export function BlockEditor({
  column,
  initial,
  features = ALL_FEATURES,
  uploadAction = uploadProseImage,
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => parseBlocks(initial, features));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef(0);
  // a native file picker blurs the textarea; this stops blur from committing mid-upload
  const pickingRef = useRef(false);

  // the wire value always reflects the live draft so a submit mid-edit captures the latest text
  const serialised = useMemo(() => {
    if (editingIndex === null) return serialiseBlocks(blocks);
    const parsed = parseBlocks(draft, features);
    return serialiseBlocks([
      ...blocks.slice(0, editingIndex),
      ...parsed,
      ...blocks.slice(editingIndex + 1),
    ]);
  }, [blocks, editingIndex, draft, features]);

  useEffect(() => {
    if (editingIndex === null) return;
    const el = areaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
    autosize(el);
  }, [editingIndex]);

  // committing parses the draft and splices the result in: 0 deletes, 1 replaces, many splits
  function commitInto(source: Block[]): Block[] {
    if (editingIndex === null) return source;
    const parsed = parseBlocks(draft, features);
    return [...source.slice(0, editingIndex), ...parsed, ...source.slice(editingIndex + 1)];
  }

  function handleBlur() {
    if (pickingRef.current || editingIndex === null) return;
    setBlocks(commitInto(blocks));
    setEditingIndex(null);
  }

  // commit first, then locate the clicked block in the settled list so a split cannot stale its index
  function openBlock(target: Block) {
    const next = commitInto(blocks);
    const index = next.indexOf(target);
    setBlocks(next);
    if (index === -1) {
      setEditingIndex(null);
      return;
    }
    setEditingIndex(index);
    setDraft(serialiseBlock(next[index]));
  }

  function openNew() {
    const next = commitInto(blocks);
    setBlocks(next);
    setEditingIndex(next.length);
    setDraft('');
  }

  function editSelection(
    transform: (text: string, start: number, end: number) => [string, number],
  ) {
    const el = areaRef.current;
    if (!el) return;
    const [text, caret] = transform(draft, el.selectionStart, el.selectionEnd);
    setDraft(text);
    requestAnimationFrame(() => {
      if (!el.isConnected) return;
      el.focus();
      el.setSelectionRange(caret, caret);
      autosize(el);
    });
  }

  function applyFeature(feature: Feature) {
    const wrap = WRAPS[feature];
    if (wrap) {
      editSelection((text, start, end) => [
        text.slice(0, start) + wrap + text.slice(start, end) + wrap + text.slice(end),
        end + wrap.length * 2,
      ]);
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

  function textarea(key: string) {
    return (
      <textarea
        key={key}
        ref={areaRef}
        rows={1}
        value={draft}
        aria-label="block editor"
        onChange={(e) => {
          setDraft(e.target.value);
          autosize(e.target);
        }}
        onFocus={() => {
          pickingRef.current = false;
        }}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            areaRef.current?.blur();
          }
        }}
        className={`${fieldInput} block resize-none overflow-hidden`}
      />
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
            disabled={!editing}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFeature(feature)}
            className={toolButton}
          >
            <BlockIcon name={feature} />
          </button>
        ))}
      </div>

      <div className="space-y-2 border border-border px-3 py-3">
        {blocks.map((block, i) =>
          editingIndex === i ? (
            textarea(`edit-${i}`)
          ) : (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => openBlock(block)}
              onKeyDown={(e) => e.key === 'Enter' && openBlock(block)}
              className="cursor-text font-mono text-sm leading-relaxed text-text/85"
            >
              <BlockView block={block} linkMode="text" paragraphClass="" />
            </div>
          ),
        )}
        {editingIndex === blocks.length ? (
          textarea('edit-new')
        ) : (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={openNew}
            className="block w-full text-left font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
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
