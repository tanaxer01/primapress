import type { Product } from "@/lib/shopify/types";

export function ProductDescription({ product }: { product: Product }) {
  return <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />;
}
