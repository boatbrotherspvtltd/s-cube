import { saveProductAction } from "@/lib/admin-actions";
import type { Category, MediaItem, Product } from "@/lib/cms/types";

const icons = ["sun", "zap", "battery", "droplet", "lightbulb", "plug"];

export default function ProductForm({
  product,
  categories,
  media,
  defaultCategoryId,
  returnUrl,
}: {
  product?: Product;
  categories: Category[];
  media: MediaItem[];
  defaultCategoryId?: string;
  returnUrl?: string;
}) {
  return (
    <form action={saveProductAction} className="mt-8 max-w-3xl space-y-5">
      <input type="hidden" name="id" value={product?.id || ""} />
      {returnUrl && <input type="hidden" name="returnUrl" value={returnUrl} />}
      <Field label="Name" name="name" defaultValue={product?.name} required />
      <Field label="Short name" name="short" defaultValue={product?.short} />
      <Field label="Slug" name="slug" defaultValue={product?.slug} />
      <label className="block text-sm font-medium text-navy">
        Description
        <textarea
          name="desc"
          defaultValue={product?.desc}
          rows={4}
          className="mt-2 w-full rounded-xl border border-line px-3 py-3"
        />
      </label>
      <label className="block text-sm font-medium text-navy">
        Category
        <select
          name="categoryId"
          defaultValue={product?.categoryId || defaultCategoryId || ""}
          className="mt-2 w-full rounded-xl border border-line px-3 py-3"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-navy">
        Icon
        <select
          name="icon"
          defaultValue={product?.icon || "sun"}
          className="mt-2 w-full rounded-xl border border-line px-3 py-3"
        >
          {icons.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </label>
      <Field
        label="Partners (comma separated)"
        name="partners"
        defaultValue={product?.partners.join(", ")}
      />

      <fieldset>
        <legend className="text-sm font-medium text-navy">Product photos</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {media.map((item) => {
            const checked = product?.imageIds.includes(item.id) ?? false;
            return (
              <label key={item.id} className="overflow-hidden rounded-xl bg-white">
                <img src={item.src} alt={item.alt} className="h-24 w-full object-cover" />
                <span className="flex items-center gap-2 p-2 text-xs">
                  <input
                    type="checkbox"
                    name="imageIds"
                    value={item.id}
                    defaultChecked={checked}
                  />
                  {item.filename}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <button className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white">
        Save product
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-navy">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-xl border border-line px-3 py-3"
      />
    </label>
  );
}
