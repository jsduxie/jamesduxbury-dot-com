'use client';

import { useActionState, useState } from 'react';
import { BlobImage } from '@/components/BlobImage';
import type { FormState } from '@/admin/actions';
import type { FieldDef, FieldDefault, MetricDraft } from '@/admin/fields';
import { BlockEditor } from './BlockEditor';

const INITIAL_STATE: FormState = { message: null, fieldErrors: {} };

const fieldLabel = 'font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs';
const fieldInput =
  'mt-2 w-full border border-border bg-bg px-3 py-2.5 font-mono text-sm text-text placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';
const rowButton =
  'font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-danger';
const addButton =
  'mt-3 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-text';

interface SectionFormProps {
  fields: FieldDef[];
  defaults: Record<string, FieldDefault>;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}

function UploadInput({ column, accept }: { column: string; accept: string }) {
  return (
    <input
      id={column}
      name={column}
      type="file"
      accept={accept}
      className={`${fieldInput} mt-0 cursor-pointer file:mr-4 file:cursor-pointer file:border-0 file:bg-transparent file:font-mono file:text-xs file:uppercase file:tracking-[0.18em] file:text-accent`}
    />
  );
}

function RemoveControl({ column }: { column: string }) {
  return (
    <label className="mb-3 flex w-fit cursor-pointer items-center gap-3">
      <span className="relative flex h-4 w-4 items-center justify-center">
        <input
          type="checkbox"
          name={`${column}.remove`}
          className="peer h-4 w-4 cursor-pointer appearance-none border border-border bg-bg transition-colors checked:border-accent checked:bg-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <span className="pointer-events-none absolute hidden font-mono text-[0.65rem] leading-none text-bg peer-checked:block">
          ✓
        </span>
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        remove current file
      </span>
    </label>
  );
}

