import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutions } from "@/lib/content";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return solutions.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);
  if (!solution) return { title: "Solution" };

  const partnersText =
    solution.partners && solution.partners.length > 0
      ? ` (${solution.partners.join(", ")})`
      : "";
  const seoTitle = `${solution.name} Solar Systems in Guwahati, Assam${partnersText}`;
  const seoDescription = `${solution.desc} Authorised supply and engineering support across Guwahati, Assam and Northeast India by S-Cube Mercantile${partnersText}.`;

  return pageMeta(
    seoTitle,
    seoDescription,
    `/solutions/${solution.slug}`,
  );
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);
  if (!solution) notFound();

  return (
    <main>
      <PageHero
        eyebrow="Solution"
        title={solution.name}
        subtitle={solution.desc}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-green">
          Typical partners
        </h2>
        <p className="mt-3 text-2xl text-navy">{solution.partners.join(" · ")}</p>
        <a
          href={whatsappUrl(
            `Hello, I would like to discuss a ${solution.name.toLowerCase()} solar requirement with S-Cube Mercantile.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-full bg-[#1f8a4c] px-6 py-3 text-sm font-semibold text-white"
        >
          WhatsApp this requirement
        </a>
      </section>
    </main>
  );
}
