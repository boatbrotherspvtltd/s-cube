import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { readCms } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const { id } = await params;
  const { returnUrl } = await searchParams;
  const cms = await readCms();
  const product = cms.products.find((item) => item.id === id);
  if (!product) notFound();

  const category = cms.categories.find((c) => c.id === product.categoryId);
  const backUrl =
    returnUrl ||
    (product.categoryId
      ? `/admin/categories/${product.categoryId}`
      : "/admin/categories");

  return (
    <main className="max-w-4xl">
      <div className="mb-6">
        <Link
          href={backUrl}
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-green transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{category ? `Back to ${category.name}` : "Back to Categories"}</span>
        </Link>
      </div>

      <h1 className="font-serif text-3xl text-navy">Edit {product.name}</h1>
      <ProductForm
        product={product}
        categories={cms.categories}
        media={cms.media}
        returnUrl={backUrl}
      />
    </main>
  );
}
