import React from 'react';

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
        <div className="relative items-center justify-between space-y-6 lg:flex lg:space-y-0">
          <div>
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent shadow-[0_0_15px_#3182ce]"></div>
            <div className="space-y-8 pl-10">
              <div>
                <h3 className="text-xl font-semibold">Software Engineer - AI Trainer</h3>
                <p className="text-lg">DataAnnotation | 2024 - Present</p>
                <ul className="text-md leading-7 text-gray-300">
                  <li className="mt-3">
                    Assisted with the training of multiple AI models, with a focus on code
                    generation
                  </li>
                  <li className="mt-3">
                    Conducted in-depth comparisons between AI-generated responses, evaluating SQL,
                    Python, JavaScript, and Java outputs.
                  </li>
                  <li className="mt-3">
                    Provided detailed feedback to improve model accuracy and consistency in various
                    coding languages.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Information Technology Support Technician</h3>
                <p className="text-lg">Snap-on | 2021 - Present</p>
                <ul className="text-md/0.1 leading-7 text-gray-300">
                  <li className="mt-3">
                    Led onboarding and training of new team members during a major transition,
                    ensuring proficiency in hardware and software support.
                  </li>
                  <li className="mt-3">
                    Acted as the main point of contact for issues with the proprietary POS system,
                    ensuring quick issue resolution.
                  </li>
                  <li className="mt-3">
                    Improved collaboration between US and UK teams, significantly reducing
                    resolution times through process enhancements.
                  </li>
                  <li className="mt-3">
                    Created SOPs that reduced error rates and streamlined repetitive tasks, boosting
                    operational efficiency.
                  </li>
                  <li className="mt-3">
                    Assisted in migrating hardware for 400+ users, developing user guides and
                    training to ensure a smooth transition.
                  </li>
                  <li className="mt-3">
                    Contributed to key projects, including the migration to Zendesk and the creation
                    of a web-based asset tracking system.
                  </li>
                  <li className="mt-3">
                    Maintained a 100% CSAT score and consistently met SLAs across departments.
                  </li>
                  <li className="mt-3">Champion RCI initiatives, streamlining processes.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Sales Consultant / Team Coach</h3>
                <p className="text-lg">Next | 2019 - 2021</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
