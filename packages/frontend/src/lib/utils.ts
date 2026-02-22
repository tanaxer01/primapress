import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(Number(amount));
}

/**
 * Returns true if the compareAt amount is greater than the current amount,
 * meaning the product is on sale / has a discount.
 */
export function isOnSale(
  compareAtAmount: string | undefined | null,
  currentAmount: string,
): boolean {
  if (!compareAtAmount) return false;
  return Number(compareAtAmount) > Number(currentAmount);
}
