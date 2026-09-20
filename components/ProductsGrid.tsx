import Link from "next/link";
import Image from "next/image";
import {
  Sun,
  Zap,
  BatteryFull,
  Droplet,
  Lightbulb,
  Plug,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { readCms } from "@/lib/cms/store";
import SectionHeading from "@/components/SectionHeading";

const icons = {
  sun: Sun,
  zap: Zap,
  battery: BatteryFull,
  droplet: Droplet,
  lightbulb: Lightbulb,
  plug: Plug,
};

function getCategoryProductImage(
  productSlug: string,
  imageIds?: string[],
  media?: { id: string; src: string }[]
): string {
  const slug = (productSlug || "").toLowerCase();

  // 1. Primary match from categories folder
  if (slug.includes("panel") || slug === "solar-pv" || slug === "solar-panels") {
    return "/images/categories/solar%20panel.png";
  }
  if (slug.includes("inverter") || slug === "inverters" || slug === "solar-inverters") {
    return "/images/categories/inverter.png";
  }
  if (slug.includes("batter") || slug === "storage" || slug === "solar-batteries") {
    return "/images/categories/battery.jpg";
  }
  if (slug.includes("pump") || slug === "pumping" || slug === "solar-water-pumps") {
    return "/images/categories/solar%20water%20pump.png";
  }
  if (slug.includes("light") || slug === "lighting" || slug === "solar-lighting") {
    return "/images/products/lighting-1.jpg";
  }
  if (
    slug.includes("bos") ||
    slug.includes("cable") ||
    slug === "bos-accessories"
  ) {
    return "/images/products/cables-1.jpg";
  }

  // 2. Match from CMS media if available
  if (imageIds && imageIds.length > 0 && media) {
    const match = media.find((m) => m.id === imageIds[0]);
    if (match?.src) return match.src;
  }

  // 3. Graceful fallback
  return "/images/categories/solar%20panel.png";
}

export default async function ProductsGrid() {
  const cms = await readCms();
  const products = cms.products || [];
  const media = cms.media || [];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Product range"
          title="Solar products, sourced from authorised partners"
          subtitle="Explore our comprehensive range of PV modules, inverters, storage batteries, pumps, lighting and BOS."
        />

        {/* Product Cards: Horizontal Snap Carousel on Mobile, Exact 3-Col Grid on Desktop */}
        <div className="mt-8 sm:mt-12 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 sm:pt-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => {
            const Icon = icons[product.icon as keyof typeof icons] ?? Sun;
            const imageSrc = getCategoryProductImage(
              product.slug,
              product.imageIds,
              media
            );

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-line/70 bg-white shadow-xs transition-all duration-500 hover:-translate-y-1.5 hover:border-navy/20 hover:shadow-2xl w-[82vw] max-w-[310px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none sm:flex-shrink"
              >
                {/* Showcase Image Container */}
                <div className="relative h-60 w-full overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/80 to-slate-200/50 flex items-center justify-center p-4">
                  {/* Ambient Glow Effect */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-36 w-36 rounded-full bg-sun/15 blur-2xl opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 ease-out" />
                  </div>

                  {/* Product Category Badge (Top Left) */}
                  <span className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-semibold text-navy shadow-sm ring-1 ring-black/5">
                    <Icon className="h-3.5 w-3.5 text-sun" />
                    <span>{product.short || product.name}</span>
                  </span>

                  {/* Floating Action Arrow (Top Right) */}
                  <div className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-md text-navy shadow-sm transition-all duration-300 group-hover:bg-sun group-hover:text-navy group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4 transition-transform" />
                  </div>

                  {/* Product Image with 3D Hover Floating Effect */}
                  <div className="relative h-44 w-full flex items-center justify-center">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      className="object-contain p-3 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-md group-hover:drop-shadow-2xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold text-navy group-hover:text-green transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                      {product.desc}
                    </p>
                  </div>

                  {/* Authorised Brands Strip */}
                  <div className="mt-5 pt-4 border-t border-line/60">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Authorised Brands
                      </span>
                      <span className="text-[11px] font-semibold text-green flex items-center gap-1 group-hover:underline">
                        <span>Explore</span>
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {product.partners && product.partners.length > 0 ? (
                        product.partners.map((partner) => (
                          <span
                            key={partner}
                            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-navy/80 group-hover:bg-navy/5 transition-colors"
                          >
                            {partner}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          Authorised Partner Network
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Swipe Hint (Hidden on Desktop) */}
        <div className="mt-4 flex items-center justify-center gap-1.5 sm:hidden text-xs text-muted font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sun animate-pulse" />
          <span>Swipe horizontally to view all {products.length} products</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted" />
        </div>
      </div>
    </section>
  );
}
