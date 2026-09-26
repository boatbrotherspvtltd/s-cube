import Hero from "@/components/Hero";
import TrustStats from "@/components/TrustStats";
import AboutTeaser from "@/components/AboutTeaser";
import ProductsGrid from "@/components/ProductsGrid";
import SolutionsGrid from "@/components/SolutionsGrid";
import ProcessSteps from "@/components/ProcessSteps";
import BrandsStrip from "@/components/BrandsStrip";
import Warehouse from "@/components/Warehouse";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Capabilities from "@/components/Capabilities";
import GalleryPreview from "@/components/GalleryPreview";
import ContactSection from "@/components/ContactSection";
import { defaultDescription, pageMeta } from "@/lib/seo";

//export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata = {
  ...pageMeta(
    "Solar in Guwahati, Assam | Solar Panels, Inverters & Dealer",
    "Authorised distributor of Adani Solar, Waaree, Luminous, Microtek and Tata Power Solar in Guwahati, Assam. Complete rooftop solar, inverters, batteries, pumps and wholesale supply across Northeast India.",
    "/",
  ),
  title: {
    absolute: "S-Cube Mercantile | Solar in Guwahati, Assam | Panels, Inverters & Dealer",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStats />
      <AboutTeaser />
      <ProductsGrid />
      <SolutionsGrid />
      <ProcessSteps />
      <BrandsStrip />
      <Warehouse />
      <WhyChooseUs />
      <Testimonials />
      <Capabilities />
      <GalleryPreview />
      <ContactSection />
    </main>
  );
}
