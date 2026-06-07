import { Widget } from '@/components/console/Widget';
import { renderRun } from '@/components/about/renderRun';
import { getArchitectureSections } from '@/db/queries';
import type { ArchitectureSection } from '@/data/architecture';
import { ArchDiagram } from './ArchDiagram';

function Paragraphs({ sections }: { sections: ArchitectureSection[] }) {
  return (
    <>
      {sections.map((s, i) =>
        s.body.map((p, j) => (
          <p key={`${i}-${j}`} className="text-sm leading-relaxed text-text/85 sm:text-base">
            {p.map(renderRun)}
          </p>
        )),
      )}
    </>
  );
}

export async function ArchitectureDetail() {
  const sections = await getArchitectureSections();
  const byKind = (kind: ArchitectureSection['kind']) => sections.filter((s) => s.kind === kind);

  return (
    <Widget channel="07" label="ARCHITECTURE" id="architecture">
      <div className="space-y-4 px-4 py-6 sm:px-6">
        <Paragraphs sections={byKind('intro')} />
        {byKind('stack').map((s, i) => (
          <p key={i} className="font-mono text-xs text-muted">
            {s.body.flat().map(renderRun)}
          </p>
        ))}
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">system</h3>
        <div className="mt-4">
          <ArchDiagram />
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 sm:px-6">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          design decisions
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {byKind('decision').map((d, i) => (
            <div key={d.title ?? i} className="border border-border bg-bg/40 px-4 py-4">
              <h4 className="font-mono text-sm uppercase tracking-[0.15em] text-accent">
                {d.title}
              </h4>
              {d.body.map((p, j) => (
                <p key={j} className="mt-2 text-sm leading-relaxed text-text/85">
                  {p.map(renderRun)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-border px-4 py-6 sm:px-6">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          how it was built
        </h3>
        <Paragraphs sections={byKind('build')} />
      </div>
    </Widget>
  );
}
