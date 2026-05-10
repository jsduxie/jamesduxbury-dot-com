export interface Degree {
  qualification: string;
  institution: string;
  period: string;
  yearEnd: number;
  bullets?: string[];
}

export const degrees: Degree[] = [
  {
    qualification: 'Integrated MEng Computer Science',
    institution: 'Durham University',
    period: 'October 2022 — July 2026',
    yearEnd: 2026,
    bullets: [
      'On track for First Class Honours; strong performance in Software Engineering, Data Science and AI modules.',
      'Project Lead on an IBM-sponsored software engineering project (grade 80%), implementing NPC and player logic in an agile, team-based environment.',
      'Achieved 98% in both full-stack web development courseworks.',
      'Dissertation: FG-HAN — hierarchical attention networks with clinically grounded NLP features for Borderline Personality Disorder detection on Reddit.',
    ],
  },
  {
    qualification: 'GCE A-Levels',
    institution: 'Mark Rutherford School',
    period: 'September 2019 — July 2021',
    yearEnd: 2021,
    bullets: [
      'A* in Mathematics, Further Mathematics, Physics, Drama.',
      'A* in the CyberEPQ · A at AS-level in Computer Science.',
    ],
  },
];
