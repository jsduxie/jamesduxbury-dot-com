"use client";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import NavBar from "./components/Components.tsx";



export default function Home() {

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
    <main className="bg-background min-h-screen text-white flex flex-col items-center justify-center">
      <NavBar />
    </main>
  );
}
