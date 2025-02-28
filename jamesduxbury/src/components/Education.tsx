import React from "react";
import { useState, useEffect } from "react";
import Image from 'next/image';

interface Certification {
    name: string;
    imgPath: string;
    certificationLink: string;
}

const CertificationCard: React.FC<Certification> = ({ name, imgPath, certificationLink }) => {
    return (
        <Image 
        src={imgPath} 
        alt={name} 
        width={100} 
        height={100} 
        className="hover:border-2 hover:border-accent hover:shadow-[0_0_20px_#3182ce] rounded-lg object-cove duration-200 hover:duration-200"
        onClick={() => {window.open(certificationLink, '_blank')}}
        />
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
            console.error("Failed to fetch projects");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
        };

        fetchCertifications();
    }, []);




    return (
        <section className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#3182ce]" id="education">
        <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#3182ce] rounded-full blur-[100px] top-[15%] right-[0%]"></div>
        <div className="absolute w-[200px] h-[200px] border-5 border-accent bg-[#3182ce] rounded-full blur-[100px] bottom-[15%] left-[0%]"></div>
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-accent mb-6">Education</h2>
            <div className="lg:flex justify-between items-center space-y-6 lg:space-y-0 relative">

                <div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_15px_#3182ce]"></div>
                <div className="space-y-8 pl-10">
                    <div>
                        <h3 className="text-xl font-semibold">MEng Computer Science</h3>
                        <p className="text-lg">Durham University | 2026 (Expected)</p>
                        <p className="text-md text-gray-300">On track for a First-Class overall classification</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">A-Levels</h3>
                        <p className="text-lg">Mark Rutherford School | 2021</p>
                        <p className="text-md text-gray-300">A* in Mathematics, Further Mathematics, Physics and Drama at A-level. A at AS-level in Computer Science. A* in the CyberEPQ. </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">GCSEs</h3>
                        <p className="text-lg">Mark Rutherford School | 2019</p>
                        <p className="text-md text-gray-300">9 (A**) in Mathematics, Biology, Physics, Computer Science and Drama. 8 (A*) in Chemistry, English Literature and History. 7 (A) in English Language, French and Religious Studies. </p>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap items-center w-100 justify-around mt-[50px] px-[150px]">
            {certifications.map((cert, index) => (
                <CertificationCard key={index} name={cert.name} imgPath={cert.imgPath} certificationLink={cert.certificationLink} />
            ))}
        </div>

        
    </section>
    );
};

export default Education;

/*
<section className="relative w-full bg-background py-12 text-white shadow-[0_0_15px_#3182ce]" id="education">
<div className="max-w-7xl mx-auto px-6"></div>

    <div className="relative">
        
       
    </div>
</section>*/