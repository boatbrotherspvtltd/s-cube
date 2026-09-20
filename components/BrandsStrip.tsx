import { getCmsBrands } from "@/lib/cms/public";
import SectionHeading from "@/components/SectionHeading";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default async function BrandsStrip() {
  const brands = await getCmsBrands();

  return (
    <section className="bg-paper py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <SectionHeading
            eyebrow="Authorised Distribution"
            title="Brands We Distribute"
            subtitle="Tier-1 solar manufacturers partnered with S-Cube Mercantile across Northeast India."
          />
        </div>

        {/* Modern Clean Brand Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href="/brands"
              className="group relative flex flex-col items-center justify-center rounded-[22px] border border-line/80 bg-white p-6 sm:p-8 min-h-[190px] sm:min-h-[210px] shadow-sm hover:shadow-2xl hover:border-sun/60 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden block text-center"
            >
              {/* Subtle Top-Right Hover Arrow */}
              <div className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-paper text-navy/40 group-hover:bg-sun group-hover:text-navy transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-105 shadow-sm">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>

              {/* Logo with 1-Second Smooth Luxury Hover Zoom */}
              <div className="relative h-16 sm:h-20 w-32 sm:w-36 overflow-hidden flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                  sizes="(max-width: 640px) 130px, 150px"
                />
              </div>

              {/* Clean Brand Name */}
              <h3 className="mt-4 text-sm sm:text-base font-bold text-navy group-hover:text-sun transition-colors duration-300 tracking-tight">
                {brand.name}
              </h3>

              {/* Subtle Brand Underline Accent on Hover */}
              <span className="mt-2 h-0.5 w-0 bg-sun rounded-full transition-all duration-300 group-hover:w-8" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
