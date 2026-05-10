export type ProjectStatus = 'live' | 'dev' | 'exam' | 'shipped';

export interface ProjectMetric {
  label: string;
  value: string;
  /** 0..1 fill ratio for the visual bar */
  ratio?: number;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  underExam?: boolean;
  /** Inclusive start year used for the homepage timeline strip */
  yearStart: number;
  /** Inclusive end year. Use the current year for ongoing work. */
  yearEnd: number;
  techStack: string[];
  highlights: string[];
  imagePath?: string;
  githubLink?: string;
  liveLink?: string;
  metrics?: ProjectMetric[];
}

export const projects: Project[] = [
  {
    slug: 'fg-han',
    title: 'FG-HAN',
    subtitle: 'Feature-guided hierarchical attention for BPD detection',
    status: 'dev',
    underExam: true,
    yearStart: 2025,
    yearEnd: 2026,
    techStack: ['Python', 'PyTorch', 'HuggingFace', 'LIWC', 'NRC-VAD', 'Empath', 'scikit-learn'],
    highlights: [
      'Macro F1 0.874, matching the strongest transformer baselines on Reddit-based binary classification (BPD vs control).',
      "Composed JSD 0.645 vs 0.380 against the unguided counterpart (p < 0.001) — heads aligned to the interpersonal, emotional, and behavioural dimensions of Sanislow's three-factor model.",
      'Evaluated 13 architectures from logistic regression to pretrained transformers, alongside a cross-architecture faithfulness comparison of four attribution methods.',
    ],
    metrics: [
      { label: 'F1 score', value: '0.874', ratio: 0.874 },
      { label: 'Composed JSD', value: '0.645', ratio: 0.645 },
      { label: 'Baseline JSD', value: '0.380', ratio: 0.38 },
      { label: 'p-value', value: '< 0.001' },
    ],
  },
  {
    slug: 'jsgrades',
    title: 'JSGrades',
    subtitle: 'Qualification tracker (in progress)',
    status: 'live',
    yearStart: 2025,
    yearEnd: 2026,
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Firebase', 'Jest', 'Vercel', 'Render', 'Neon'],
    highlights: [
      'Full-stack web application for degree grade forecasting, task tracking, and performance visualisation.',
      'Cloud-native CI/CD across Vercel (frontend), Render (backend), and Neon (PostgreSQL).',
      'Firebase authentication, Jest test suite, Qodana + ESLint + Prettier enforcing code quality.',
    ],
  },
  {
    slug: 'researcher-agent',
    title: 'Researcher Agent',
    subtitle: 'Semantic Scholar paper monitor',
    status: 'shipped',
    yearStart: 2025,
    yearEnd: 2025,
    techStack: ['Python', 'Semantic Scholar API', 'Gemini AI', 'GitHub Actions'],
    highlights: [
      'Automated research-monitoring agent tracking new publications across configurable topics via the Semantic Scholar API.',
      'Daily email digests summarised and relevance-filtered by Gemini AI — built to surface BPD and mental-health NLP literature during dissertation.',
      'Runs on a GitHub Actions cron, with a typed test harness and dry-run mode for local development.',
    ],
    githubLink: 'https://github.com/jsduxie/researcher-agent',
  },
  {
    slug: 'xray-image-repair',
    title: 'X-Ray Image Repair',
    subtitle: 'Image processing coursework',
    status: 'shipped',
    yearStart: 2024,
    yearEnd: 2024,
    techStack: ['Python', 'OpenCV', 'NumPy'],
    highlights: [
      "Boosted a pre-trained classifier's accuracy from 55% to 90% by repairing artificially damaged X-ray images.",
      "Applied Canny edge detection to identify damaged regions and Criminisi's inpainting algorithm for realistic restoration.",
      'Coursework awarded a first-class grade.',
    ],
    imagePath: '/images/projects/xray-image-repair.png',
    githubLink: 'https://github.com/jsduxie/opencv-xray-repair',
  },
  {
    slug: 'artemis-iii',
    title: 'Artemis III Landing Site Analysis',
    subtitle: 'Advanced visualisation coursework',
    status: 'dev',
    underExam: true,
    yearStart: 2025,
    yearEnd: 2025,
    techStack: ['Python', 'PyGMT', 'LOLA Elevation Data'],
    highlights: [
      "Interactive geospatial analysis tool evaluating candidate landing sites for NASA's Artemis III mission at the lunar south pole.",
      "Slope computation via Horn's (1981) kernel with latitude correction, paired with TOPSIS-based multi-criteria suitability scoring.",
      'Two interactive visualisation tools for terrain rendering, illumination analysis, and candidate site comparison.',
    ],
  },
];
