// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Session } from 'next-auth';
import type { FormState } from '../src/admin/actions';
import type { FieldDef } from '../src/admin/fields';
import { AutoSubmit } from '../src/components/AutoSubmit';
import { AdminPanel } from '../src/components/admin/AdminPanel';
import { DeleteButton } from '../src/components/admin/DeleteButton';
import { SectionForm } from '../src/components/admin/SectionForm';

const authSession = { value: null as Session | null };
vi.mock('@/auth', () => ({
  auth: async () => authSession.value,
  isAdminSession: (s: Session | null) => s?.user?.login === 'jsduxie',
}));
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

import AdminLayout from '../src/app/admin/layout';

afterEach(() => {
  authSession.value = null;
  vi.restoreAllMocks();
});

describe('AutoSubmit', () => {
  it('submits the named form on mount', () => {
    const submitSpy = vi
      .spyOn(HTMLFormElement.prototype, 'requestSubmit')
      .mockImplementation(() => {});
    render(
      <form id="signin-form">
        <AutoSubmit formId="signin-form" />
      </form>,
    );
    expect(submitSpy).toHaveBeenCalledOnce();
  });

  it('does nothing when the form is absent', () => {
    const submitSpy = vi
      .spyOn(HTMLFormElement.prototype, 'requestSubmit')
      .mockImplementation(() => {});
    render(<AutoSubmit formId="missing-form" />);
    expect(submitSpy).not.toHaveBeenCalled();
  });
});

