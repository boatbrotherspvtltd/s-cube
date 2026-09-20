import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProductAction, saveCategoryAction } from "@/lib/admin-actions";
import { readCms } from "@/lib/cms/store";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const { id } = await params;
  const notice = await searchParams;
  const cms = await readCms();

  const category = cms.categories.find((c) => c.id === id);
  if (!category) {
    notFound();
  }

  const categoryProducts = cms.products.filter((p) => p.categoryId === category.id);
  const mediaMap = new Map(cms.media.map((m) => [m.id, m.src]));

  return (
    <main className="max-w-6xl">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-green transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Categories</span>
        </Link>
      </div>

      {/* Notifications */}
      {notice.saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-800 font-medium">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>Changes saved successfully.</span>
        </div>
      )}

      {notice.deleted && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-800 font-medium">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>Product deleted successfully.</span>
        </div>
      )}

      {notice.error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800 font-medium">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span>An error occurred. Please check your fields and try again.</span>
        </div>
      )}

      {/* Category Header Card */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun/15 text-navy">
              <Layers className="h-6 w-6 text-sun" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-bold">Category</span>
              <h1 className="font-serif text-3xl text-navy">{category.name}</h1>
              <p className="text-xs text-muted">Slug: /{category.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy">
              {categoryProducts.length} {categoryProducts.length === 1 ? "Product" : "Products"}
            </span>
            <Link
              href={`/admin/products/new?categoryId=${category.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Quick Edit Category Details */}
        <details className="mt-5 border-t border-line/60 pt-4">
          <summary className="cursor-pointer text-xs font-bold text-navy hover:text-green flex items-center gap-1.5 select-none">
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Category Details</span>
          </summary>
          <form
            action={saveCategoryAction}
            className="mt-4 grid gap-3 sm:grid-cols-3 rounded-xl bg-paper p-4"
          >
            <input type="hidden" name="id" value={category.id} />
            <input
              type="hidden"
              name="returnUrl"
              value={`/admin/categories/${category.id}`}
            />
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Name</label>
              <input
                name="name"
                defaultValue={category.name}
                required
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Slug</label>
              <input
                name="slug"
                defaultValue={category.slug}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Description</label>
              <input
                name="description"
                defaultValue={category.description}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-navy"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white">
                Update Category
              </button>
            </div>
          </form>
        </details>
      </div>

      {/* Products Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Products in {category.name} ({categoryProducts.length})
          </h2>

          <Link
            href={`/admin/products/new?categoryId=${category.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-green"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 font-semibold text-navy">No products in this category</h3>
            <p className="mt-1 text-xs text-muted">
              Get started by adding your first product to {category.name}.
            </p>
            <Link
              href={`/admin/products/new?categoryId=${category.id}`}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Brands / Partners</th>
                  <th className="px-4 py-3.5">Photos</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {categoryProducts.map((product) => {
                  const firstPhoto = product.imageIds?.[0]
                    ? mediaMap.get(product.imageIds[0])
                    : null;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {firstPhoto ? (
                            <img
                              src={firstPhoto}
                              alt={product.name}
                              className="h-12 w-12 rounded-xl object-cover border border-line bg-slate-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 border border-line flex-shrink-0 text-muted">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-navy">{product.name}</p>
                            <p className="text-xs text-muted">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.partners && product.partners.length > 0 ? (
                            product.partners.map((partner) => (
                              <span
                                key={partner}
                                className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-navy"
                              >
                                {partner}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-muted font-medium">
                        {product.imageIds?.length || 0} attached
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            href={`/admin/products/${product.id}?returnUrl=/admin/categories/${category.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-green transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Link>

                          <form action={deleteProductAction} className="inline">
                            <input type="hidden" name="id" value={product.id} />
                            <input
                              type="hidden"
                              name="returnUrl"
                              value={`/admin/categories/${category.id}`}
                            />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
