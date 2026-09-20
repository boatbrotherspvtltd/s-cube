"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { company, nav } from "@/lib/content";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, MessageCircle } from "lucide-react";
import ProductsMegaMenu from "@/components/ProductsMegaMenu";
import type { Category, Product, MediaItem } from "@/lib/cms/types";
import { whatsappUrl } from "@/lib/whatsapp";

interface HeaderProps {
  initialCategories?: Category[];
  initialProducts?: Product[];
  initialMedia?: MediaItem[];
}

export default function Header({
  initialCategories = [],
  initialProducts = [],
  initialMedia = [],
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);

  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if initial props change
  useEffect(() => {
    if (initialCategories.length) setCategories(initialCategories);
    if (initialProducts.length) setProducts(initialProducts);
    if (initialMedia.length) setMedia(initialMedia);
  }, [initialCategories, initialProducts, initialMedia]);

  // Optionally fetch fresh live data on mount to ensure immediate reflection of admin edits
  useEffect(() => {
    let isMounted = true;
    fetch("/api/nav-data", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && isMounted) {
          if (data.categories) setCategories(data.categories);
          if (data.products) setProducts(data.products);
          if (data.media) setMedia(data.media);
        }
      })
      .catch(() => {
        // Fallback gracefully to props
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setProductsOpen(false);
    setOpen(false);
    setMobileProductsOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setProductsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setProductsOpen(false);
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md relative">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt={`${company.name} logo`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-md bg-white object-contain p-0.5"
          />
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-wide">
              {company.name}
            </span>
            <span className="hidden text-[11px] text-white/60 sm:block">
              {company.city}
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/80 md:flex">
          {nav.map((item) => {
            if (item.href === "/products") {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <div
                  key={item.href}
                  className="relative flex items-center h-[72px]"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    onClick={() => setProductsOpen((v) => !v)}
                    className={`inline-flex items-center gap-1.5 transition hover:text-white ${
                      isActive || productsOpen
                        ? "text-white border-b-2 border-sun pb-0.5"
                        : "text-white/80"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        productsOpen ? "rotate-180 text-sun" : "text-white/60"
                      }`}
                    />
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-white ${
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "text-white border-b-2 border-sun pb-0.5"
                    : "text-white/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/contact"
            className={`rounded-full px-5 py-2 font-medium transition ${
              pathname === "/contact"
                ? "bg-white text-navy font-semibold shadow"
                : "bg-sun text-navy hover:bg-[#efb02a]"
            }`}
          >
            Contact
          </Link>

          <a
            href={whatsappUrl("Hello S-Cube Mercantile! I would like to enquire about your solar products.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 font-semibold text-[13px] transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
            title="Chat with S-Cube Mercantile on WhatsApp"
          >
            <MessageCircle className="h-4 w-4 fill-white" />
            <span>WhatsApp</span>
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="text-2xl md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {/* Desktop Products Mega Menu Dropdown */}
      {productsOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ProductsMegaMenu
            categories={categories}
            products={products}
            media={media}
            onClose={() => setProductsOpen(false)}
          />
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {open && (
        <nav className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 text-sm md:hidden max-h-[80vh] overflow-y-auto">
          {nav.map((item) => {
            if (item.href === "/products") {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <div key={item.href} className="flex flex-col">
                  <div className="flex items-center justify-between py-1">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`${
                        isActive ? "text-white font-semibold" : "text-white/85"
                      }`}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileProductsOpen((v) => !v)}
                      className="p-1.5 text-white/70 hover:text-white rounded"
                      aria-label="Toggle products dropdown"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileProductsOpen ? "rotate-180 text-sun" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {mobileProductsOpen && (
                    <div className="my-1 flex flex-col gap-1.5 pl-4 border-l-2 border-sun/50 text-xs text-white/80 bg-white/5 py-2 px-3 rounded-lg">
                      {categories.map((cat) => {
                        const catProducts = products.filter(
                          (p) => p.categoryId === cat.id
                        );
                        return (
                          <div key={cat.id} className="py-1">
                            <span className="font-semibold text-sun block">
                              {cat.name}
                            </span>
                            {catProducts.length > 0 ? (
                              <div className="mt-1 flex flex-col gap-1 pl-2">
                                {catProducts.map((prod) => (
                                  <Link
                                    key={prod.id}
                                    href={`/products/${prod.slug}`}
                                    onClick={() => setOpen(false)}
                                    className="text-white/70 hover:text-white py-0.5"
                                  >
                                    {prod.short || prod.name}
                                  </Link>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                      <Link
                        href="/products"
                        onClick={() => setOpen(false)}
                        className="pt-1.5 font-semibold text-sun hover:underline border-t border-white/10"
                      >
                        Browse all products →
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`${
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "text-white font-semibold"
                    : "text-white/85"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className={`font-semibold ${
              pathname === "/contact" ? "text-sun underline" : "text-sun"
            }`}
          >
            Contact
          </Link>

          <a
            href={whatsappUrl("Hello S-Cube Mercantile! I would like to enquire about your solar products.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 font-semibold text-sm transition shadow-sm"
          >
            <MessageCircle className="h-4 w-4 fill-white" />
            <span>WhatsApp</span>
          </a>
        </nav>
      )}
    </header>
  );
}
