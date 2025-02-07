import React from "react";
import { useState, useEffect } from "react";


export function NavLinks() {
  return (
    <>
      <a href="#" className="text-xl text-white hover:text-accent transition">About</a>
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
