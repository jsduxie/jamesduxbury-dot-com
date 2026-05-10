export interface Role {
  title: string;
  organisation: string;
  meta?: string;
  period: string;
  /** Used for ordering; higher = more recent. */
  yearStart: number;
  yearEnd: number | 'present';
  bullets?: string[];
}

export const roles: Role[] = [
  {
    title: 'Software Engineer',
    organisation: 'Compare the Market',
    meta: 'Internship · Peterborough',
    period: 'July 2025 — September 2025',
    yearStart: 2025,
    yearEnd: 2025,
    bullets: [
      'Designed and developed a Vite + React dashboard enabling non-technical users to visualise and explore complex question sets across 9 products, reducing reliance on developers for data retrieval.',
      'Engineered a recursive parsing algorithm to translate JSONLogic rules into natural-language bullet points, generalising across diverse logical expressions and business operators.',
      'Led a mob-programming intern project re-engineering a legacy internal tool with modern UI, advanced filtering, and maintainability improvements for future system migration.',
      'Implemented and optimised GitLab CI/CD pipelines, enforcing automated testing and code-quality checks to accelerate development workflows.',
      'Applied AI-assisted development tools (Windsurf, Cursor) to streamline debugging, refactor for scalability, and auto-generate test cases — enabling greater focus on long-term architecture.',
    ],
  },
  {
    title: 'Software Engineer — AI Trainer',
    organisation: 'DataAnnotation',
    meta: 'Contract · Remote',
    period: 'March 2024 — Present',
    yearStart: 2024,
    yearEnd: 'present',
    bullets: [
      'Debugged and optimised LLM-generated Python, JavaScript, and SQL code, improving accuracy and reliability of model outputs.',
      'Delivered structured feedback on syntax, logic, and explanatory text, directly enhancing training-data quality for large-scale model fine-tuning.',
      'Applied systematic debugging and problem decomposition to resolve complex logical errors in AI-generated code.',
    ],
  },
  {
    title: 'Information Technology Support Technician',
    organisation: 'Snap-on Tools',
    meta: 'Remote',
    period: 'October 2021 — Present',
    yearStart: 2021,
    yearEnd: 'present',
    bullets: [
      'Built and deployed a Python automation tool to audit and clean enterprise asset databases, cutting data errors across 500+ users.',
      'Developed a Python GUI application to automate Exchange 365 migrations for 400+ users, reducing manual effort by 70%.',
      'Supported development of a custom web-based asset tracking system, streamlining internal infrastructure for distributed teams.',
    ],
  },
  {
    title: 'Sales Consultant',
    organisation: 'Next',
    meta: 'Bedford',
    period: 'September 2019 — October 2021',
    yearStart: 2019,
    yearEnd: 2021,
  },
];
