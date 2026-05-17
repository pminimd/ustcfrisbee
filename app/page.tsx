import { WarmHero } from "@/components/diary/WarmHero";
import { StoryNarrative } from "@/components/diary/StoryNarrative";
import { DesignEvolution } from "@/components/diary/DesignEvolution";
import { EasterEgg } from "@/components/diary/EasterEgg";
import { ReservationSection } from "@/components/diary/ReservationSection";
import { ClosingBeat } from "@/components/diary/ClosingBeat";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#fffaf5] text-stone-800">
      <WarmHero />
      <StoryNarrative />
      <DesignEvolution />
      <EasterEgg />
      <ReservationSection />
      <ClosingBeat />
    </main>
  );
}
