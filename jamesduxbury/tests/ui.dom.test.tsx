// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let pathname: string | null = '/work';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

import { Entry } from '../src/components/Entry';
import { Footer } from '../src/components/Footer';
import { StatusBar } from '../src/components/console/StatusBar';
import { MetricBar } from '../src/components/work/MetricBar';
import { ProjectRow } from '../src/components/work/ProjectRow';
import { DegreeCard } from '../src/components/education/DegreeCard';
import { DegreeList } from '../src/components/education/DegreeList';
import { ContactForm } from '../src/components/contact/ContactForm';
import { ContactChannels } from '../src/components/contact/ContactChannels';
import { WorkSummary } from '../src/components/work/WorkSummary';
import { ExperienceSummary } from '../src/components/experience/ExperienceSummary';
import { SkillsSummary } from '../src/components/skills/SkillsSummary';
import { AboutSummary } from '../src/components/about/AboutSummary';
import { EducationDetail } from '../src/components/education/EducationDetail';
import { degrees } from '../src/data/education';
import type { Project } from '../src/data/projects';

// Stubbed per-describe only: the neon HTTP driver also uses fetch, so a global
// stub would sever the DB-backed component tests
const fetchMock = vi.fn();

beforeEach(() => {
  pathname = '/work';
});

describe('summary components render DB content', () => {
  it.each([
    [WorkSummary, 'open /work →'],
    [ExperienceSummary, 'open /experience →'],
    [SkillsSummary, 'open /skills →'],
    [AboutSummary, 'open /about →'],
  ] as const)('%o links to its detail page', async (Component, cta) => {
    render(await Component());
    expect(screen.getByText(cta)).toBeInTheDocument();
  });

  it('EducationDetail composes a widget over every degree', async () => {
    // Not rendered: it nests another async component, which jsdom client React cannot resolve
    const element = await EducationDetail();
    expect(element.props.count).toBe(degrees.length);
    expect(element.props.label).toBe('EDUCATION');
  });
});

describe('Entry', () => {
  it('renders the entry channel header', () => {
    render(<Entry />);
    expect(screen.getByText(/CHANNEL 00/)).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders the contact links', () => {
    render(<Footer />);
    expect(screen.getByText('contact form ↗')).toBeInTheDocument();
    expect(screen.getByText('email ↗')).toBeInTheDocument();
  });
});

describe('StatusBar', () => {
  it('marks the current route as active', () => {
    render(<StatusBar />);
    const active = screen
      .getAllByRole('link', { name: 'work' })
      .find((l) => l.getAttribute('aria-current') === 'page');
    expect(active).toBeDefined();
  });

  it('opens and closes the mobile menu', () => {
    render(<StatusBar />);
    const button = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(button);
    expect(screen.getAllByRole('link', { name: 'about' }).length).toBeGreaterThan(1);

    fireEvent.click(screen.getAllByRole('link', { name: 'about' })[1]);
    expect(screen.getAllByRole('link', { name: 'about' })).toHaveLength(1);
  });

  it('closes the mobile menu when resized to desktop', () => {
    render(<StatusBar />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    window.innerWidth = 1280;
    fireEvent(window, new Event('resize'));
    expect(screen.getAllByRole('link', { name: 'about' })).toHaveLength(1);
  });
});

describe('ContactForm', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  function fill() {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.co' } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'hi' } });
  }

  it('shows success and clears fields', async () => {
    fetchMock.mockResolvedValue({ ok: true });
    render(<ContactForm />);
    fill();
    fireEvent.submit(screen.getByRole('button', { name: /send/ }).closest('form')!);
    await waitFor(() => expect(screen.getByText(/message sent/)).toBeInTheDocument());
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('shows the server error message', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: 'Invalid payload' }) });
    render(<ContactForm />);
    fill();
    fireEvent.submit(screen.getByRole('button', { name: /send/ }).closest('form')!);
    await waitFor(() => expect(screen.getByText(/Invalid payload/)).toBeInTheDocument());
  });

  it('falls back to a status message when the error body is unreadable', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => Promise.reject(new Error('no body')) });
    render(<ContactForm />);
    fill();
    fireEvent.submit(screen.getByRole('button', { name: /send/ }).closest('form')!);
    await waitFor(() => expect(screen.getByText(/Message failed to send \(500\)/)).toBeInTheDocument());
  });

  it('shows network failures and disables the button while sending', async () => {
    let reject: (e: Error) => void;
    fetchMock.mockReturnValue(new Promise((_, rej) => (reject = rej)));
    render(<ContactForm />);
    fill();
    fireEvent.submit(screen.getByRole('button', { name: /send/ }).closest('form')!);
    await waitFor(() => expect(screen.getByRole('button', { name: /sending/ })).toBeDisabled());
    reject!(new Error('network down'));
    await waitFor(() => expect(screen.getByText(/network down/)).toBeInTheDocument());
  });
});

