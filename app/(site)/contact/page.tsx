import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Contact",
  "Contact S-Cube Mercantile in Guwahati for solar product supply, dealership inquiries, channel distribution and after-sales support across Assam and the Northeast.",
  "/contact",
);

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact Us"
        title="Get in Touch with S-Cube"
        subtitle="Enquire about solar panels, inverters, dealership terms, or request product pricing. Reach out via our contact form or chat on WhatsApp."
      />
      <ContactSection />
    </main>
  );
}
