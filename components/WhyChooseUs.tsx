import { reasons } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import { ArrowRight } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Why S-Cube"
          title="A distribution partner built on genuine supply"
          subtitle="The six reasons stated in the company profile — experience, authorised brands, local network, CNF, pricing and after-sales."
        />

        {/* Reasons Cards: Horizontal Snap Carousel on Mobile, Grid on Tablet/Desktop */}
        <div className="mt-8 sm:mt-12 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible sm:pb-0 sm:pt-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {reasons.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-2xl border border-line bg-paper p-6 w-[78vw] max-w-[290px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none sm:flex-shrink shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-sun">
                    0{index + 1}
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-muted/70 sm:hidden">
                    Reason 0{index + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-4 flex items-center justify-center gap-1.5 sm:hidden text-xs text-muted font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sun animate-pulse" />
          <span>Swipe horizontally to view all {reasons.length} reasons</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted" />
        </div>
      </div>
    </section>
  );
}
