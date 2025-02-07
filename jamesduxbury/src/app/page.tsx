import Image from "next/image";

export const metadata = {
  title: "James Duxbury | Portfolio",
  description: "Welcome to my portfolio website."
};

export default function Home() {
  return (
    <main className="bg-background min-h-screen text-white flex flex-col items-center justify-center">
      <nav className="fixed top-0 left-10 right-10 flex items-center justify-between bg-background p-6">
        {/* Name Section */}
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">James Duxbury</span>
        </div>

        {/* Mobile Menu Button */}
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-10">
          <div className="flex space-x-10">
          <a
            href="#" className="relative text-white transition duration-300 hover:text-white
              before:absolute before:left-1/2 before:bottom-[2px] before:w-0 before:h-full
              before:bg-accent before:rounded-full before:opacity-50 
              before:transition-all before:duration-200 before:ease-in-out before:-translate-x-1/2 
              hover:before:w-[100%] hover:before:opacity-60 hover:before:blur-md hover:bg-opacity-100">
            About
          </a>
          <a
            href="#" className="relative text-white transition duration-300 hover:text-white
              before:absolute before:left-1/2 before:bottom-[2px] before:w-0 before:h-full
              before:bg-accent before:rounded-full before:opacity-50 
              before:transition-all before:duration-200 before:ease-in-out before:-translate-x-1/2 
              hover:before:w-[100%] hover:before:opacity-60 hover:before:blur-md hover:bg-opacity-100">
            Skills
          </a>
          <a
            href="#" className="relative text-white transition duration-300 hover:text-white
              before:absolute before:left-1/2 before:bottom-[2px] before:w-0 before:h-full
              before:bg-accent before:rounded-full before:opacity-50 
              before:transition-all before:duration-200 before:ease-in-out before:-translate-x-1/2 
              hover:before:w-[100%] hover:before:opacity-60 hover:before:blur-md hover:bg-opacity-100">
            Project
          </a>
          <a
            href="#" className="relative text-white transition duration-300 hover:text-white
              before:absolute before:left-1/2 before:bottom-[2px] before:w-0 before:h-full
              before:bg-accent before:rounded-full before:opacity-50 
              before:transition-all before:duration-200 before:ease-in-out before:-translate-x-1/2 
              hover:before:w-[100%] hover:before:opacity-60 hover:before:blur-md hover:bg-opacity-100">
            CV
          </a>
          </div>

          <div>
            <a
              href="#"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-accent border-accent 
                        hover:border-transparent hover:text-black hover:bg-accent 
                        transition duration-300 
                        hover:shadow-[0_0_15px_#00D9D9]">
              Contact
            </a>
          </div>
        </div>
      </nav>
    </main>
  );
}
