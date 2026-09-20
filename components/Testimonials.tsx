"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajib Sharma",
    company: "Brahmaputra Solar EPC, Guwahati",
    text: "Procuring Adani and Waaree TopCon modules directly from S-Cube's Guwahati hub cut our project turnaround time in half. Their team provided full manufacturer warranty documentation and supported us through net-metering approvals without any delays.",
    image: "/images/gallery/rooftop-installation.jpg",
  },
  {
    id: 2,
    name: "Mukesh Hazarika",
    company: "Assam Agro-Infra Projects, Jorhat",
    text: "Executing solar irrigation across rural Upper Assam requires equipment that can withstand heavy monsoons. The Tata Power Solar pump controllers and panels supplied by S-Cube have delivered flawless uptime for our agricultural communities.",
    image: "/images/gallery/solar-water-pump.png",
  },
  {
    id: 3,
    name: "Pranab Kalita",
    company: "GreenGrid Engineering, Silchar",
    text: "Unbeatable product availability in Guwahati. No more waiting weeks for consignments from mainland hubs. Having ready stock of Microtek and Luminous systems has revolutionized solar execution in Barak Valley.",
    image: "/images/gallery/elevated-rooftop.jpg",
  },
  {
    id: 4,
    name: "Debashis Baruah",
    company: "Eastern Solar Systems, Tezpur",
    text: "S-Cube is more than just a wholesaler—they understand Northeast grid norms and commercial viability. Every shipment is backed by factory test reports, transparent billing, and immediate on-site technical guidance.",
    image: "/images/gallery/residential-rooftop.webp",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Autoplay every 6 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  // Mobile touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) nextSlide();
    else if (diff < -45) prevSlide();
    touchStartX.current = null;
  };

  const current = testimonials[currentIndex];

  return (
    <section className="bg-paper py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Simple & Clean Header (SolarSmiths Style) */}
        <div className="text-center mb-12">
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Happy Customers Say"
            subtitle="Hear from customers who made the switch to solar with us."
          />
        </div>

        {/* Clean Testimonial Card Slider */}
        <div
          className="relative mx-auto max-w-4xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Clean Card (SolarSmiths Style) */}
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-10 shadow-sm transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Solar Installation Photo */}
              <div className="md:col-span-5">
                <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden border border-line/60 bg-paper">
                  <Image
                    src={current.image}
                    alt={`${current.name} installation`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 350px"
                    priority
                  />
                </div>
              </div>

              {/* Review Text & Customer Info */}
              <div className="md:col-span-7 flex flex-col justify-center">
                {/* 5 Stars Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#e3a31a] text-[#e3a31a]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic">
                  &ldquo;{current.text}&rdquo;
                </p>

                {/* Client Name & Company */}
                <div className="mt-6 pt-4 border-t border-line/60">
                  <h4 className="text-lg font-bold text-navy">
                    {current.name}
                  </h4>
                  <p className="text-sm text-muted mt-0.5">
                    {current.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Arrow Button (SolarSmiths style side navigation) */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-navy shadow-md border border-line hover:bg-paper transition-all active:scale-95 cursor-pointer z-20"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Arrow Button (SolarSmiths style side navigation) */}
          <button
            onClick={nextSlide}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-navy shadow-md border border-line hover:bg-paper transition-all active:scale-95 cursor-pointer z-20"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Bottom Pagination Indicator Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 h-2.5 bg-sun"
                    : "w-2.5 h-2.5 bg-line hover:bg-muted"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
