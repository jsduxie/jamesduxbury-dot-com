// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CaseStudyDetail } from '../src/components/work/CaseStudyDetail';
import type { CaseStudy } from '../src/data/case-studies';
import type { Project } from '../src/data/projects';

const project: Project = {
  slug: 'test-project',
  title: 'Test Project',
  subtitle: 'A project for testing',
  status: 'live',
  yearStart: 2025,
  yearEnd: 2026,
  techStack: ['TypeScript', 'Vitest'],
  highlights: ['shipped a thing', 'tested a thing'],
  githubLink: 'https://github.com/jsduxie/test',
  metrics: [{ label: 'coverage', value: '96%', ratio: 0.96 }],
};

const study: CaseStudy = {
  projectSlug: 'test-project',
  problem: [{ kind: 'p', runs: ['the ', { strong: 'problem' }, ' statement'] }],
  approach: [
    { kind: 'p', runs: ['the approach'] },
    { kind: 'p', runs: ['with a ', { em: 'second' }, ' paragraph'] },
  ],
  outcome: [{ kind: 'p', runs: ['the outcome'] }],
};

describe('CaseStudyDetail', () => {
  it('renders the study sections with runs and metrics', () => {
    render(<CaseStudyDetail project={project} study={study} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Project');
    expect(screen.getByText('Problem')).toBeInTheDocument();
    expect(screen.getByText('problem')).toBeInTheDocument();
    expect(screen.getByText('Approach')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
    expect(screen.getByText('Outcome')).toBeInTheDocument();
    expect(screen.getByText('coverage')).toBeInTheDocument();
    expect(screen.getByText('view repo ↗')).toBeInTheDocument();
    expect(screen.queryByText('shipped a thing')).not.toBeInTheDocument();
  });

  it('falls back to highlights with an under-examination notice', () => {
    render(<CaseStudyDetail project={{ ...project, underExam: true }} study={null} />);
    expect(screen.getByText('under examination')).toBeInTheDocument();
    expect(screen.getByText('shipped a thing')).toBeInTheDocument();
    expect(screen.getByText('tested a thing')).toBeInTheDocument();
  });

  it('falls back to a preparation notice for projects not under exam', () => {
    render(<CaseStudyDetail project={project} study={null} />);
    expect(screen.getByText(/in preparation/)).toBeInTheDocument();
    expect(screen.getByText('shipped a thing')).toBeInTheDocument();
  });
});
