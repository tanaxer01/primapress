"use client";

import Image from "next/image";
import { useTransition } from "react";
import type { CartItem } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { updateItemQuantity } from "./actions";
import { useCart } from "./cart-context";

function QuantityControls({ item }: { item: CartItem }) {
  const { updateCartItem, setCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const merchandiseId = item.merchandise.id;

  function handleUpdate(newQuantity: number) {
    // Optimistic update
    if (newQuantity === 0) {
      updateCartItem(merchandiseId, "delete");
    } else if (newQuantity < item.quantity) {
      updateCartItem(merchandiseId, "minus");
    } else {
      updateCartItem(merchandiseId, "plus");
    }

    // Server sync
    startTransition(async () => {
      const result = await updateItemQuantity({
        merchandiseId,
        quantity: newQuantity,
      });
      if (typeof result !== "string") {
        setCart(result);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 text-xs"
        disabled={isPending}
        onClick={() => handleUpdate(item.quantity - 1)}
      >
        -
      </Button>
      <span className="text-sm w-5 text-center">{item.quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 text-xs"
        disabled={isPending}
        onClick={() => handleUpdate(item.quantity + 1)}
      >
        +
      </Button>
    </div>
  );
}

function DetailItem({ item }: { item: CartItem }) {
  const product = item.merchandise.product;

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? ""}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{product.title}</p>
          <p className="text-sm font-medium whitespace-nowrap">
            {formatPrice(
              item.cost.totalAmount.amount,
              item.cost.totalAmount.currencyCode,
            )}
          </p>
        </div>

        <QuantityControls item={item} />
      </div>
    </div>
  );
}

export function CartDetail() {
  const { cart } = useCart();

  if (cart.lines.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        Tu carrito esta vacio.
      </p>
    );
  }

  return (
    <div className="divide-y">
      {cart.lines.map((item) => (
        <DetailItem key={item.id ?? item.merchandise.id} item={item} />
      ))}
    </div>
  );
}
