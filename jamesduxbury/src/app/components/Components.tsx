import React from "react";
import { useState, useEffect } from "react";
import Image from 'next/image';


export function NavLinks() {
  return (
    <>
      <a href="#about" className="text-xl text-white hover:text-accent transition">About</a>
      <a href="#" className="text-xl text-white hover:text-accent transition">Skills</a>
      <a href="#" className="text-xl text-white hover:text-accent transition">Projects</a>
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
            <div className="lg:w-3/5 text-center lg:text-left space-y-3 p-4">
                <h2 className="text-2xl lg:text-3xl text-gray-300">Hello, I am</h2>
                <h1 className="text-4xl lg:text-6xl font-bold text-accent drop-shadow-[0_0_10px_#00D9D9]">James Duxbury</h1>
                <p className="text-lg lg:text-xl text-gray-300 mb-5">
                    I am a third-year Computer Science MEng Student at Durham University. An aspiring software engineer with a passion for solving real-world problems and leveraging technology. 
                </p>
                <CTAButton name='Download my CV!' link='#' onClick={() => alert("CV button clicked")} />
            </div>

            <div className="lg:w-2/5 flex justify-center mt-6 lg:mt-0">
                <Image src="/images/profile-picture.png" alt="James Duxbury" width={300} height={300} className="border-2 border-accent shadow-[0_0_20px_#00D9D9]" />
            </div>



        </section>
    )
}

