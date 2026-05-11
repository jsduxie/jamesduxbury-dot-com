/**
 * Typed inline runs for About content. Avoids interpolating raw HTML strings
 * (and therefore the need for `dangerouslySetInnerHTML` in render code).
 */
export type AboutRun = string | { strong: string } | { em: string };
export type AboutParagraph = AboutRun[];

export const aboutParagraphs: AboutParagraph[] = [
  [
    'Final-year MEng Computer Science student at Durham University, specialising in ',
    { strong: 'Artificial Intelligence and application security' },
    '. Strong foundation in software engineering, data science, and machine learning research.',
  ],
  [
    'My dissertation, ',
    { em: 'FG-HAN' },
    ', investigates detecting Borderline Personality Disorder from Reddit posts using hierarchical attention networks with clinically grounded NLP features, balancing predictive performance with explainability. I recently completed a summer internship at Compare the Market, where I shipped a Vite + React dashboard and a JSONLogic-to-natural-language parser to improve knowledge transfer across technical and business teams.',
  ],
  [
    'Beyond research, I build things — ',
    { em: 'JSGrades' },
    ', a full-stack grade-tracking app on React, Node.js, and PostgreSQL; interactive geospatial tools for Artemis III lunar landing site analysis; and OpenCV pipelines for restoring damaged X-rays.',
  ],
  [
    { strong: 'Accredited Affiliate Member of the Chartered Institute of Information Security' },
    ' (AfCIIS) · ',
    { strong: 'ITIL 4 Foundation' },
    ' certified · ',
    { strong: 'A* in the CyberEPQ' },
    '.',
  ],
  ["Outside of work, I'm a big Formula 1 fan and always happy to talk race strategy."],
];
