import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Certification {
  name: string;
  year?: string;
  imgPath?: string;
  certificationLink?: string;
}

const CertificationCard: React.FC<Certification> = ({ name, year, imgPath, certificationLink }) => {
  const handleOpen = certificationLink ? () => window.open(certificationLink, '_blank') : undefined;

  if (imgPath) {
    return (
      <Image
        src={imgPath}
        alt={name}
        width={100}
        height={100}
        className={`z-[10] mx-5 mt-5 rounded-lg object-cover duration-200 hover:border-2 hover:border-accent hover:shadow-[0_0_20px_#3182ce] hover:duration-200 ${certificationLink ? 'cursor-pointer' : ''}`}
        onClick={handleOpen}
      />
    );
  }

  return (
    <div
      className={`z-[10] mx-5 mt-5 flex h-[100px] w-[180px] flex-col items-center justify-center rounded-lg border border-accent bg-bgaccent px-3 py-2 text-center text-sm font-semibold text-white shadow-[0_0_15px_#3182ce] duration-200 ${certificationLink ? 'cursor-pointer hover:shadow-[0_0_25px_#3182ce]' : ''}`}
      onClick={handleOpen}
    >
      <span>{name}</span>
      {year && <span className="mt-1 text-xs font-normal text-gray-400">{year}</span>}
    </div>
  );
};

const Education: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch('/data/certifications.json');
        if (res.ok) {
          const data = await res.json();
          setCertifications(data);
        } else {
          console.error('Failed to fetch certifications');
        }
      } catch (error) {
        console.error('Error fetching certifications:', error);
      }
    };

    fetchCertifications();
  }, []);

  return (
    <section
      className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#3182ce]"
      id="education"
    >
      <div className="border-5 absolute right-[0%] top-[15%] h-[200px] w-[200px] rounded-full border-accent bg-[#3182ce] blur-[100px]"></div>
      <div className="border-5 absolute bottom-[15%] left-[0%] h-[200px] w-[200px] rounded-full border-accent bg-[#3182ce] blur-[100px]"></div>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 text-3xl font-bold text-accent">Education</h2>
        <div className="relative items-center justify-between space-y-6 lg:flex lg:space-y-0">
          <div className="w-full">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent shadow-[0_0_15px_#3182ce]"></div>
            <div className="space-y-8 pl-10">
              <div>
                <h3 className="text-xl font-semibold">Integrated MEng Computer Science</h3>
                <p className="text-lg">Durham University · Oct 2022 – July 2026</p>
                <ul className="text-md mt-2 list-disc space-y-1 pl-5 text-gray-300">
                  <li>
                    On track for First Class Honours; strong performance in Software Engineering,
                    Data Science and AI modules.
                  </li>
                  <li>
                    Project Lead on an IBM-sponsored software engineering project (grade 80%),
                    implementing NPC and player logic in an agile, team-based environment.
                  </li>
                  <li>Achieved 98% in both full-stack web development courseworks.</li>
                  <li>
                    Dissertation: <em>FG-HAN</em> — hierarchical attention networks with clinically
                    grounded NLP features for Borderline Personality Disorder detection on Reddit.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold">GCE A-Levels</h3>
                <p className="text-lg">Mark Rutherford School · Sep 2019 – July 2021</p>
                <ul className="text-md mt-2 list-disc space-y-1 pl-5 text-gray-300">
                  <li>A* in Mathematics, Further Mathematics, Physics, Drama.</li>
                  <li>A* in the CyberEPQ · A at AS-level in Computer Science.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-3 px-6">
        {certifications.map((cert, index) => (
          <CertificationCard key={index} {...cert} />
        ))}
      </div>
    </section>
  );
};

export default Education;
