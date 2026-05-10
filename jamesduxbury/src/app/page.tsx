'use client';
import React from 'react';
import NavBar, { HeroBanner, About, Skills } from '@/components/Components';
import { Projects } from '@/components/Projects';
import Education from '@/components/Education';
import Experience from '@/components/Experience';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col items-center justify-center pt-20 text-white backdrop-blur-lg">
        <HeroBanner />
        <hr className="my-6 border-t-2 border-accent" />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Experience />
      </main>
    </>
  );
}
