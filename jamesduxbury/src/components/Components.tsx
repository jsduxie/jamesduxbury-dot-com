import React from "react";
import { useState, useEffect } from "react";
import Image from 'next/image';


export function NavLinks() {
  return (
    <>
      <a href="#about" className="text-xl text-white hover:text-accent transition">About</a>
      <a href="#skills" className="text-xl text-white hover:text-accent transition">Skills</a>
      <a href="#projects" className="text-xl text-white hover:text-accent transition">Projects</a>
      <a href="#" className="text-xl text-white hover:text-accent transition">Education</a>
      <a href="#" className="text-xl text-white hover:text-accent transition">Experience</a>
      <a href="#" className="text-xl text-white hover:text-accent transition">CV</a>
      <CTAButton link="#" name="Contact" onClick={() => alert("Contact button clicked")} />
    </>
  );
}

interface CTAButtonProps {
  link: string;
  name: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}


interface CTAButtonProps {
  name: string;
  link: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  isMenuButton?: boolean;
}

export function CTAButton({ name, link, onClick, icon, isMenuButton }: CTAButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 rounded 
        ${isMenuButton 
          ? "border-none text-teal-200 hover:text-white" 
          : "border text-accent border-accent hover:border-transparent hover:text-black hover:bg-accent transition duration-300 hover:shadow-[0_0_15px_#00D9D9] text-xl"
        }`
      }
    >
      {icon ? icon : name}
    </button>
  );
}

export default function NavBar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-10 right-10 flex items-center justify-between bg-background p-6">
        {/* Name Section */}
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-3xl tracking-tight">James Duxbury</span>
        </div>

        {/* Mobile Menu Button */}
        <div className="block lg:hidden">
          <CTAButton name="Menu" isMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)} link='' icon={<svg className="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>} />
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center space-x-10">
          <NavLinks />
        </div>
      </nav>

      {/* Mobile */}
      {isMenuOpen && (
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-background flex flex-col items-center space-y-6 p-6">
        <NavLinks />
      </div>
      )}
    </>
  );
}

export function HeroBanner() {
    return (
        <section className="w-full flex flex-col lg:flex-row items-center justify-center text-white p-10 pt-40">
            
            <div className="lg:w-3/5 text-center lg:text-left space-y-3 p-4 px-10">
                <h2 className="text-2xl lg:text-3xl text-gray-300">Hello, I am</h2>
                <h1 className="text-4xl lg:text-6xl font-bold drop-shadow-[0_0_10px_#00D9D9] glitch">James Duxbury</h1>
                <p className="text-lg lg:text-xl text-gray-300 mb-5">
                    I am a third-year Computer Science MEng Student at Durham University. An aspiring software engineer with a passion for solving real-world problems and leveraging technology. 
                </p>
                <CTAButton name='Download my CV!' link='#' onClick={() => alert("CV button clicked")} />
            </div>

            <div className="lg:w-2/5 flex justify-center mt-6 lg:mt-0 relative">
                <div className="absolute w-[280px] h-[280px] bg-[#00D9D9] rounded-full blur-[120px] opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>

                <Image src="/images/profile-picture.png" alt="James Duxbury" width={300} height={300} className="border-2 border-accent shadow-[0_0_20px_#00D9D9] z-[2]" />
            </div>



        </section>
    )
}


export function About() {
    return (
        <section className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#00D9D9]" id="about">
            <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#00D9D9] rounded-full blur-[100px] bottom-[15%] left-[0%] top-1/2 right-1/2 z-[1]"></div>
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-accent mb-6">About Me</h2>
                <div className="lg:flex justify-between items-center space-y-6 lg:space-y-0">

                    <div className="lg:w-2/3 space-y-6">
                        <p className="text-lg lg:text-xl text-gray-300">
                        I have always had a function for learning about, breaking and fixing technology. I am a huge advocate for Rapid Continuous Improvement (RCI) initiatives.

                        I have always had a function for learning about, breaking and fixing technology. I am a huge advocate for Rapid Continuous Improvement (RCI) initiatives

                        I have always had a function for learning about, breaking and fixing technology. I am a huge advocate for Rapid Continuous Improvement (RCI) initiatives

                        I have always had a function for learning about, breaking and fixing technology. I am a huge advocate for Rapid Continuous Improvement (RCI) initiatives

                        I have always had a function for learning about, breaking and fixing technology. I am a huge advocate for Rapid Continuous Improvement (RCI) initiatives

                        I have always had a function for learning about, breaking and fixing technology. I am a huge advocate for Rapid Continuous Improvement (RCI) initiatives

                        I have always had a function for learning about, breaking and fixing technology. I am a huge advocate for Rapid Continuous Improvement (RCI) initiatives
                        </p>
                    </div>
                </div>
            </div>



        </section>
    )
}

export function Skills() {
    return (
        <section className="w-full bg-background py-12 text-white shadow-[0_0_15px_#00D9D9] relative" id="skills">
            <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#00D9D9] rounded-full blur-[100px] top-[15%] right-[0%]"></div>
            <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#00D9D9] rounded-full blur-[100px] bottom-[15%] left-[0%] z-[0]"></div>
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-accent mb-6">Skills</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-5">Programming Languages</h3>
                        <div className="flex flex-wrap gap-10">
                        {["Python", "JavaScript", "C", "C++", "C#"].map((skill) => (
                            <span key={skill} className="skill-badge mb-10">
                            {skill}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-5">Artificial Intelligence</h3>
                        <div className="flex flex-wrap gap-10">
                        {["PyTorch", "Scikit Learn"].map((skill) => (
                            <span key={skill} className="skill-badge mb-10">
                            {skill}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-5">Web Development</h3>
                        <div className="flex flex-wrap gap-10">
                        {["HTML", "CSS", "React", "Node.js", "Tailwind", "D3.js"].map((skill) => (
                            <span key={skill} className="skill-badge mb-10">
                            {skill}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-5">Dev Tools</h3>
                        <div className="flex flex-wrap gap-10">
                        {["Git", "GitHub", "Visual Studio Code", "IBM Cloud"].map((skill) => (
                            <span key={skill} className="skill-badge mb-10">
                            {skill}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-5">Python Libraries</h3>
                        <div className="flex flex-wrap gap-10">
                        {["Pandas", "NumPy", "Matplotlib", "OpenCV"].map((skill) => (
                            <span key={skill} className="skill-badge mb-10">
                            {skill}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>
                    
            </div>

        </section>
    )
}