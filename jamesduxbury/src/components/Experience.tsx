import React from "react";

const Experience: React.FC = () => {
    return (
        <section className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#3182ce]" id="experience">
        <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#3182ce] rounded-full blur-[100px] top-[15%] right-[0%]"></div>
        <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#3182ce] rounded-full blur-[100px] bottom-[15%] left-[0%]"></div>
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-accent mb-6">Experience</h2>
            <div className="lg:flex justify-between items-center space-y-6 lg:space-y-0 relative">

                <div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_15px_#3182ce]"></div>
                <div className="space-y-8 pl-10">
                    <div>
                        <h3 className="text-xl font-semibold">Software Engineer - AI Trainer</h3>
                        <p className="text-lg">DataAnnotation | 2024 - Present</p>
                        <ul className="text-md text-gray-300 leading-10">
                            <li>Assisted with the training of multiple AI models, with a focus on code generation</li>
                            <li>Conducted in-depth comparisons between AI-generated responses, evaluating SQL, Python, JavaScript, and Java outputs.</li>
                            <li>Provided detailed feedback to improve model accuracy and consistency in various coding languages.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Information Technology Support Technician</h3>
                        <p className="text-lg">Snap-on | 2021 - Present</p>
                        <ul className="text-md text-gray-300 leading-10">
                            <li>Led onboarding and training of new team members during a major transition, ensuring proficiency in hardware and software support.</li>
                            <li>Acted as the main point of contact for issues with the proprietary POS system, ensuring quick issue resolution.</li>
                            <li>Improved collaboration between US and UK teams, significantly reducing resolution times through process enhancements.</li>
                            <li>Created SOPs that reduced error rates and streamlined repetitive tasks, boosting operational efficiency.</li>
                            <li>Assisted in migrating hardware for 400+ users, developing user guides and training to ensure a smooth transition.</li>
                            <li>Contributed to key projects, including the migration to Zendesk and the creation of a web-based asset tracking system.</li>
                            <li>Maintained a 100% CSAT score and consistently met SLAs across departments.</li>
                            <li>Champion RCI initiatives, streamlining processes.</li>
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