"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { CartSheet } from "../cart/cart-sheet";

export function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const isNearTop = currentScrollY < 10;

      if (isNearTop) {
        setIsHidden(false);
      } else if (isScrollingDown && currentScrollY > 80) {
        setIsHidden(true);
      } else if (!isScrollingDown) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed z-50 w-full flex justify-between px-5 py-2 transition-transform duration-300 ease-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
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
