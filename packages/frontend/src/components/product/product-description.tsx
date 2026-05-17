import type { Product } from "@/lib/shopify/types";

export function ProductDescription({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: content comes from Shopify's trusted API
      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
    />
  );
}
