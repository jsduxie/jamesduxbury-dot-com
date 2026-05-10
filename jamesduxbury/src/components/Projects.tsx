import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CTAButton } from './Components';

interface Project {
  title: string;
  subtitle?: string;
  techStack: string[];
  highlights: string[];
  imagePath?: string;
  githubLink?: string;
  liveLink?: string | null;
  comingSoon?: boolean;
}

const ProjectCard: React.FC<Project> = ({
  title,
  subtitle,
  techStack,
  highlights,
  imagePath,
  githubLink,
  liveLink,
  comingSoon,
}) => {
  const hasImage = Boolean(imagePath);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 rounded-lg bg-white p-10 shadow-lg lg:flex-row dark:bg-gray-800">
      {hasImage && (
        <div className="relative mt-6 flex justify-center lg:mt-0 lg:w-2/5">
          <div className="absolute left-1/2 top-1/2 z-0 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#3182ce] opacity-50 blur-[100px]"></div>
          <Image
            src={imagePath as string}
            alt={title}
            width={250}
            height={250}
            className="rounded-lg border-2 border-accent object-cover shadow-[0_0_20px_#3182ce]"
          />
        </div>
      )}

      <div
        className={`space-y-3 p-4 px-10 text-center lg:text-left ${hasImage ? 'lg:w-3/5' : 'lg:w-full'}`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <h3 className="text-2xl font-semibold text-gray-900 lg:text-3xl dark:text-white">
            {title}
          </h3>
          {comingSoon && (
            <span className="rounded-full border border-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent shadow-[0_0_10px_#3182ce]">
              Under examination
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-md font-medium text-gray-700 dark:text-gray-400">{subtitle}</p>
        )}
        <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
          Tech: {techStack.join(' · ')}
        </p>
        <ul className="list-disc space-y-2 pl-5 text-left text-gray-700 dark:text-gray-300">
          {highlights.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
          {githubLink && (
            <CTAButton
              name="View on GitHub"
              onClick={() => {
                window.open(githubLink, '_blank');
              }}
            />
          )}
          {liveLink && (
            <CTAButton
              name="Live"
              onClick={() => {
                window.open(liveLink, '_blank');
              }}
            />
          )}
          {comingSoon && !githubLink && (
            <p className="text-sm italic text-gray-500 dark:text-gray-400">
              Code and full results to follow after examination.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/data/projects.json');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#3182ce]"
      id="projects"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-3xl font-bold text-accent">Projects</h2>
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};
