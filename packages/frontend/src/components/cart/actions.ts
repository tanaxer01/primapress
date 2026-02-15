"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TAGS } from "@/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

export async function addItem(
  selectedVariantId: string | undefined,
): Promise<Cart | string> {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    const cart = await addToCart([
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart, "seconds");
    return cart;
  } catch {
    return "Error adding item to cart";
  }
}

export async function removeItem(
  merchandiseId: string,
): Promise<Cart | string> {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem?.id) {
      const updatedCart = await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart, "seconds");
      return updatedCart;
    } else {
      return "Item not found in cart";
    }
  } catch {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(payload: {
  merchandiseId: string;
  quantity: number;
}): Promise<Cart | string> {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem?.id) {
      if (quantity === 0) {
        const updatedCart = await removeFromCart([lineItem.id]);
        revalidateTag(TAGS.cart, "seconds");
        return updatedCart;
      } else {
        const updatedCart = await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
        revalidateTag(TAGS.cart, "seconds");
        return updatedCart;
      }
    } else if (quantity > 0) {
      const updatedCart = await addToCart([{ merchandiseId, quantity }]);
      revalidateTag(TAGS.cart, "seconds");
      return updatedCart;
    }

    return cart;
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  const cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  const cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