describe('ContactChannels', () => {
  it('renders all channels, external ones in a new tab', () => {
    render(<ContactChannels />);
    expect(screen.getByText('@jsduxie').nextElementSibling).toHaveAttribute('target', '_blank');
    expect(screen.getByText('secure mailto channel')).toBeInTheDocument();
    expect(screen.getByText('in/jamesduxbury03')).toBeInTheDocument();
  });
});

describe('presentational edge cases', () => {
  const base: Project = {
    slug: 't',
    title: 'Test Project',
    subtitle: 'sub',
    status: 'live',
    yearStart: 2025,
    yearEnd: 2025,
    techStack: ['a', 'b', 'c', 'd', 'e'],
    highlights: ['h1'],
  };

  it('ProjectRow renders live links and truncates compact tech stacks', () => {
    render(<ProjectRow project={{ ...base, liveLink: 'https://x.test' }} index={0} variant="detail" />);
    expect(screen.getByText('open live ↗')).toHaveAttribute('href', 'https://x.test');

    render(<ProjectRow project={base} index={1} variant="compact" />);
    expect(screen.getByText(/\+2$/)).toBeInTheDocument();
  });

  it('MetricBar clamps ratios into the bar range', () => {
    const { container } = render(
      <MetricBar
        metrics={[
          { label: 'over', value: 'x', ratio: 1.5 },
          { label: 'under', value: 'y', ratio: -0.2 },
        ]}
      />,
    );
    const widths = [...container.querySelectorAll('[style]')].map(
      (el) => (el as HTMLElement).style.width,
    );
    expect(widths).toContain('100%');
    expect(widths).toContain('0%');
  });

  it('DegreeCard renders bullet-less degrees as a static row', () => {
    render(<DegreeCard degree={{ qualification: 'Q', institution: 'I', period: 'P', yearEnd: 2020 }} />);
    expect(screen.getByText('▸')).toBeInTheDocument();
  });

  it('DegreeCard collapses and expands bulleted degrees', () => {
    render(<DegreeCard degree={degrees[0]} />);
    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);
    expect(screen.getAllByText(degrees[0].bullets![0]).length).toBeGreaterThan(0);
  });
});

describe('single-open accordion', () => {
  it('opens the first item by default and keeps at most one open', async () => {
    render(<DegreeList degrees={degrees} />);
    const toggles = screen.getAllByRole('button');

    expect(toggles[0]).toHaveAttribute('aria-expanded', 'true');
    expect(toggles[1]).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggles[1]);

    await waitFor(() => {
      expect(toggles[1]).toHaveAttribute('aria-expanded', 'true');
      expect(toggles[0]).toHaveAttribute('aria-expanded', 'false');
    });
    expect(
      screen.getAllByRole('button').filter((b) => b.getAttribute('aria-expanded') === 'true'),
    ).toHaveLength(1);
  });

  it('toggles an open item closed so none remain open', async () => {
    render(<DegreeList degrees={degrees} />);
    const toggles = screen.getAllByRole('button');

    fireEvent.click(toggles[0]);

    await waitFor(() =>
      expect(
        screen.getAllByRole('button').filter((b) => b.getAttribute('aria-expanded') === 'true'),
      ).toHaveLength(0),
    );
  });
});
