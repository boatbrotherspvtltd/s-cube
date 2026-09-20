import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { readCms } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; returnUrl?: string }>;
}) {
  const { categoryId, returnUrl } = await searchParams;
  const cms = await readCms();
  const backUrl = returnUrl || (categoryId ? `/admin/categories/${categoryId}` : "/admin/categories");
  const category = cms.categories.find((c) => c.id === categoryId);

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

      <h1 className="font-serif text-3xl text-navy">
        {category ? `Add product to ${category.name}` : "Add product"}
      </h1>
      <ProductForm
        categories={cms.categories}
        media={cms.media}
        defaultCategoryId={categoryId}
        returnUrl={backUrl}
      />
    </main>
  );
}
