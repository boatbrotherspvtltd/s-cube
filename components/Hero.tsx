"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";

interface BannerSlide {
  id: number;
  src: string;
  alt: string;
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
  align?: "left" | "right";
}

const HERO_SLIDES: BannerSlide[] = [
  {
    id: 1,
    src: "/images/hero/hero1.webp",
    alt: "S-Cube Mercantile Solar Distribution Guwahati Northeast",
    kicker: "Guwahati & Northeast's Best Solar Partner",
    title: "Power Backup",
    subtitle: "Engineered For Modern Homes · Uninterrupted Clean Energy",
    description:
      "Supplying tier-1 solar inverters, lithium batteries, and high-efficiency PV panels from Guwahati across Assam and all 7 Northeast states.",
    primaryText: "WhatsApp Us",
    primaryLink: whatsappUrl("Hello S-Cube Mercantile, I want to enquire about solar inverters and home backup in Guwahati."),
    secondaryText: "View Products",
    secondaryLink: "/products",
    align: "right",
  },
  {
    id: 2,
    src: "/images/hero/hero2.webp",
    alt: "Agricultural Solar Water Pumping Systems Northeast",
    kicker: "Powering Northeast Agriculture & Irrigation",
    title: "Solar Water Pumps",
    subtitle: "High-Efficiency Solar Pumps · Zero Electricity Fuel Cost",
    description:
      "Guwahati's premier wholesale distributor of agricultural solar pumping systems, VFD controllers, and high-wattage panels for farmers and EPC projects.",
    primaryText: "Get A Quote",
    primaryLink: whatsappUrl("Hello S-Cube Mercantile, I want to enquire about solar water pumping systems for the Northeast."),
    secondaryText: "Our Solutions",
    secondaryLink: "/solutions",
    align: "left",
  },
  {
    id: 3,
    src: "/images/hero/hero3.webp",
    alt: "Best Rooftop Solar Systems in Guwahati Assam",
    kicker: "Guwahati's Most Trusted Rooftop Solar Supply",
    title: "Clean Solar Power",
    subtitle: "Cut Up To 90% Electricity Costs · 25-Year Reliability",
    description:
      "Complete residential and commercial on-grid, off-grid, and hybrid solar systems supplied with manufacturer warranty across Assam and the Northeast.",
    primaryText: "WhatsApp Us",
    primaryLink: whatsappUrl("Hello S-Cube Mercantile, I want to enquire about rooftop solar panels for my property."),
    secondaryText: "View Products",
    secondaryLink: "/products",
    align: "left",
  },
  {
    id: 4,
    src: "/images/hero/hero4.webp",
    alt: "Largest Wholesale Solar Distributor in Northeast India",
    kicker: "ISO 9001:2015 Certified · 7+ Years Of Excellence",
    title: "Commercial Solar",
    subtitle: "Massive Guwahati Warehouse · Fast Regional Dispatch",
    description:
      "Authorized CNF & distributor for Adani, Waaree, Luminous, and Microtek. Unmatched inventory and support for dealers, installers, and projects.",
    primaryText: "Wholesale Enquiry",
    primaryLink: whatsappUrl("Hello S-Cube Mercantile, I am a dealer/installer looking for wholesale solar supply in the Northeast."),
    secondaryText: "Our Brands",
    secondaryLink: "/brands",
    align: "left",
  },
];

// Cloned slides at both ends for infinite seamless loop without jumping
const EXTENDED_SLIDES = [
  { ...HERO_SLIDES[HERO_SLIDES.length - 1], uniqueKey: "clone-end" },
  ...HERO_SLIDES.map((s) => ({ ...s, uniqueKey: `real-${s.id}` })),
  { ...HERO_SLIDES[0], uniqueKey: "clone-start" },
];

const AUTOPLAY_INTERVAL = 6000; // 4 seconds

