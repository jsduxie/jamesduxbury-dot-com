/**
 * Typed inline runs for About content. Avoids interpolating raw HTML strings
 * (and therefore the need for `dangerouslySetInnerHTML` in render code).
 */
export type AboutRun =
  | string
  | { strong: string }
  | { em: string }
  | { code: string }
  | { link: { text: string; href: string } };
export type AboutParagraph = AboutRun[];

// rich text storage: a paragraph/heading is runs, a list is rows of runs, an image is a blob
export type Block =
  | { kind: 'p'; runs: AboutRun[] }
  | { kind: 'heading'; runs: AboutRun[] }
  | { kind: 'list'; items: AboutRun[][] }
  | { kind: 'image'; url: string; alt: string };
export type Prose = Block[];

export type Feature = 'bold' | 'italic' | 'code' | 'link' | 'list' | 'heading' | 'image';
export type Features = Record<Feature, boolean>;

export function runText(paragraph: AboutRun[]): string {
  return paragraph
    .map((run) => {
      if (typeof run === 'string') return run;
      if ('strong' in run) return run.strong;
      if ('em' in run) return run.em;
      if ('code' in run) return run.code;
      return run.link.text;
    })
    .join('');
}

export const aboutBlocks: Block[] = [
  {
    kind: 'p',
    runs: [
      'Final-year MEng Computer Science student at Durham University, specialising in ',
      { strong: 'Artificial Intelligence and application security' },
      '. Strong foundation in software engineering, data science, and machine learning research.',
    ],
  },
  {
    kind: 'p',
    runs: [
      'My dissertation, ',
      { em: 'FG-HAN' },
      ', investigates detecting Borderline Personality Disorder from Reddit posts using hierarchical attention networks with clinically grounded NLP features, balancing predictive performance with explainability. I recently completed a summer internship at Compare the Market, where I shipped a Vite + React dashboard and a JSONLogic-to-natural-language parser to improve knowledge transfer across technical and business teams.',
    ],
  },
  {
    kind: 'p',
    runs: [
      'Beyond research, I build things — ',
      { em: 'JSGrades' },
      ', a full-stack grade-tracking app on React, Node.js, and PostgreSQL; interactive geospatial tools for Artemis III lunar landing site analysis; and OpenCV pipelines for restoring damaged X-rays.',
    ],
  },
  {
    kind: 'p',
    runs: [
      { strong: 'Accredited Affiliate Member of the Chartered Institute of Information Security' },
      ' (AfCIIS) · ',
      { strong: 'ITIL 4 Foundation' },
      ' certified · ',
      { strong: 'A* in the CyberEPQ' },
      '.',
    ],
  },
  {
    kind: 'p',
    runs: ["Outside of work, I'm a big Formula 1 fan and always happy to talk race strategy."],
  },
];
