// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/db/queries', () => ({
  getAbout: vi.fn(async () => []),
  getDegrees: vi.fn(async () => []),
  getCertifications: vi.fn(async () => []),
}));

import { AboutSummary } from '../src/components/about/AboutSummary';
import { EducationSummary } from '../src/components/education/EducationSummary';

describe('summary footers with no extra content', () => {
  it('AboutSummary hides the paragraph count when empty', async () => {
    render(await AboutSummary());
    expect(screen.queryByText(/more paragraphs/)).toBeNull();
    expect(screen.queryByText(/-\d/)).toBeNull();
    expect(screen.getByText('read more')).toBeInTheDocument();
  });

  it('EducationSummary hides the certification count when empty', async () => {
    render(await EducationSummary());
    expect(screen.queryByText(/certifications/)).toBeNull();
    expect(screen.getByText('view all')).toBeInTheDocument();
  });
});
