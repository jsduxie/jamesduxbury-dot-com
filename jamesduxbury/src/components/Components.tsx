import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ContactModal from './Contact';
import Link from 'next/link';

export function NavLinks() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Link href="#about" className="text-xl text-white transition hover:text-accent">
        About
      </Link>
      <Link href="#skills" className="text-xl text-white transition hover:text-accent">
        Skills
      </Link>
      <Link href="#projects" className="text-xl text-white transition hover:text-accent">
        Projects
      </Link>
      <Link href="#education" className="text-xl text-white transition hover:text-accent">
        Education
      </Link>
      <Link href="#experience" className="text-xl text-white transition hover:text-accent">
        Experience
      </Link>
      <Link
        href="data/CV.pdf"
        download="James_Duxbury_CV.pdf"
        className="text-xl text-white transition hover:text-accent"
      >
        CV
      </Link>
      <ContactModal open={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
}

interface CTAButtonProps {
  name: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

interface CTAButtonProps {
  name: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  isMenuButton?: boolean;
  style?: string;
}

export function CTAButton({ name, onClick, icon, isMenuButton, style }: CTAButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded px-4 py-2 ${
        isMenuButton
          ? `border-none text-teal-200 hover:text-white ${style}`
          : `border border-accent text-xl text-accent transition duration-300 hover:border-transparent hover:bg-accent hover:text-black hover:shadow-[0_0_15px_#3182ce] ${style}`
      }`}
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-10 flex w-[100%] items-center justify-between bg-background p-3 pl-6 pr-6">
        {/* Name Section */}
        <div className="mr-6 flex flex-shrink-0 items-center text-white">
          <span className="text-3xl font-semibold tracking-tight">James Duxbury</span>
        </div>

        {/* Mobile Menu Button */}
        <div className="block lg:hidden">
          <CTAButton
            name="Menu"
            isMenuButton
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            icon={
              <svg
                className="h-5 w-5 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            }
          />
        </div>

        {/* Desktop */}
        <div className="hidden items-center space-x-10 lg:flex">
          <NavLinks />
        </div>
      </nav>

      {/* Mobile */}
      {isMenuOpen && (
        <div className="transition-discrete fixed left-0 right-0 top-10 z-[2] flex flex-col items-center space-y-6 bg-background p-6 ease-in-out lg:hidden">
          <NavLinks />
        </div>
      )}
    </>
  );
}

export function HeroBanner() {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-background p-10 pt-0 text-white lg:flex-row lg:pt-40">
      <div className="space-y-3 p-4 px-10 text-center lg:w-3/5 lg:text-left">
        <h2 className="text-2xl text-gray-300 lg:text-3xl">Hello, I am</h2>
        <h1 className="glitch text-4xl font-bold drop-shadow-[0_0_10px_#3182ce] lg:text-6xl">
          James Duxbury
        </h1>
        <p className="mb-5 text-lg text-gray-300 lg:text-xl">
          I am a third-year Computer Science MEng Student at Durham University. An aspiring software
          engineer with a passion for solving real-world problems and leveraging technology.
        </p>
        <CTAButton name="Download my CV!" onClick={() => window.open('data/CV.pdf')} />
      </div>

      <div className="relative mt-6 flex justify-center lg:mt-0 lg:w-2/5">
        <div className="absolute left-1/2 top-1/2 z-0 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#3182ce] opacity-50 blur-[120px]"></div>
        <Image
          src="/images/profile-picture.png"
          alt="James Duxbury"
          width={300}
          height={300}
          className="z-[2] border-2 border-accent shadow-[0_0_20px_#3182ce]"
        />
      </div>
    </section>
  );
}

export function About() {
  return (
    <section
      className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#3182ce]"
      id="about"
    >
      <div className="border-5 absolute bottom-[15%] left-[0%] right-1/2 top-1/2 z-[1] h-[200px] w-[200px] rounded-full border-accent bg-[#3182ce] blur-[100px]"></div>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 text-3xl font-bold text-accent">About Me</h2>
        <div className="items-center justify-between space-y-6 lg:flex lg:space-y-0">
          <div className="space-y-6 lg:w-2/3">
            <p className="text-lg text-gray-300 lg:text-xl">
              At University, I specialise in Artificial Intelligence, Data Science and Software
              Engineering. I am strongly passionate about leveraging AI to drive innovation and
              efficiency. With over three years of corporate IT experience, I have led training
              initiatives, optimated workflows and contributed to major projects. Also, as an AI
              Trainer for DataAnnotation, I have experience with analysing and evaluating LLM
              outputs, with a focus on code generation. I have a wide range of software projects
              from University, ranging from developing a RPG for IBM as part of a group project, to
              creating minimised deep learning models. I achieved 98% in both courseworks for my Web
              Development module, with one site being a full-stack marketplace for VW enthusiasts. I
              am always eager to expand my knowledge and contribute. For any opportunities or
              questions, feel free to reach out to me using the contact form!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section
      className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#3182ce]"
      id="skills"
    >
      <div className="border-5 absolute right-[0%] top-[15%] h-[200px] w-[200px] rounded-full border-accent bg-[#3182ce] blur-[100px]"></div>
      <div className="border-5 absolute bottom-[15%] left-[0%] z-[0] h-[200px] w-[200px] rounded-full border-accent bg-[#3182ce] blur-[100px]"></div>
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-3xl font-bold text-accent">Skills</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-1">
          <div>
            <h3 className="mb-5 text-2xl font-semibold text-white">Programming Languages</h3>
            <div className="flex flex-wrap gap-10">
              {['Python', 'JavaScript', 'C', 'C++', 'C#'].map((skill) => (
                <span key={skill} className="skill-badge mb-10">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-1">
          <div>
            <h3 className="mb-5 text-2xl font-semibold text-white">Artificial Intelligence</h3>
            <div className="flex flex-wrap gap-10">
              {['PyTorch', 'Scikit Learn'].map((skill) => (
                <span key={skill} className="skill-badge mb-10">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-1">
          <div>
            <h3 className="mb-5 text-2xl font-semibold text-white">Web Development</h3>
            <div className="flex flex-wrap gap-10">
              {['HTML', 'CSS', 'React', 'Node.js', 'Tailwind', 'D3.js'].map((skill) => (
                <span key={skill} className="skill-badge mb-10">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-1">
          <div>
            <h3 className="mb-5 text-2xl font-semibold text-white">Dev Tools</h3>
            <div className="flex flex-wrap gap-10">
              {['Git', 'GitHub', 'Visual Studio Code', 'IBM Cloud'].map((skill) => (
                <span key={skill} className="skill-badge mb-10">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-1">
          <div>
            <h3 className="mb-5 text-2xl font-semibold text-white">Python Libraries</h3>
            <div className="flex flex-wrap gap-10">
              {['Pandas', 'NumPy', 'Matplotlib', 'OpenCV'].map((skill) => (
                <span key={skill} className="skill-badge mb-10">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
