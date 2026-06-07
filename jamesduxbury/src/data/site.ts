export interface SiteSettings {
  profileImage: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  siteVersion: string;
  ownerName: string;
  tagline: string;
  metaDescription: string;
  ogDescription: string;
  ogFooter: string;
  entryRole: string;
  entryCredential: string;
  entryEducation: string;
  entryStatus: string;
  entryYears: string;
  cv: string | null;
}

export const siteSettings: SiteSettings = {
  profileImage:
    'https://aaobkpkc4uh9kgtn.public.blob.vercel-storage.com/profile-picture-tW8qoosbaFQh1fT785F06lOYpLccJN.png',
  contactEmail: 'jduxbury848@gmail.com',
  githubUrl: 'https://github.com/jsduxie',
  linkedinUrl: 'https://linkedin.com/in/jamesduxbury03',
  siteVersion: 'v2.0',
  ownerName: 'James Duxbury',
  tagline: 'Software Engineer in AI and Cybersecurity',
  metaDescription:
    'Final-year MEng Computer Science student at Durham. AI / NLP research, application security, full-stack engineering. Accredited Affiliate Member of the Chartered Institute of Information Security (AfCIIS).',
  ogDescription:
    'Portfolio of James Duxbury — MEng Computer Science, Durham. AI, NLP, application security, full-stack engineering.',
  ogFooter: 'MEng Computer Science · Durham',
  entryRole: 'Software engineer · AI & application security',
  entryCredential: 'AfCIIS',
  entryEducation: 'Durham University · Integrated MEng Computer Science',
  entryStatus: 'FINAL YEAR',
  entryYears: '2022 — 2026',
  cv: null,
};
