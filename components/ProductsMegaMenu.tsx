"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  ArrowRight,
  Sun,
  Zap,
  BatteryFull,
  Droplet,
  Lightbulb,
  Plug,
  Package,
} from "lucide-react";
import type { Category, Product, MediaItem } from "@/lib/cms/types";
import { getProductImage } from "@/lib/product-nav";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: Sun,
  zap: Zap,
  battery: BatteryFull,
  droplet: Droplet,
  lightbulb: Lightbulb,
  plug: Plug,
};

interface ProductsMegaMenuProps {
  categories: Category[];
  products: Product[];
  media: MediaItem[];
  onClose: () => void;
}

export default function ProductsMegaMenu({
  categories,
  products,
  media,
  onClose,
}: ProductsMegaMenuProps) {
  // Filter categories to only those that exist, default to first category if available
  const [selectedId, setSelectedId] = useState<string>(
    categories[0]?.id || ""
  );

  const activeCategory =
    categories.find((c) => c.id === selectedId) || categories[0];

  // Products belonging to the currently selected category
  const activeProducts = activeCategory
    ? products.filter((p) => p.categoryId === activeCategory.id)
    : [];

  return (
    <div
      className="absolute left-1/2 top-full -translate-x-1/2 pt-2 z-50 w-full max-w-5xl px-4"
      onMouseLeave={onClose}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-slate-800 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex min-h-[400px]">
          {/* Left Column: Categories List from Admin */}
          <aside className="w-64 flex-shrink-0 bg-slate-50/80 p-4 border-r border-slate-200/80 flex flex-col justify-between">
            <div>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Categories
              </p>
              {categories.length > 0 ? (
                <nav className="space-y-1">
                  {categories.map((cat) => {
                    const isActive = cat.id === activeCategory?.id;
                    const catCount = products.filter(
                      (p) => p.categoryId === cat.id
                    ).length;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onMouseEnter={() => setSelectedId(cat.id)}
                        onClick={() => setSelectedId(cat.id)}
                        className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-all duration-150 ${
                          isActive
                            ? "bg-white font-semibold text-navy shadow-sm ring-1 ring-slate-200/70 border-l-4 border-sun"
                            : "text-slate-600 hover:bg-white/70 hover:text-navy font-medium"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({catCount})
                          </span>
                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform ${
                              isActive
                                ? "text-sun translate-x-0.5"
                                : "text-slate-300 opacity-0 group-hover:opacity-100"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </nav>
              ) : (
                <p className="px-3 py-4 text-xs text-slate-400">
                  No categories added yet. Add them in the admin dashboard.
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-slate-200/60 pt-4 px-2">
              <Link
                href="/products"
                onClick={onClose}
                className="group flex items-center gap-1.5 text-xs font-semibold text-green hover:text-[#186e3c]"
              >
                <span>Browse all products</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </aside>

          {/* Right Column: Dynamic Admin Products Grid */}
          <section className="flex-1 p-6 flex flex-col justify-between bg-white">
            <div>
              {/* Category Header */}
              {activeCategory ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-navy">
                      {activeCategory.name}
                    </h3>
                    {activeCategory.description && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {activeCategory.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {activeProducts.length}{" "}
                    {activeProducts.length === 1 ? "Product" : "Products"}
                  </span>
                </div>
              ) : (
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-navy">Products</h3>
                </div>
              )}

              {/* Products Card Grid */}
              {activeProducts.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                  {activeProducts.map((product) => {
                    const imageSrc = getProductImage(product, media);
                    const IconComponent =
                      iconMap[product.icon] || Package;

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                      >
                        <div>
                          <div className="relative mx-auto h-24 w-full overflow-hidden rounded-lg bg-white p-2 flex items-center justify-center">
                            {imageSrc ? (
                              <Image
                                src={imageSrc}
                                alt={product.name}
                                fill
                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 200px"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-navy">
                                <IconComponent className="h-6 w-6" />
                              </div>
                            )}
                          </div>

                          <h4 className="mt-2.5 text-xs font-semibold text-navy group-hover:text-green line-clamp-2">
                            {product.short || product.name}
                          </h4>
                        </div>

                        {product.partners && product.partners.length > 0 ? (
                          <p className="mt-1 text-[10px] font-medium text-green line-clamp-1">
                            {product.partners.join(" · ")}
                          </p>
                        ) : product.desc ? (
                          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                            {product.desc}
                          </p>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Package className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No products added in this category yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Add products from the admin panel under this category to display them here.
                  </p>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="mt-4 inline-flex items-center gap-1 rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white hover:bg-navy-mid"
                  >
                    <span>View all products</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom Footer Bar */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green animate-pulse" />
                <span>Authorised CNF, distributor & dealer</span>
              </div>
              <Link
                href="/products"
                onClick={onClose}
                className="font-semibold text-navy hover:text-green hover:underline flex items-center gap-1"
              >
                <span>View full product catalogue</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
