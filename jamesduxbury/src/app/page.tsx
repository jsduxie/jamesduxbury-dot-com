"use client";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import NavBar, { HeroBanner, About, Skills } from "@/components/Components";
import { Projects } from "@/components/Projects";
import Education from "@/components/Education";
import Experience from "@/components/Experience";



export default function Home() {

  
  return (
    <main className="text-white flex flex-col items-center justify-center pt-20 backdrop-blur-lg">
      <NavBar />
      <HeroBanner />
      <hr className="border-t-2 border-accent my-6" />
      <About />
      <Skills />
      <Projects />
      <Education />
      <Experience />
      

    </main>
  );
}
