import type { Product } from "@/lib/shopify/types";

export function ProductDescription({ product }: { product: Product }) {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: content comes from Shopify's trusted API
  return <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />;
}
