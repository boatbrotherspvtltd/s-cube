import { process } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import { ArrowRight } from "lucide-react";

export default function ProcessSteps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20 md:px-6">
      <SectionHeading
        eyebrow="How we work"
        title="A clear distribution process"
        subtitle="Source, receive, store, supply and support — the operating sequence from the 2026 company profile."
      />

      {/* Process Steps: Horizontal Snap Carousel on Mobile, 5-Col Grid on Desktop */}
      <div className="mt-8 sm:mt-12 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-5 sm:gap-4 sm:overflow-visible sm:pb-0 sm:pt-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {process.map((item) => (
          <div
            key={item.step}
            className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 w-[72vw] max-w-[260px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none sm:flex-shrink shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div>
              <span className="font-serif text-3xl font-bold text-sun">{item.step}</span>
              <h3 className="mt-3 font-semibold text-navy text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-line/40 flex items-center justify-between sm:hidden text-xs font-semibold text-sun">
              <span>Step {item.step}</span>
              <span className="text-[11px] text-muted">05</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="mt-4 flex items-center justify-center gap-1.5 sm:hidden text-xs text-muted font-medium">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-sun animate-pulse" />
        <span>Swipe horizontally to view all {process.length} steps</span>
        <ArrowRight className="h-3.5 w-3.5 text-muted" />
      </div>
    </section>
  );
}
