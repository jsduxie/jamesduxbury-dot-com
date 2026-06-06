import type { AboutParagraph } from '@/data/about';
import type { ProjectMetric } from '@/data/projects';
import { parseProse, parseRuns, serialiseProse, serialiseRuns } from './runs';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'bullets'
  | 'tags'
  | 'url'
  | 'number'
  | 'sort_order'
  | 'select'
  | 'checkbox'
  | 'metrics'
  | 'runs'
  | 'prose'
  | 'image';

export interface FieldDef {
  column: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  help?: string;
}

export interface MetricDraft {
  label: string;
  value: string;
  ratio: string;
}

export type FieldValue = string | number | boolean | string[] | object | null;
export type FieldDefault = string | boolean | string[] | MetricDraft[];

export function parseFields(fields: FieldDef[], formData: FormData): Record<string, FieldValue> {
  const out: Record<string, FieldValue> = {};
  for (const f of fields) {
    const raw = formData.get(f.column);
    const text = typeof raw === 'string' ? raw.trim() : '';
    switch (f.type) {
      case 'text':
      case 'textarea':
      case 'url':
      case 'select':
        out[f.column] = text === '' ? null : text;
        break;
      case 'bullets':
        out[f.column] = formData
          .getAll(f.column)
          .map((entry) => String(entry).trim())
          .filter(Boolean);
        break;
      case 'tags':
        out[f.column] = text
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
        break;
      case 'number':
        out[f.column] = text === '' ? null : Number(text);
        break;
      case 'sort_order':
        out[f.column] = text === '' ? 0 : Number(text);
        break;
      case 'checkbox':
        out[f.column] = raw !== null;
        break;
      case 'metrics': {
        const labels = formData.getAll(`${f.column}.label`).map((v) => String(v).trim());
        const values = formData.getAll(`${f.column}.value`).map((v) => String(v).trim());
        const ratios = formData.getAll(`${f.column}.ratio`).map((v) => String(v).trim());
        const metrics = labels
          .map((label, i) => ({ label, value: values[i] ?? '', ratio: ratios[i] ?? '' }))
          .filter((m) => m.label || m.value || m.ratio)
          .map((m) => ({
            label: m.label,
            value: m.value,
            ...(m.ratio !== '' ? { ratio: Number(m.ratio) } : {}),
          }));
        out[f.column] = metrics.length ? metrics : null;
        break;
      }
      case 'runs':
        out[f.column] = parseRuns(text);
        break;
      case 'prose': {
        const paragraphs = parseProse(text);
        out[f.column] = paragraphs.length ? paragraphs : null;
        break;
      }
      // the file is uploaded in the action, which fills the column
      case 'image':
        out[f.column] = null;
        break;
    }
  }
  return out;
}

// builds form defaults for a row or a blank create form
export function formDefaults(
  fields: FieldDef[],
  row?: Record<string, unknown>,
): Record<string, FieldDefault> {
  const out: Record<string, FieldDefault> = {};
  for (const f of fields) out[f.column] = fieldDefault(f, row?.[f.column]);
  return out;
}

// maps a row value to its form input value
export function fieldDefault(f: FieldDef, value: unknown): FieldDefault {
  switch (f.type) {
    case 'checkbox':
      return value === true;
    case 'bullets':
      return Array.isArray(value) ? (value as string[]) : [];
    case 'tags':
      return Array.isArray(value) ? (value as string[]).join(', ') : '';
    case 'metrics':
      return Array.isArray(value)
        ? (value as ProjectMetric[]).map((m) => ({
            label: m.label,
            value: m.value,
            ratio: m.ratio !== undefined ? String(m.ratio) : '',
          }))
        : [];
    case 'runs':
      return Array.isArray(value) ? serialiseRuns(value as AboutParagraph) : '';
    case 'prose':
      return Array.isArray(value) ? serialiseProse(value as AboutParagraph[]) : '';
    case 'number':
    case 'sort_order':
      return typeof value === 'number' ? String(value) : '';
    default:
      return typeof value === 'string' ? value : '';
  }
}
