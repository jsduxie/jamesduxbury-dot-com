// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AboutLoading from '../src/app/about/loading';
import ContactLoading from '../src/app/contact/loading';
import EducationLoading from '../src/app/education/loading';
import ExperienceLoading from '../src/app/experience/loading';
import SkillsLoading from '../src/app/skills/loading';
import WorkLoading from '../src/app/work/loading';

const ROUTES = [
  { name: 'about', Loading: AboutLoading, channel: '01', label: 'ABOUT' },
  { name: 'work', Loading: WorkLoading, channel: '02', label: 'WORK' },
  { name: 'skills', Loading: SkillsLoading, channel: '03', label: 'SKILLS' },
  { name: 'experience', Loading: ExperienceLoading, channel: '04', label: 'EXPERIENCE' },
  { name: 'education', Loading: EducationLoading, channel: '05', label: 'EDUCATION' },
  { name: 'contact', Loading: ContactLoading, channel: '06', label: 'CONTACT' },
];

describe.each(ROUTES)('$name loading state', ({ name, Loading, channel, label }) => {
  it('marks the page busy and labels it for assistive tech', () => {
    render(<Loading />);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-busy', 'true');
    expect(main).toHaveAttribute('aria-label', `Loading ${name}`);
  });

  it('mirrors the route shell', () => {
    render(<Loading />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(`CHANNEL ${channel}`)).toBeInTheDocument();
    expect(screen.getByText('← / home')).toBeInTheDocument();
  });

  it('keeps every placeholder out of the accessibility tree', () => {
    const { container } = render(<Loading />);
    container.querySelectorAll('span[class*="text-text/30"]').forEach((span) => {
      expect(span).toHaveAttribute('aria-hidden', 'true');
    });
    // the bordered widget body must contain placeholder glyphs only, no real words
    const body = container.querySelector('section > div.backdrop-blur-sm');
    expect(body?.textContent).toMatch(/^[░▒▸\s]*$/);
  });
});

describe('route-specific skeleton shapes', () => {
  it('work renders three project-shaped rows', () => {
    render(<WorkLoading />);
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('experience and education render collapsible-row placeholders', () => {
    const exp = render(<ExperienceLoading />);
    expect(exp.getAllByText('▸')).toHaveLength(4);
    exp.unmount();

    const edu = render(<EducationLoading />);
    expect(edu.getAllByText('▸')).toHaveLength(2);
    expect(edu.container.querySelector('.grid.grid-cols-1')).not.toBeNull();
  });

  it('skills renders chip-grid placeholders', () => {
    const { container } = render(<SkillsLoading />);
    expect(container.querySelectorAll('.skill-badge').length).toBeGreaterThan(10);
  });

  it('contact renders field placeholders without a submittable form', () => {
    const { container } = render(<ContactLoading />);
    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelectorAll('.border.border-border.bg-bg').length).toBe(3);
  });
});
