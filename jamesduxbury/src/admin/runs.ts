import type { AboutParagraph, AboutRun } from '@/data/about';

// splits markup into plain, strong, and em runs
const MARKUP = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function parseRuns(text: string): AboutParagraph {
  return text
    .split(MARKUP)
    .filter((part) => part !== '')
    .map((part): AboutRun => {
      if (part.startsWith('**') && part.endsWith('**')) return { strong: part.slice(2, -2) };
      if (part.startsWith('*') && part.endsWith('*')) return { em: part.slice(1, -1) };
      return part;
    });
}

export function serialiseRuns(runs: AboutParagraph): string {
  return runs
    .map((run) => {
      if (typeof run === 'string') return run;
      if ('strong' in run) return `**${run.strong}**`;
      return `*${run.em}*`;
    })
    .join('');
}
