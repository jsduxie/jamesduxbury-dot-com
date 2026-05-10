import { Widget } from '@/components/console/Widget';
import { ProjectRow } from './ProjectRow';
import { ProjectTimeline } from './ProjectTimeline';
import { projects } from '@/data/projects';

export const WorkDetail: React.FC = () => (
  <Widget channel="02" label="WORK" count={projects.length} id="work">
    <ProjectTimeline projects={projects} />
    {projects.map((project, i) => (
      <ProjectRow key={project.slug} project={project} index={i} variant="detail" />
    ))}
  </Widget>
);
