import type { Metadata } from "next";
import SolutionsGrid from "@/components/SolutionsGrid";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Solar Solutions in Guwahati Assam: Rooftop, Agriculture & Commercial",
  "Engineered solar solutions in Guwahati & Northeast: Rooftop solar systems, solar water pumps for agriculture, community lighting, and commercial installations.",
  "/solutions",
);

export default function SolutionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="Solar configured by use-case"
        subtitle="Rooftop, agriculture, community water and lighting, and utility-scale product supply."
      />
      <SolutionsGrid />
    </main>
  );
}
