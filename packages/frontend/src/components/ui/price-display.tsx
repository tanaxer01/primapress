import type { Money } from "@/lib/shopify/types";
import { formatPrice, isOnSale } from "@/lib/utils";

/**
 * Displays a product price with optional discount styling.
 *
 * When compareAtPrice is provided and greater than price, shows the original
 * price with a strikethrough and the current (sale) price.
 */
export function PriceDisplay({
  price,
  compareAtPrice,
  className = "",
}: {
  price: Money;
  compareAtPrice?: Money | null;
  className?: string;
}) {
  const onSale = isOnSale(compareAtPrice?.amount, price.amount);

  if (!onSale) {
    return (
      <span className={className}>
        {formatPrice(price.amount, price.currencyCode)}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span className="line-through text-neutral-400">
        {formatPrice(compareAtPrice!.amount, compareAtPrice!.currencyCode)}
      </span>
      <span>{formatPrice(price.amount, price.currencyCode)}</span>
    </span>
  );
}
