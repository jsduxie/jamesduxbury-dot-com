"use client";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import NavBar, { HeroBanner, About, Skills } from "./components/Components";



export default function Home() {

  
  return (
    <main className="text-white flex flex-col items-center justify-center pt-20 backdrop-blur-lg">
      <NavBar />
      <HeroBanner />
      <hr className="border-t-2 border-accent my-6" />
      <About />
      <Skills />
      <section className="relative w-full py-12 text-white bg-background">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#00D9D9" strokeWidth="2" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#00D9D9" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-accent">About Me</h2>
        </div>
      </section>

    </main>
  );
}
