"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

interface SolutionItem {
  slug: string;
  name: string;
  image: string;
}

const solutionItems: SolutionItem[] = [
  {
    slug: "rooftop-solar",
    name: "Rooftop Solar",
    image: "/images/solutions/rooftop.jpg",
  },
  {
    slug: "agriculture-irrigation",
    name: "Agriculture",
    image: "/images/solutions/agriculture.jpg",
  },
  {
    slug: "community-water-lighting",
    name: "Community",
    image: "/images/solutions/community.jpg",
  },
  {
    slug: "utility-scale",
    name: "Utility Scale",
    image: "/images/solutions/utility-scale.jpg",
  },
];

export default function SolutionsGrid() {
  return (
    <section className="bg-navy py-16 sm:py-20 text-white select-none relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sun/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="mb-8 sm:mb-12">
          <SectionHeading
            light
            eyebrow="Use Cases & Applications"
            title="Reinventing Regional Solar Solutions"
            subtitle="Engineered for real-world deployment across Guwahati, Assam, and the Northeast."
          />
        </div>

        {/* Clean Microtek-style Cards: Horizontal Snap Carousel on Mobile, Grid on Tablet/Desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:pb-0 sm:pt-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {solutionItems.map((item) => (
            <Link
              key={item.slug}
              href={`/solutions/${item.slug}`}
              className="group relative h-[360px] sm:h-[460px] w-[78vw] max-w-[290px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none sm:flex-shrink rounded-[22px] overflow-hidden border border-white/10 hover:border-sun/60 transition-all duration-500 shadow-xl block"
            >
              {/* Image with Microtek 1-Second Smooth Luxury Zoom (.zoomimg) */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={`${item.name} solar use case`}
                  fill
                  className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Gradient Vignette for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061424]/90 via-[#061424]/20 via-40% to-transparent z-10 transition-opacity duration-300 group-hover:from-[#061424]/95" />

              {/* Bottom Clean Name Overlay (Microtek Style) */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 flex items-end justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-sun transition-colors duration-300">
                  {item.name}
                </h3>
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/15 sm:bg-white/10 text-white group-hover:bg-sun group-hover:text-navy transition-all duration-300 backdrop-blur-md opacity-90 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 shadow-md">
                  <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-4 flex items-center justify-center gap-1.5 sm:hidden text-xs text-white/60 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sun animate-pulse" />
          <span>Swipe horizontally to explore all use cases</span>
          <ArrowRight className="h-3.5 w-3.5 text-white/60" />
        </div>
      </div>
    </section>
  );
}
