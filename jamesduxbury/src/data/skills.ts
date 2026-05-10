export interface SkillGroup {
  heading: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    heading: 'Languages & Frameworks',
    skills: [
      'Python',
      'JavaScript',
      'TypeScript',
      'C',
      'C++',
      'C#',
      'Haskell',
      'React',
      'Node.js',
      'Jest',
    ],
  },
  {
    heading: 'AI & Data Science',
    skills: ['PyTorch', 'scikit-learn', 'OpenCV', 'Pandas', 'NumPy', 'Matplotlib'],
  },
  {
    heading: 'Cloud & Infrastructure',
    skills: ['Git', 'GitHub', 'GitLab CI/CD', 'Docker', 'AWS', 'Vercel', 'Render', 'Neon', 'Linux'],
  },
  {
    heading: 'Development Practices',
    skills: ['Agile', 'TDD', 'Pair / Mob Programming', 'Code Review'],
  },
  {
    heading: 'AI Development Tools',
    skills: ['Windsurf', 'Cursor', 'Claude Code'],
  },
];
