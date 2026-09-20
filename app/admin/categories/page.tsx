import Link from "next/link";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/admin-actions";
import { readCms } from "@/lib/cms/store";
import { Folder, ArrowRight, Package, AlertCircle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const notice = await searchParams;
  const cms = await readCms();

  return (
    <main className="max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-navy">Categories & Products</h1>
          <p className="mt-1 text-sm text-muted">
            Click into any category to manage, add, or edit products under it.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {notice.saved && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-800 font-medium">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>Category saved successfully.</span>
        </div>
      )}

      {notice.deleted && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-800 font-medium">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>Category deleted successfully.</span>
        </div>
      )}

      {notice.error === "has_products" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 font-medium">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>
            Cannot delete this category because it contains active products. Please delete or reassign its products first.
          </span>
        </div>
      )}

      {notice.error === "missing" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800 font-medium">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span>Category name is required.</span>
        </div>
      )}

      {/* Add New Category Card */}
      <div className="mt-6 rounded-2xl bg-white border border-line p-5 shadow-xs">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Add New Category</h2>
        <form action={saveCategoryAction} className="mt-3 grid gap-3 sm:grid-cols-4">
          <input
            name="name"
            placeholder="Category Name (e.g. Solar Inverters)"
            required
            className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
          <input
            name="slug"
            placeholder="Slug (optional, e.g. solar-inverters)"
            className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
          <input
            name="description"
            placeholder="Short description"
            className="rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
          <button className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            + Add Category
          </button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
          All Categories ({cms.categories.length})
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cms.categories.map((category) => {
            const categoryProducts = cms.products.filter(
              (p) => p.categoryId === category.id
            );

            return (
              <div
                key={category.id}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-xs transition-all hover:border-navy/30 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun/15 text-navy font-bold">
                        <Folder className="h-5 w-5 text-sun" />
                      </div>
                      <div>
                        <h3 className="font-bold text-navy text-lg group-hover:text-green transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted">/{category.slug}</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-navy">
                      <Package className="h-3 w-3 text-muted" />
                      <span>{categoryProducts.length}</span>
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">
                    {category.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-line/60 flex items-center justify-between">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-green transition-colors"
                  >
                    <span>Manage Products</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <form action={deleteCategoryAction} className="inline">
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                        title={categoryProducts.length > 0 ? "Cannot delete category with products" : "Delete category"}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
