import type { Block } from './about';

export interface CaseStudy {
  projectSlug: string;
  problem: Block[];
  approach: Block[];
  outcome?: Block[];
  imagePath?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    projectSlug: 'researcher-agent',
    problem: [
      {
        kind: 'p',
        runs: [
          'Keeping up with the literature for an MEng thesis on ',
          { strong: 'mental health classification and explainability' },
          ' meant running the same Semantic Scholar searches most mornings and skimming dozens of abstracts, most of them irrelevant.',
        ],
      },
      {
        kind: 'p',
        runs: [
          'The search needed automating end to end: fetch new papers, judge their relevance, summarise them, and land the result in my inbox before the day starts.',
        ],
      },
    ],
    approach: [
      {
        kind: 'p',
        runs: [
          'A Python pipeline on a daily cron. A fetcher polls the ',
          { strong: 'Semantic Scholar API' },
          ' for fresh papers per configured query, a scorer asks ',
          { strong: 'Gemini Flash' },
          ' to rate relevance against the thesis topics, and a summariser writes the digest that is emailed out.',
        ],
      },
      {
        kind: 'p',
        runs: [
          'Pipeline behaviour lives in an ',
          { em: 'app_config' },
          ' table in Neon Postgres, edited from a dashboard page. Swapping the Gemini model or changing a query is a config edit, not a deploy.',
        ],
      },
      {
        kind: 'p',
        runs: [
          'CI enforces ',
          { strong: '95% total coverage' },
          ' with a 90% per-module floor, plus integration tests against a separate Neon branch.',
        ],
      },
    ],
    outcome: [
      {
        kind: 'p',
        runs: [
          'A scored, summarised digest arrives every morning. The reading loop takes minutes instead of an hour, and query or model changes never touch the code.',
        ],
      },
    ],
  },
  {
    projectSlug: 'jamesduxbury-dot-com',
    problem: [
      {
        kind: 'p',
        runs: [
          'This site began as a static portfolio: every copy tweak, new role, or project update meant a code change and a redeploy. The content needed to be editable from anywhere, without giving up the engineered feel of the site.',
        ],
      },
    ],
    approach: [
      {
        kind: 'p',
        runs: [
          'Rebuilt on ',
          { strong: 'Next.js 15' },
          ' with all content in ',
          { strong: 'Neon Postgres' },
          ' accessed through raw tagged-template SQL. No ORM: the whole data layer is two readable files.',
        ],
      },
      {
        kind: 'p',
        runs: [
          'The admin console is schema-driven: each section is field config plus a Zod schema, and the list, create, edit, delete pages, forms, and SQL are all generic. Sign-in is GitHub OAuth with a single-account allowlist checked at four layers. Saves call ',
          { em: 'revalidatePath' },
          ', so public pages update instantly while normal traffic stays ISR-cached.',
        ],
      },
      {
        kind: 'p',
        runs: [
          'First-party analytics with no cookies or IP addresses feed an admin dashboard, and site images live in Vercel Blob with upload, replace, and delete handled by the admin kit.',
        ],
      },
    ],
    outcome: [
      {
        kind: 'p',
        runs: [
          'Content edits go live in seconds from a phone. The build carries 200+ tests with enforced coverage thresholds, CI against a Neon branch, and a deploy that migrates its own database first.',
        ],
      },
    ],
  },
];
