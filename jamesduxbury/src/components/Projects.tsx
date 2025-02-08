import React from "react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { CTAButton } from "./Components";

interface Project {
    imagePath: string;
    title: string;
    techStack: string[];
    description: string;
    githubLink: string;
}

const ProjectCard: React.FC<Project> = ({ imagePath, title, techStack, description, githubLink }) => {
    return (
      <div className="w-full flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 gap-8">
        
        <div className="lg:w-2/5 flex justify-center mt-6 lg:mt-0 relative" style={{ perspective: "1000px" }}>
        <div className="absolute w-[200px] h-[200px] bg-[#00D9D9] rounded-full blur-[100px] opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>

        <div 
            className="transform-gpu transition-transform duration-500 hover:rotate-y-0" 
            style={{
            transform: "rotateY(20deg) rotateX(0deg)",
            transformStyle: "preserve-3d"
            }}
        >
            <Image 
            src={imagePath} 
            alt={title} 
            width={250} 
            height={250} 
            className="border-2 border-accent shadow-[0_0_20px_#00D9D9] rounded-lg object-cover"
            />
        </div>
        </div>

        <div className="lg:w-3/5 text-center lg:text-left space-y-3 p-4 px-10">
          <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-300">Tech Stack: {techStack.join(', ')}</p>
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
  
          <CTAButton name="View on GitHub" link={githubLink} onClick={() => {window.open(githubLink, '_blank')}} />
        </div>
  
      </div>
    );
  };
  

export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
        try {
            const res = await fetch('/projects.json');
            if (res.ok) {
            const data = await res.json();
            setProjects(data);
            } else {
            console.error("Failed to fetch projects");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
        };
    
        fetchProjects();
    }, []);

    return (
        <section className="w-full bg-background py-12 text-white shadow-[0_0_15px_#00D9D9] relative" id="projects">
            
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-accent mb-6">Projects</h2>
                <div className="space-y-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} imagePath={project.imagePath} title={project.title} techStack={project.techStack}
                        description={project.description} githubLink={project.githubLink} />
                    ))}
                </div>
            </div>
        </section>
    );   
}