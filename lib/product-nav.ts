import type { Category, Product, MediaItem } from "@/lib/cms/types";

export type { Category, Product, MediaItem };

export function getProductImage(product: Product, media: MediaItem[]): string | null {
  if (!product.imageIds || product.imageIds.length === 0) return null;
  const match = media.find((m) => m.id === product.imageIds[0]);
  return match?.src || null;
}