function BulletsField({ column, initial }: { column: string; initial: string[] }) {
  const [bullets, setBullets] = useState<string[]>(initial.length ? initial : ['']);

  return (
    <div>
      {bullets.map((bullet, i) => (
        <div key={i} className="mt-2 flex items-center gap-3">
          <input
            id={i === 0 ? column : undefined}
            name={column}
            type="text"
            value={bullet}
            onChange={(e) => setBullets(bullets.map((b, j) => (j === i ? e.target.value : b)))}
            className={`${fieldInput} mt-0`}
          />
          <button
            type="button"
            onClick={() => setBullets(bullets.filter((_, j) => j !== i))}
            className={rowButton}
          >
            remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setBullets([...bullets, ''])} className={addButton}>
        + add bullet
      </button>
    </div>
  );
}

const EMPTY_METRIC: MetricDraft = { label: '', value: '', ratio: '' };

function MetricsField({ column, initial }: { column: string; initial: MetricDraft[] }) {
  const [metrics, setMetrics] = useState<MetricDraft[]>(initial);

  const update = (i: number, key: keyof MetricDraft, value: string) =>
    setMetrics(metrics.map((m, j) => (j === i ? { ...m, [key]: value } : m)));

  return (
    <div>
      {metrics.map((metric, i) => (
        <div key={i} className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <input
            id={i === 0 ? column : undefined}
            name={`${column}.label`}
            type="text"
            placeholder="label"
            value={metric.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            className={`${fieldInput} mt-0 sm:flex-1`}
          />
          <input
            name={`${column}.value`}
            type="text"
            placeholder="value"
            value={metric.value}
            onChange={(e) => update(i, 'value', e.target.value)}
            className={`${fieldInput} mt-0 sm:w-32`}
          />
          <input
            name={`${column}.ratio`}
            type="number"
            step="0.001"
            min="0"
            max="1"
            placeholder="ratio"
            value={metric.ratio}
            onChange={(e) => update(i, 'ratio', e.target.value)}
            className={`${fieldInput} mt-0 sm:w-28`}
          />
          <button
            type="button"
            onClick={() => setMetrics(metrics.filter((_, j) => j !== i))}
            className={rowButton}
          >
            remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setMetrics([...metrics, EMPTY_METRIC])}
        className={addButton}
      >
        + add metric
      </button>
    </div>
  );
}

function FieldInput({ field, defaultValue }: { field: FieldDef; defaultValue: FieldDefault }) {
  const text = typeof defaultValue === 'string' ? defaultValue : '';
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          id={field.column}
          name={field.column}
          rows={5}
          defaultValue={text}
          className={`${fieldInput} resize-y`}
        />
      );
    case 'bullets':
      return (
        <BulletsField
          column={field.column}
          initial={Array.isArray(defaultValue) ? (defaultValue as string[]) : []}
        />
      );
    case 'metrics':
      return (
        <MetricsField
          column={field.column}
          initial={Array.isArray(defaultValue) ? (defaultValue as MetricDraft[]) : []}
        />
      );
    case 'select':
      return (
        <div className="relative mt-2">
          <select
            id={field.column}
            name={field.column}
            defaultValue={text}
            className={`${fieldInput} mt-0 cursor-pointer appearance-none pr-10`}
          >
            {field.options?.map((option) => (
              <option key={option} value={option} className="bg-bg text-text">
                {option}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted">
            ▾
          </span>
        </div>
      );
    case 'checkbox':
      return (
        <label htmlFor={field.column} className="mt-2 flex w-fit cursor-pointer items-center gap-3">
          <span className="relative flex h-4 w-4 items-center justify-center">
            <input
              id={field.column}
              name={field.column}
              type="checkbox"
              defaultChecked={defaultValue === true}
              className="peer h-4 w-4 cursor-pointer appearance-none border border-border bg-bg transition-colors checked:border-accent checked:bg-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <span className="pointer-events-none absolute hidden font-mono text-[0.65rem] leading-none text-bg peer-checked:block">
              ✓
            </span>
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">enabled</span>
        </label>
      );
    case 'number':
    case 'sort_order':
      return (
        <input
          id={field.column}
          name={field.column}
          type="number"
          defaultValue={text}
          className={fieldInput}
        />
      );
    case 'prose':
      return <BlockEditor column={field.column} initial={text} features={field.features} />;
    case 'image':
      return (
        <div className="mt-2">
          {text && (
            <BlobImage
              src={text}
              alt="current image"
              width={80}
              height={80}
              unoptimized
              className="mb-3 border border-border object-cover"
            />
          )}
          {text && <RemoveControl column={field.column} />}
          <UploadInput column={field.column} accept="image/png,image/jpeg,image/webp" />
        </div>
      );
    case 'document':
      return (
        <div className="mt-2">
          {text && (
            <a
              href={text}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 inline-block font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:text-text"
            >
              current file ↗
            </a>
          )}
          {text && <RemoveControl column={field.column} />}
          <UploadInput column={field.column} accept="application/pdf" />
        </div>
      );
    case 'url':
      return (
        <input
          id={field.column}
          name={field.column}
          type="url"
          defaultValue={text}
          className={fieldInput}
        />
      );
    default:
      return (
        <input
          id={field.column}
          name={field.column}
          type="text"
          defaultValue={text}
          className={fieldInput}
        />
      );
  }
}

export function SectionForm({ fields, defaults, action, submitLabel }: SectionFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="divide-y divide-border">
      {fields.map((field) => (
        <div key={field.column} className="relative px-4 py-5 sm:px-6">
          <label htmlFor={field.column} className={fieldLabel}>
            {field.label}
          </label>
          {field.help && (
            <p className="mt-1 font-mono text-[0.65rem] text-muted/70">{field.help}</p>
          )}
          <FieldInput field={field} defaultValue={defaults[field.column] ?? ''} />
          {state.fieldErrors[field.column] && (
            <p className="mt-2 font-mono text-xs text-danger">
              {`>`} {state.fieldErrors[field.column]}
            </p>
          )}
        </div>
      ))}

      <div className="flex flex-col items-stretch gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          {state.message && (
            <span className="text-danger">
              {`>`} {state.message}
            </span>
          )}
          {isPending && <span>{`>`} saving…</span>}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full border border-accent bg-accent/10 px-5 py-2 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
