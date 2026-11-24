import AdaptiveHeader from "@/components/home/AdaptiveHeader";
import FleetHero from "@/components/home/FleetHero";
import FortitierManifesto from "@/components/home/FortitierManifesto";
import FortitierShelf from "@/components/home/FortitierShelf";
import FortitierStory from "@/components/home/FortitierStory";
import FreightAxisHero from "@/components/home/FreightAxisHero";
import ContactBand from "@/components/ContactBand";

export default function HomePage() {
  return (
    <main className="bg-[#050302]">
      <AdaptiveHeader />
      <FreightAxisHero />
      <FortitierStory />
      <FortitierManifesto />
      <FortitierShelf />
      <FleetHero embedded />
      <div data-nav-tone="dark">
        <ContactBand />
      </div>
    </main>
  );
}
