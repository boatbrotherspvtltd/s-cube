"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { promises as fs } from "fs";
import cloudinary from "@/lib/cloudinary";

import path from "path";
import {
  COOKIE,
  adminPassword,
  requireAdmin,
  sessionToken,
} from "@/lib/admin-auth";
import { newId, readCms, slugify, updateCms } from "@/lib/cms/store";

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/products", "layout");
  revalidatePath("/gallery");
  revalidatePath("/brands");
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password !== adminPassword()) {
    redirect("/admin/login?error=1");
  }
  const jar = await cookies();
  jar.set(COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(COOKIE);
  redirect("/admin/login");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "") || newId("prod");
  const name = String(formData.get("name") || "").trim();
  const short = String(formData.get("short") || name).trim();
  const desc = String(formData.get("desc") || "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const categoryId = String(formData.get("categoryId") || "");
  const icon = String(formData.get("icon") || "sun");
  const returnUrl = String(formData.get("returnUrl") || "");
  const partners = String(formData.get("partners") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const imageIds = formData.getAll("imageIds").map(String);

  if (!name || !slug) {
    if (returnUrl) {
      const sep = returnUrl.includes("?") ? "&" : "?";
      redirect(`${returnUrl}${sep}error=missing`);
    }
    redirect(categoryId ? `/admin/categories/${categoryId}?error=missing` : "/admin/products?error=missing");
  }

  await updateCms((data) => {
    const next = {
      id,
      slug,
      name,
      short,
      desc,
      categoryId,
      partners,
      icon,
      imageIds,
    };
    const index = data.products.findIndex((item) => item.id === id);
    if (index >= 0) data.products[index] = next;
    else data.products.push(next);
  });

  refresh();
  if (returnUrl) {
    const sep = returnUrl.includes("?") ? "&" : "?";
    redirect(`${returnUrl}${sep}saved=1`);
  } else if (categoryId) {
    redirect(`/admin/categories/${categoryId}?saved=1`);
  } else {
    redirect("/admin/products?saved=1");
  }
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const returnUrl = String(formData.get("returnUrl") || "");
  const categoryId = String(formData.get("categoryId") || "");

  await updateCms((data) => {
    data.products = data.products.filter((item) => item.id !== id);
  });
  refresh();

  if (returnUrl) {
    const sep = returnUrl.includes("?") ? "&" : "?";
    redirect(`${returnUrl}${sep}deleted=1`);
  } else if (categoryId) {
    redirect(`/admin/categories/${categoryId}?deleted=1`);
  } else {
    redirect("/admin/products?deleted=1");
  }
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "") || newId("cat");
  const name = String(formData.get("name") || "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const description = String(formData.get("description") || "").trim();
  const returnUrl = String(formData.get("returnUrl") || "");

  if (!name) {
    redirect(returnUrl ? `${returnUrl}?error=missing` : "/admin/categories?error=missing");
  }

  await updateCms((data) => {
    const next = { id, name, slug, description };
    const index = data.categories.findIndex((item) => item.id === id);
    if (index >= 0) data.categories[index] = next;
    else data.categories.push(next);
  });
  refresh();

  if (returnUrl) {
    const sep = returnUrl.includes("?") ? "&" : "?";
    redirect(`${returnUrl}${sep}saved=1`);
  } else {
    redirect("/admin/categories?saved=1");
  }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");

  const cms = await readCms();
  const hasProducts = cms.products.some((p) => p.categoryId === id);
  if (hasProducts) {
    redirect("/admin/categories?error=has_products");
  }

  await updateCms((data) => {
    data.categories = data.categories.filter((item) => item.id !== id);
  });
  refresh();
  redirect("/admin/categories?deleted=1");
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/media?error=file");
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
  if (!allowed.includes(file.type)) {
    redirect("/admin/media?error=type");
  }

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB limit for fast loading
  if (file.size > MAX_FILE_SIZE) {
    redirect("/admin/media?error=size");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let src = "";
  let filename = file.name;

  if (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    // Upload to Cloudinary CDN
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "scube_uploads",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      }
    );
    src = uploadResult.secure_url;
    filename = uploadResult.public_id;
  } else {
    // Local file fallback
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, safe), buffer);
    src = `/uploads/${safe}`;
    filename = safe;
  }

  const alt = String(formData.get("alt") || file.name).trim();
  await updateCms((data) => {
    data.media.unshift({
      id: newId("media"),
      src,
      alt,
      filename,
    });
  });
  refresh();
  redirect("/admin/media?saved=1");
}


export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const cms = await readCms();
  const item = cms.media.find((media) => media.id === id);
  await updateCms((data) => {
    data.media = data.media.filter((media) => media.id !== id);
    data.products = data.products.map((product) => ({
      ...product,
      imageIds: product.imageIds.filter((imageId) => imageId !== id),
    }));
    data.gallery = data.gallery.filter((entry) => entry.mediaId !== id);
  });

  if (item) {
    if (item.src.startsWith("/uploads/")) {
      await fs.unlink(path.join(process.cwd(), "public", item.src)).catch(() => undefined);
    } else if (
      item.filename &&
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        await cloudinary.uploader.destroy(item.filename);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }
  }
  refresh();
  redirect("/admin/media?deleted=1");
}

export async function saveGalleryAction(formData: FormData) {
  await requireAdmin();
  const mediaIds = formData.getAll("mediaIds").map(String);
  await updateCms((data) => {
    data.gallery = mediaIds.map((mediaId) => ({
      id: newId("gal"),
      mediaId,
    }));
  });
  refresh();
  redirect("/admin/gallery?saved=1");
}

export async function saveBrandAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "") || newId("brand");
  const name = String(formData.get("name") || "").trim();
  const logo = String(formData.get("logo") || "").trim();
  const products = String(formData.get("products") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!name) redirect("/admin/brands?error=missing");

  await updateCms((data) => {
    const next = { id, name, logo, products };
    const index = data.brands.findIndex((item) => item.id === id);
    if (index >= 0) data.brands[index] = next;
    else data.brands.push(next);
  });
  refresh();
  redirect("/admin/brands?saved=1");
}

export async function deleteBrandAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  await updateCms((data) => {
    data.brands = data.brands.filter((item) => item.id !== id);
  });
  refresh();
  redirect("/admin/brands?deleted=1");
}
