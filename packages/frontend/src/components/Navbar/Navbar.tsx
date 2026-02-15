import Link from "next/link";
import { Suspense } from "react";
import { CartSheet } from "../cart/cart-sheet";

export function Navbar() {
  return (
    <nav className="fixed z-50 w-full flex justify-between px-5 py-2">
      <div className="flex gap-5">
        <Link href="/home" prefetch={true}>
          primapress
        </Link>
        <Link href="/home#info">info</Link>
        <Link href="/catalog" prefetch={true}>
          catalog
        </Link>
      </div>
      <Suspense>
        <CartSheet />
      </Suspense>
    </nav>
  );
}
