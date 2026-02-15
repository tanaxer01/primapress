import { Suspense } from "react";
import { CartProvider } from "@/components/cart/cart-context";
import Navbar from "@/components/Navbar";
import { getCart } from "@/lib/shopify";

export default function NavbarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cart = getCart();

  return (
    <Suspense>
      <CartProvider cartPromise={cart}>
        <Navbar />
        {children}
      </CartProvider>
    </Suspense>
  );
}
