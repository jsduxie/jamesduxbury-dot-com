"use client";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import NavBar, { HeroBanner, About } from "./components/Components.tsx";



export default function Home() {

  
  return (
    <main className="bg-background text-white flex flex-col items-center justify-center pt-20">
      <NavBar />
      <HeroBanner />
    </main>
  );
}
