import { describe, expect, it } from 'vitest';
import { getSkillIcon } from '../src/components/skills/skillIcon';

describe('getSkillIcon', () => {
  it('resolves a cleanly slugified name', () => {
    const icon = getSkillIcon('TypeScript');
    expect(icon).not.toBeNull();
    expect(icon?.title).toBe('TypeScript');
    expect(icon?.path.length).toBeGreaterThan(0);
  });

  it('resolves a name via the override map', () => {
    const icon = getSkillIcon('Node.js');
    expect(icon).not.toBeNull();
    expect(icon?.title).toBe('Node.js');
  });

  it('returns null for an unknown name', () => {
    expect(getSkillIcon('Definitely Not A Real Skill')).toBeNull();
  });

  it('returns null for a suppressed collision name', () => {
    expect(getSkillIcon('C#')).toBeNull();
  });
});
