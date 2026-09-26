import type { Metadata } from "next";
import ProductsGrid from "@/components/ProductsGrid";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Solar Products & Equipment in Guwahati, Assam",
  "Authorised solar distributor in Guwahati: Tier-1 solar panels, inverters, batteries, pumps and BOS from Adani Solar, Waaree, Luminous, Microtek and Tata Power Solar across Assam & Northeast India.",
  "/products",
);

export default function ProductsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Products"
        title="A complete solar product ecosystem"
        subtitle="PV modules, inverters, batteries, pumps, lighting, mounting, cables and BOS — sourced from authorised manufacturer partners."
      />
      <ProductsGrid />
    </main>
  );
}