export default function Hero() {
  // Start at index 1 (the first real slide)
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= EXTENDED_SLIDES.length - 1) return prev;
      setIsTransitioning(true);
      return prev + 1;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return prev;
      setIsTransitioning(true);
      return prev - 1;
    });
  }, []);

  const goToSlide = (realIndex: number) => {
    setIsTransitioning(true);
    setCurrentIndex(realIndex + 1);
  };

  // Seamless teleport when reaching cloned edge slides
  const handleTransitionEnd = () => {
    if (currentIndex === EXTENDED_SLIDES.length - 1) {
      // Reached cloned first slide -> silently teleport to real first slide
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      // Reached cloned last slide -> silently teleport to real last slide
      setIsTransitioning(false);
      setCurrentIndex(HERO_SLIDES.length);
    }
  };

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [nextSlide]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  // Calculate active pagination dot index (0 to HERO_SLIDES.length - 1)
  const activeDotIndex =
    currentIndex === 0
      ? HERO_SLIDES.length - 1
      : currentIndex === EXTENDED_SLIDES.length - 1
        ? 0
        : currentIndex - 1;

  return (
    <section
      className="relative w-full overflow-hidden bg-navy select-none max-h-[85vh] md:max-h-[95vh] min-h-[360px] sm:min-h-[440px] md:min-h-[520px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Promotional banner slider"
      role="region"
    >
      {/* Slider Track */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex w-full h-full ${isTransitioning
          ? "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          : ""
          }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {EXTENDED_SLIDES.map((slide, idx) => {
          const isRightAligned = slide.align === "right";

          return (
            <div
              key={slide.uniqueKey}
              className="relative w-full flex-shrink-0 aspect-[2752/1536] max-h-[85vh] md:max-h-[95vh] min-h-[360px] sm:min-h-[440px] md:min-h-[520px]"
            >
              {/* Background Image */}
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 1}
                loading={idx === 1 ? "eager" : "lazy"}
                sizes="100vw"
                className={`object-cover ${slide.id === 1 ? "object-[28%_center] md:object-center" : "object-center"}`}
              />

              {/* Shading Overlays: Custom per slide so faces aren't darkened */}
              {isRightAligned ? (
                // Right-aligned slide (Hero 1 with Family):
                // Shadow sits on the RIGHT side, leaving left side (family) completely natural & bright
                <>
                  {/* Desktop / Tablet horizontal gradient: dark on the right, transparent on the left */}
                  <div className="absolute inset-0 hidden md:block bg-gradient-to-l from-[#071322]/95 via-[#071322]/80 via-45% to-transparent z-10" />
                  {/* Mobile gradient: subtle bottom gradient for text contrast without hiding faces above */}
                  <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#071322]/95 via-[#071322]/55 via-45% to-transparent z-10" />
                </>
              ) : (
                // Standard Left-aligned slides (Heroes 2, 3, 4):
                <>
                  {/* Desktop / Tablet horizontal gradient: dark on left, clear on right */}
                  <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#071322]/95 via-[#071322]/80 via-45% to-transparent z-10" />
                  {/* Mobile gradient */}
                  <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#071322]/95 via-[#071322]/55 via-45% to-transparent z-10" />
                  <div className="absolute right-0 bottom-0 w-48 sm:w-72 h-20 sm:h-32 bg-gradient-to-tl from-[#071322]/90 via-[#071322]/35 to-transparent z-10 pointer-events-none" />
                </>
              )}

              {/* Slide Text Content */}
              <div className="absolute inset-0 z-10 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-8 md:py-12 flex">
                  <div
                    className={`w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl text-white ${
                      isRightAligned ? "ml-auto text-left" : "mr-auto text-left"
                    }`}
                  >
                    {/* Top Kicker / Accent Tag */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 mb-1 sm:mb-2 md:mb-3">
                      <span className="inline-block w-4 sm:w-6 md:w-7 h-[2px] bg-sun" />
                      <p className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.16em] sm:tracking-[0.22em] text-sun uppercase drop-shadow">
                        {slide.kicker}
                      </p>
                    </div>

                    {/* Main Headline - Scaled nicely so it does not overwhelm mobile screens */}
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold uppercase italic tracking-tight text-white leading-[1.1] sm:leading-[1.05] drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
                      {slide.title}
                    </h2>

                    {/* Subtle Sleek Glowing Divider */}
                    <div className="h-[2px] w-20 sm:w-28 md:w-36 lg:w-44 bg-gradient-to-r from-sun via-white/80 to-transparent my-1.5 sm:my-2.5 md:my-3.5 shadow-sm" />

                    {/* Subtitle */}
                    <p className="text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold tracking-wider text-white/95 uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] line-clamp-1 sm:line-clamp-none">
                      {slide.subtitle}
                    </p>

                    {/* Description - Clamped to 2 lines on mobile so image stays visible */}
                    <p className="mt-1.5 sm:mt-2.5 md:mt-3 text-[11px] sm:text-xs md:text-sm lg:text-base text-white/85 leading-snug sm:leading-relaxed max-w-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] line-clamp-2 sm:line-clamp-none">
                      {slide.description}
                    </p>

                    {/* Action Buttons - Clean compact sizing on mobile */}
                    <div className="mt-3 sm:mt-4 md:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                      <a
                        href={slide.primaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-sun px-4 sm:px-6 md:px-7 py-1.5 sm:py-2.5 md:py-3 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-navy transition-all duration-200 hover:bg-[#efb02a] hover:scale-105 active:scale-95 shadow-lg shadow-sun/30"
                      >
                        {slide.primaryText}
                      </a>
                      <Link
                        href={slide.secondaryLink}
                        className="inline-flex items-center justify-center rounded-full border-2 border-white/70 bg-black/25 backdrop-blur-md px-3.5 sm:px-5 md:px-6 py-1.5 sm:py-2.5 md:py-3 text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-white/20 hover:border-white hover:scale-105 active:scale-95 shadow-md"
                      >
                        {slide.secondaryText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev Navigation Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        aria-label="Previous slide"
        className="group absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/80 text-navy shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sun opacity-85 hover:opacity-100"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      {/* Next Navigation Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        aria-label="Next slide"
        className="group absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/80 text-navy shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sun opacity-85 hover:opacity-100"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Pagination Indicators (Dots / Pills) */}
      <div className="absolute bottom-3 sm:bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-sm shadow-md">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full focus:outline-none ${activeDotIndex === index
              ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-sun shadow-sm"
              : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white"
              }`}
          />
        ))}
      </div>


    </section>
  );
}
