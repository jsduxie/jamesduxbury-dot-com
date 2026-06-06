export interface Certification {
  name: string;
  year: string;
  imgPath?: string;
  certificationLink?: string;
}

export const certifications: Certification[] = [
  {
    name: 'Affiliate Member, Chartered Institute of Information Security (AfCIIS)',
    year: '2020',
  },
  {
    name: 'Microsoft Azure AI Fundamentals',
    year: '2024',
    imgPath:
      'https://aaobkpkc4uh9kgtn.public.blob.vercel-storage.com/microsoft-certified-azure-ai-fundamentals-oKCWGncdd3P2s0e3nNCjYFTnN6Na6y.png',
    certificationLink:
      'https://www.credly.com/badges/8839de8b-befc-4eb9-a76a-c0ba585209d5/public_url',
  },
  {
    name: 'ITIL 4 Foundation',
    year: '2021',
    imgPath:
      'https://aaobkpkc4uh9kgtn.public.blob.vercel-storage.com/itil-4-foundation-36lcxcAApbTIwx7pkybi6q1O8w8lav.png',
    certificationLink: 'https://www.axelos.com/successful-candidates-register',
  },
  {
    name: 'IBM Enterprise Design Thinking Practitioner',
    year: '2023',
    imgPath:
      'https://aaobkpkc4uh9kgtn.public.blob.vercel-storage.com/enterprise-design-thinking-practitioner-965x4kzJCSkLSc4HuFsw42w6xIchix.png',
    certificationLink:
      'https://www.credly.com/badges/5ae35ca4-9988-47ae-adfe-2988903b2fba/public_url',
  },
  {
    name: 'IBM SkillsBuild: Enterprise Data Science in Practice',
    year: '2023',
    imgPath:
      'https://aaobkpkc4uh9kgtn.public.blob.vercel-storage.com/enterprise-data-science-in-practice.1-LQ1ggimJk0kzotabDD2oV8Q30dDoMs.png',
    certificationLink:
      'https://www.credly.com/badges/9d5c8f4d-78f6-4c92-a106-38c6df8dd8b1/public_url',
  },
  {
    name: 'IBM SkillsBuild: Getting Started with Enterprise Data Science',
    year: '2023',
    imgPath:
      'https://aaobkpkc4uh9kgtn.public.blob.vercel-storage.com/getting-started-with-enterprise-data-science.2-Rm9hv5pAhg2qutejQe84VdUEbp6qd0.png',
    certificationLink:
      'https://www.credly.com/badges/1de318f0-f1a6-40b3-aae0-f1d16471d0fd/public_url',
  },
  {
    name: 'IBM SkillsBuild: Journey to Cloud: Envisioning Your Solution',
    year: '2023',
    imgPath:
      'https://aaobkpkc4uh9kgtn.public.blob.vercel-storage.com/journey-to-cloud-envisioning-your-solution.2-6Src6GQovtAyt8z4UVNGx0tN73DAyp.png',
    certificationLink:
      'https://www.credly.com/badges/c34f7fd2-ea25-4aa8-92a0-04501f341bbf/public_url',
  },
];
