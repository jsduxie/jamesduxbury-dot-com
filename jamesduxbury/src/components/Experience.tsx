import React from "react";

const Experience: React.FC = () => {
    return (
        <section className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#00D9D9]" id="experience">
        <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#00D9D9] rounded-full blur-[100px] top-[15%] right-[0%]"></div>
        <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#00D9D9] rounded-full blur-[100px] bottom-[15%] left-[0%]"></div>
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-accent mb-6">Experience</h2>
            <div className="lg:flex justify-between items-center space-y-6 lg:space-y-0 relative">

                <div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_15px_#00D9D9]"></div>
                <div className="space-y-8 pl-10">
                    <div>
                        <h3 className="text-xl font-semibold">Software Engineer - AI Trainer</h3>
                        <p className="text-lg">DataAnnotation | 2024 - Present</p>
                        <ul className="text-md text-gray-300">
                            <li>Assisted with the training of multiple AI models, with a focus on code generation</li>
                            <li>Conducted in-depth comparisons between AI-generated responses, evaluating SQL, Python, JavaScript, and Java outputs.</li>
                            <li>Provided detailed feedback to improve model accuracy and consistency in various coding languages.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Information Technology Support Technician</h3>
                        <p className="text-lg">Snap-on | 2021 - Present</p>
                        <p className="text-md text-gray-300">A* in Mathematics, Further Mathematics, Physics and Drama at A-level. A at AS-level in Computer Science. A* in the CyberEPQ. </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Sales Consultant / Team Coach</h3>
                        <p className="text-lg">Next | 2019 - 2021</p>
                        <p className="text-md text-gray-300">9 (A**) in Mathematics, Biology, Physics, Computer Science and Drama. 8 (A*) in Chemistry, English Literature and History. 7 (A) in English Language, French and Religious Studies. </p>
                    </div>
                </div>
                </div>
            </div>
        </div>
        
    </section>
    );
};

export default Experience;