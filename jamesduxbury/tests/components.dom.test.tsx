// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkDetail } from '../src/components/work/WorkDetail';
import { ExperienceDetail } from '../src/components/experience/ExperienceDetail';
import { EducationSummary } from '../src/components/education/EducationSummary';
import { CertificationsBlock } from '../src/components/education/CertificationsBlock';
import { SkillsDetail } from '../src/components/skills/SkillsDetail';
import { AboutDetail } from '../src/components/about/AboutDetail';
import { projects } from '../src/data/projects';
import { roles } from '../src/data/experience';
import { degrees } from '../src/data/education';
import { certifications } from '../src/data/certifications';
import { skillGroups } from '../src/data/skills';

describe('detail components render seeded DB content', () => {
  it('WorkDetail lists every project', async () => {
    render(await WorkDetail());
    for (const p of projects) {
      expect(screen.getAllByText(p.title).length).toBeGreaterThan(0);
    }
  });

  it('ExperienceDetail lists every role', async () => {
    render(await ExperienceDetail());
    for (const r of roles) {
      expect(screen.getAllByText(r.organisation).length).toBeGreaterThan(0);
    }
  });

  // EducationDetail nests the async CertificationsBlock, which client-side React
  // cannot resolve in jsdom, so its halves are rendered separately
  it('EducationSummary lists every degree', async () => {
    render(await EducationSummary());
    for (const d of degrees) {
      expect(screen.getAllByText(d.qualification).length).toBeGreaterThan(0);
    }
    expect(screen.getByText(`+ ${certifications.length} certifications`)).toBeInTheDocument();
  });

  it('CertificationsBlock lists every certification', async () => {
    render(await CertificationsBlock());
    for (const c of certifications) {
      expect(screen.getAllByText(c.name).length).toBeGreaterThan(0);
    }
  });

  it('SkillsDetail lists every skill group', async () => {
    render(await SkillsDetail());
    for (const g of skillGroups) {
      expect(screen.getAllByText(g.heading).length).toBeGreaterThan(0);
    }
  });

  it('SkillsDetail renders an icon for a known skill', async () => {
    const { container } = render(await SkillsDetail());
    const badge = screen
      .getAllByText('TypeScript')
      .map((el) => el.closest('.skill-badge'))
      .find((el): el is HTMLElement => el !== null);
    expect(badge?.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('AboutDetail renders styled runs from jsonb', async () => {
    render(await AboutDetail());
    const strong = screen.getByText('Artificial Intelligence and application security');
    expect(strong.tagName).toBe('STRONG');
  });
});
