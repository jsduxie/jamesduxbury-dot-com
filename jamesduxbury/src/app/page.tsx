import { Entry } from '@/components/Entry';
import { getSiteSettings } from '@/db/queries';
import { AboutSummary } from '@/components/about/AboutSummary';
import { WorkSummary } from '@/components/work/WorkSummary';
import { SkillsSummary } from '@/components/skills/SkillsSummary';
import { ExperienceSummary } from '@/components/experience/ExperienceSummary';
import { EducationSummary } from '@/components/education/EducationSummary';
import { Footer } from '@/components/Footer';

export const revalidate = 60;

export default async function Home() {
  const settings = await getSiteSettings();
  return (
    <>
      <Entry settings={settings} />
      <main className="mx-auto max-w-7xl space-y-10 px-4 pt-12 sm:px-6">
        <AboutSummary />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WorkSummary />
          </div>
          <div>
            <SkillsSummary />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ExperienceSummary />
          <EducationSummary />
        </div>
      </main>
      <Footer />
    </>
  );
}
