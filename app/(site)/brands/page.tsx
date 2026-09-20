import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getCmsBrands } from "@/lib/cms/public";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

//export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = pageMeta(
  "Authorised Brands",
  "Authorised solar brands distributed by S-Cube Mercantile: Adani Solar, Waaree Energies, Luminous, Microtek and Tata Power Solar.",
  "/brands",
);

export default async function BrandsPage() {
  const brands = await getCmsBrands();

  return (
    <main className="bg-paper min-h-screen">
      <PageHero
        eyebrow="Authorised Brands"
        title="Distribution Portfolio"
        subtitle="Direct manufacturer partnerships delivering genuine Tier-1 solar equipment across Assam and the Northeast."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Modern Clean Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products`}
              className="group relative flex flex-col items-center justify-center rounded-[24px] border border-line/80 bg-white p-8 sm:p-10 min-h-[240px] sm:min-h-[260px] shadow-sm hover:shadow-2xl hover:border-sun/60 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden block text-center"
            >
              {/* Subtle Top-Right Hover Indicator */}
              <div className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-navy/40 group-hover:bg-sun group-hover:text-navy transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-105 shadow-sm">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              {/* Logo with 1-Second Smooth Luxury Hover Zoom */}
              <div className="relative h-24 sm:h-28 w-44 sm:w-52 overflow-hidden flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  loading="lazy"
                  className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                  sizes="(max-width: 640px) 180px, 220px"
                />
              </div>

              {/* Clean Brand Name */}
              <h2 className="mt-6 text-xl sm:text-2xl font-bold text-navy group-hover:text-sun transition-colors duration-300 tracking-tight">
                {brand.name}
              </h2>

              {/* Subtle Gold Underline Accent on Hover */}
              <span className="mt-3 h-0.5 w-0 bg-sun rounded-full transition-all duration-300 group-hover:w-12" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
