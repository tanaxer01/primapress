"use client";

import { useFormStatus } from "react-dom";
import { redirectToCheckout } from "@/components/cart/actions";
import { useCart } from "@/components/cart/cart-context";
import { CartDetail } from "@/components/cart/cart-detail";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { cart } = useCart();

  return (
    <div className="flex justify-center pt-15">
      <div className="flex flex-col w-[80%] max-w-[800px]">
        <div className="py-8">
          <p className="font-bold text-xl">Resumen de la compra</p>
        </div>

        <CartDetail />

        {cart.lines.length > 0 && (
          <div className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium">Total</span>
              <span className="text-lg font-semibold">
                {formatPrice(
                  cart.cost.totalAmount.amount,
                  cart.cost.totalAmount.currencyCode,
                )}
              </span>
            </div>
            <form action={redirectToCheckout}>
              <CheckoutButton />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Procesando..." : "Ir al pago"}
    </Button>
  );
}
