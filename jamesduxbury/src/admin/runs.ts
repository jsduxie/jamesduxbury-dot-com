import type { AboutParagraph, AboutRun } from '@/data/about';
import { LINK_SCHEME } from '@/lib/href';

// links are matched first so [a](b) is not split on its inner punctuation; the scheme
// allowlist here means a javascript: url never tokenises as a link and stays literal
const LINK = `\\[[^\\]\\n]*\\]\\((?:${LINK_SCHEME})[^)\\s]*\\)`;
const STRONG = /\*\*[^*\n]+\*\*/.source;
const EM = /\*[^*\n]+\*/.source;
const MARKUP = new RegExp(`(${LINK}|${STRONG}|${EM})`, 'g');
const LINK_EXACT = /^\[([^\]\n]*)\]\(([^)\s]+)\)$/;

export function parseRuns(text: string): AboutParagraph {
  return text
    .split(MARKUP)
    .filter((part) => part !== '')
    .map((part): AboutRun => {
      if (part.startsWith('**') && part.endsWith('**')) return { strong: part.slice(2, -2) };
      const link = LINK_EXACT.exec(part);
      if (link) return { link: { text: link[1], href: link[2] } };
      if (part.startsWith('*') && part.endsWith('*')) return { em: part.slice(1, -1) };
      return part;
    });
}

export function serialiseRuns(runs: AboutParagraph): string {
  return runs
    .map((run) => {
      if (typeof run === 'string') return run;
      if ('strong' in run) return `**${run.strong}**`;
      if ('link' in run) return `[${run.link.text}](${run.link.href})`;
      return `*${run.em}*`;
    })
    .join('');
}
