import React from 'react';

interface Role {
  title: string;
  organisation: string;
  meta?: string;
  period: string;
  bullets?: string[];
}

const ROLES: Role[] = [
  {
    title: 'Software Engineer',
    organisation: 'Compare the Market',
    meta: 'Internship · Peterborough',
    period: 'July 2025 – September 2025',
    bullets: [
      'Designed and developed a Vite + React dashboard enabling non-technical users to visualise and explore complex question sets across 9 products, reducing reliance on developers for data retrieval.',
      'Engineered a recursive parsing algorithm to translate JSONLogic rules into natural-language bullet points, generalising across diverse logical expressions and business operators.',
      'Led a mob-programming intern project re-engineering a legacy internal tool with modern UI, advanced filtering, and maintainability improvements for future system migration.',
      'Implemented and optimised GitLab CI/CD pipelines, enforcing automated testing and code-quality checks to accelerate development workflows.',
      'Applied AI-assisted development tools (Windsurf, Cursor) to streamline debugging, refactor for scalability, and auto-generate test cases — enabling greater focus on long-term architecture.',
    ],
  },
  {
    title: 'Software Engineer — AI Trainer',
    organisation: 'DataAnnotation',
    meta: 'Contract · Remote',
    period: 'March 2024 – Present',
    bullets: [
      'Debugged and optimised LLM-generated Python, JavaScript, and SQL code, improving accuracy and reliability of model outputs.',
      'Delivered structured feedback on syntax, logic, and explanatory text, directly enhancing training-data quality for large-scale model fine-tuning.',
      'Applied systematic debugging and problem decomposition to resolve complex logical errors in AI-generated code.',
    ],
  },
  {
    title: 'Information Technology Support Technician',
    organisation: 'Snap-on Tools',
    meta: 'Remote',
    period: 'October 2021 – Present',
    bullets: [
      'Built and deployed a Python automation tool to audit and clean enterprise asset databases, cutting data errors across 500+ users.',
      'Developed a Python GUI application to automate Exchange 365 migrations for 400+ users, reducing manual effort by 70%.',
      'Supported development of a custom web-based asset tracking system, streamlining internal infrastructure for distributed teams.',
    ],
  },
  {
    title: 'Sales Consultant',
    organisation: 'Next',
    meta: 'Bedford',
    period: 'September 2019 – October 2021',
  },
];

const Experience: React.FC = () => {
  return (
    <section
      className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#3182ce]"
      id="experience"
    >
      <div className="border-5 absolute right-[0%] top-[15%] h-[200px] w-[200px] rounded-full border-accent bg-[#3182ce] blur-[100px]"></div>
      <div className="border-5 absolute bottom-[15%] left-[0%] h-[200px] w-[200px] rounded-full border-accent bg-[#3182ce] blur-[100px]"></div>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 text-3xl font-bold text-accent">Experience</h2>
        <div className="relative">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent shadow-[0_0_15px_#3182ce]"></div>
          <div className="space-y-10 pl-10">
            {ROLES.map((role) => (
              <div key={`${role.organisation}-${role.period}`}>
                <h3 className="text-xl font-semibold">{role.title}</h3>
                <p className="text-lg">
                  {role.organisation}
                  {role.meta && <span className="text-gray-400"> · {role.meta}</span>}
                </p>
                <p className="text-sm text-gray-400">{role.period}</p>
                {role.bullets && (
                  <ul className="text-md mt-3 list-disc space-y-1 pl-5 leading-7 text-gray-300">
                    {role.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
