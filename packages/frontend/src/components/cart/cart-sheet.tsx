"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { createCartAndSetCookie } from "./actions";
import { useCart } from "./cart-context";
import { CartDetail } from "./cart-detail";

export function CartSheet() {
  const { cart, open, toggleSheet } = useCart();
  const itemAmount = cart.lines.reduce((acc, curr) => acc + curr.quantity, 0);

  useEffect(() => {
    if (!cart.id) createCartAndSetCookie();
  }, [cart.id]);

  return (
    <Sheet open={open} onOpenChange={toggleSheet}>
      <SheetTrigger>carrito ({itemAmount})</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Carrito de compras</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <CartDetail />
        </div>

        {cart.lines.length > 0 && (
          <SheetFooter>
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-sm font-medium">Total</span>
              <span className="text-base font-semibold">
                {formatPrice(
                  cart.cost.totalAmount.amount,
                  cart.cost.totalAmount.currencyCode,
                )}
              </span>
            </div>
            <Button asChild className="w-full" onClick={toggleSheet}>
              <Link href="/checkout">Terminar compra</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
