import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CTAButton } from './Components';

interface Project {
  imagePath: string;
  title: string;
  techStack: string[];
  description: string;
  githubLink: string;
  liveLink: string | null;
}

const ProjectCard: React.FC<Project> = ({
  imagePath,
  title,
  techStack,
  description,
  githubLink,
  liveLink,
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 rounded-lg bg-white p-10 shadow-lg lg:flex-row dark:bg-gray-800">
      <div
        className="relative mt-6 flex justify-center lg:mt-0 lg:w-2/5"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute left-1/2 top-1/2 z-0 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#3182ce] opacity-50 blur-[100px]"></div>

        <div
          className="hover:rotate-y-0 transform-gpu transition-transform duration-500"
          style={{
            transform: 'rotateY(20deg) rotateX(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <Image
            src={imagePath}
            alt={title}
            width={250}
            height={250}
            className="rounded-lg border-2 border-accent object-cover shadow-[0_0_20px_#3182ce]"
          />
        </div>
      </div>

      <div className="space-y-3 p-4 px-10 text-center lg:w-3/5 lg:text-left">
        <h3 className="text-2xl font-semibold text-gray-900 lg:text-3xl dark:text-white">
          {title}
        </h3>
        <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
          Tech Stack: {techStack.join(', ')}
        </p>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>

        <div className="w-45 flex flex-wrap items-center justify-around">
          <CTAButton
            name="View on GitHub"
            onClick={() => {
              window.open(githubLink, '_blank');
            }}
          />
          {liveLink && (
            <CTAButton
              name="Live"
              onClick={() => {
                window.open(liveLink, '_blank');
              }}
            />
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
            <ProjectCard
              key={index}
              imagePath={project.imagePath}
              title={project.title}
              techStack={project.techStack}
              description={project.description}
              githubLink={project.githubLink}
              liveLink={project.liveLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