describe('AdminPanel', () => {
  it('renders title, meta, and children', () => {
    render(
      <AdminPanel title="projects" meta="3 rows">
        <p>content</p>
      </AdminPanel>,
    );
    expect(screen.getByText(/projects/)).toBeInTheDocument();
    expect(screen.getByText('3 rows')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});

describe('DeleteButton', () => {
  it('asks for confirmation before submitting', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const action = vi.fn();
    const { container } = render(<DeleteButton action={action} />);
    fireEvent.submit(container.querySelector('form')!);
    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(action).not.toHaveBeenCalled();
  });

  it('runs the action when confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const action = vi.fn(async () => {});
    const { container } = render(<DeleteButton action={action} />);
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
  });
});

describe('SectionForm', () => {
  const fields: FieldDef[] = [
    { column: 'title', label: 'Title', type: 'text', help: 'a helpful hint' },
    { column: 'notes', label: 'Notes', type: 'textarea' },
    { column: 'link', label: 'Link', type: 'url' },
    { column: 'status', label: 'Status', type: 'select', options: ['live', 'dev'] },
    { column: 'flag', label: 'Flag', type: 'checkbox' },
    { column: 'year', label: 'Year', type: 'number' },
    { column: 'sort_order', label: 'Sort order', type: 'sort_order' },
    { column: 'tags', label: 'Tags', type: 'tags' },
    { column: 'bullets', label: 'Bullets', type: 'bullets' },
    { column: 'metrics', label: 'Metrics', type: 'metrics' },
    { column: 'runs', label: 'Paragraph', type: 'runs' },
  ];
  const defaults = {
    title: 'Existing',
    notes: 'note text',
    link: 'https://example.com',
    status: 'dev',
    flag: true,
    year: '2026',
    sort_order: '2',
    tags: 'a, b',
    bullets: ['first', 'second'],
    metrics: [{ label: 'F1', value: '0.9', ratio: '0.9' }],
    runs: 'plain **bold**',
  };
  const noopAction = async (): Promise<FormState> => ({ message: null, fieldErrors: {} });

  it('renders every field type with its default', () => {
    render(
      <SectionForm fields={fields} defaults={defaults} action={noopAction} submitLabel="save →" />,
    );
    expect(screen.getByLabelText('Title')).toHaveValue('Existing');
    expect(screen.getByText('a helpful hint')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toHaveValue('note text');
    expect(screen.getByLabelText('Link')).toHaveValue('https://example.com');
    expect(screen.getByLabelText('Status')).toHaveValue('dev');
    expect(screen.getByLabelText(/Flag/)).toBeChecked();
    expect(screen.getByLabelText('Year')).toHaveValue(2026);
    expect(screen.getByLabelText('Sort order')).toHaveValue(2);
    expect(screen.getByLabelText('Tags')).toHaveValue('a, b');
    expect(screen.getByDisplayValue('first')).toBeInTheDocument();
    expect(screen.getByDisplayValue('second')).toBeInTheDocument();
    expect(screen.getByDisplayValue('F1')).toBeInTheDocument();
    expect(screen.getByLabelText('Paragraph')).toHaveValue('plain **bold**');
    expect(screen.getByRole('button', { name: 'save →' })).toBeInTheDocument();
  });

  it('adds and removes bullet rows', () => {
    render(
      <SectionForm fields={fields} defaults={defaults} action={noopAction} submitLabel="save" />,
    );
    fireEvent.click(screen.getByRole('button', { name: '+ add bullet' }));
    expect(screen.getAllByDisplayValue('').length).toBeGreaterThanOrEqual(1);
    const removeButtons = screen.getAllByRole('button', { name: 'remove' });
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByDisplayValue('first')).not.toBeInTheDocument();
  });

  it('keeps typed bullet and metric values in state', () => {
    render(
      <SectionForm fields={fields} defaults={defaults} action={noopAction} submitLabel="save" />,
    );
    fireEvent.change(screen.getByDisplayValue('first'), { target: { value: 'rewritten' } });
    expect(screen.getByDisplayValue('rewritten')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('label'), { target: { value: 'Recall' } });
    fireEvent.change(screen.getByPlaceholderText('value'), { target: { value: '0.95' } });
    fireEvent.change(screen.getByPlaceholderText('ratio'), { target: { value: '0.5' } });
    expect(screen.getByDisplayValue('Recall')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0.95')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0.5')).toBeInTheDocument();
  });

  it('adds and removes metric rows', () => {
    render(
      <SectionForm fields={fields} defaults={defaults} action={noopAction} submitLabel="save" />,
    );
    fireEvent.click(screen.getByRole('button', { name: '+ add metric' }));
    expect(screen.getAllByPlaceholderText('label')).toHaveLength(2);
    const removeButtons = screen.getAllByRole('button', { name: 'remove' });
    fireEvent.click(removeButtons[removeButtons.length - 1]);
    expect(screen.getAllByPlaceholderText('label')).toHaveLength(1);
  });

  it('shows validation errors returned by the action', async () => {
    const action = vi.fn(
      async (): Promise<FormState> => ({
        message: 'Validation failed',
        fieldErrors: { title: 'Required' },
      }),
    );
    const { container } = render(
      <SectionForm fields={fields} defaults={defaults} action={action} submitLabel="save" />,
    );
    fireEvent.submit(container.querySelector('form')!);
    expect(await screen.findByText(/Validation failed/)).toBeInTheDocument();
    expect(screen.getByText(/Required/)).toBeInTheDocument();
  });
});

describe('AdminLayout', () => {
  it('renders the nav for the admin session', async () => {
    authSession.value = {
      user: { name: 'James', login: 'jsduxie' },
      expires: '2099-01-01T00:00:00.000Z',
    };
    render(await AdminLayout({ children: <p>page body</p> }));
    for (const label of ['admin', 'projects', 'about', 'messages', 'analytics', 'sign out']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
    expect(screen.getByText('page body')).toBeInTheDocument();
  });

  it.each([
    ['anonymous visitor', null],
    [
      'non-admin session',
      { user: { name: 'Someone', login: 'octocat' }, expires: '2099-01-01T00:00:00.000Z' },
    ],
  ])('redirects a %s to signin', async (_name, session) => {
    authSession.value = session;
    await expect(AdminLayout({ children: null })).rejects.toThrow('REDIRECT:/signin');
  });
});
