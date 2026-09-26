import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getCmsProduct, getCmsProducts } from "@/lib/cms/public";
import { pageMeta } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import Image from "next/image";

//export const dynamic = "force-dynamic";
//export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCmsProduct(slug);
  if (!data) return { title: "Product" };
  const image = data.images[0]?.src || "/images/hero.jpg";

  const partnersText =
    data.product.partners && data.product.partners.length > 0
      ? ` (${data.product.partners.join(", ")})`
      : "";

  const seoTitle = `${data.product.name} in Guwahati, Assam${partnersText}`;
  const seoDescription = `Authorised distributor and dealer of ${data.product.name} in Guwahati, Assam${partnersText}. Genuine warranty, wholesale rates, and fast Northeast supply by S-Cube Mercantile.`;

  return pageMeta(
    seoTitle,
    seoDescription,
    `/products/${data.product.slug}`,
    image,
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCmsProduct(slug);
  if (!data) notFound();
  const { product, category, images } = data;
  const others = (await getCmsProducts()).filter((item) => item.slug !== slug);

  return (
    <main>
      <PageHero
        eyebrow={category?.name || "Product"}
        title={product.name}
        subtitle={product.desc}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            {images.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {images.map((image) => (
                  <div key={image.id} className="relative h-56 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-sm text-muted">
                No product photos assigned yet. Add them in the admin media library.
              </div>
            )}
          </div>
          <aside className="rounded-2xl bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-green">
              Authorised partners
            </h2>
            <p className="mt-3 text-xl text-navy">
              {product.partners.length
                ? product.partners.join(" · ")
                : "Sourced through our authorised partner network"}
            </p>
            {category && (
              <p className="mt-4 text-sm text-muted">Category: {category.name}</p>
            )}
            <a
              href={whatsappUrl(
                `Hello, I would like to enquire about ${product.name} from S-Cube Mercantile.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#1f8a4c] px-6 py-3 text-sm font-semibold text-white"
            >
              WhatsApp for availability
            </a>
          </aside>
        </div>

        {others.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl text-navy">Other products</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {others.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="rounded-full bg-white px-4 py-2 text-sm text-navy"
                >
                  {item.short}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
