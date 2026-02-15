"use client";
import { useTransition } from "react";
import type { Product } from "@/lib/shopify/types";
import { Button } from "../ui/button";
import { addItem } from "./actions";
import { useCart } from "./cart-context";

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem, setCart, toggleSheet } = useCart();
  const [isPending, startTransition] = useTransition();

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const finalVariant = variants.find(
    (variant) => variant.id === defaultVariantId,
  )!;

  if (!availableForSale) return <Button disabled={true}>Out of stock!</Button>;

  return (
    <Button
      variant="link"
      className="font-bold p-0 hover:text-blue-600"
      disabled={isPending}
      onClick={() => {
        // Optimistic update + open sheet immediately
        addCartItem(finalVariant, product);
        toggleSheet();

        // Fire server action in the background, sync real cart on success
        startTransition(async () => {
          const result = await addItem(defaultVariantId);
          if (typeof result !== "string") {
            setCart(result);
          }
        });
      }}
    >
      comprar
    </Button>
  );
}
