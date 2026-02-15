import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";

// Metafield columns between Título (always visible) and Precio/Más info
// (always visible). Columns disappear from the RIGHT as the screen shrinks.
// The leftmost columns survive longest.
const METAFIELD_COLUMNS = [
  { key: "autor", label: "Autor", minBreakpoint: undefined },
  { key: "isbn", label: "Isbn", minBreakpoint: "sm" },
  { key: "formato", label: "Formato", minBreakpoint: "sm" },
  { key: "paginas", label: "Páginas", minBreakpoint: "md" },
  { key: "encuadernacion", label: "Encuadernación", minBreakpoint: "md" },
  { key: "idioma", label: "Idioma", minBreakpoint: "lg" },
  { key: "impresores", label: "Impresores", minBreakpoint: "lg" },
  { key: "ano", label: "Año", minBreakpoint: "xl" },
] as const;

const BREAKPOINT_CLASSES: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

function visibilityClass(minBreakpoint: string | undefined): string {
  if (!minBreakpoint) return "";
  return BREAKPOINT_CLASSES[minBreakpoint] ?? "";
}

function getMetafieldValue(
  metafields: Product["metafields"],
  key: string,
): string {
  const field = metafields?.find((mf) => mf?.key === key);
  return field?.value ?? "NA";
}

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-t border-black">
          <th className="py-2 pl-4 text-left font-normal">Título</th>
          {METAFIELD_COLUMNS.map((col) => (
            <th
              key={col.key}
              className={`py-2 text-left font-normal ${visibilityClass(col.minBreakpoint)}`}
            >
              {col.label}
            </th>
          ))}
          <th className="py-2 text-right font-normal">Precio</th>
          <th className="py-2 pr-4 text-right font-normal" />
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product.id}
            className="border-b border-black transition-colors hover:text-blue-500"
          >
            <td className="py-2 pl-4">{product.title}</td>
            {METAFIELD_COLUMNS.map((col) => (
              <td
                key={col.key}
                className={`py-2 ${visibilityClass(col.minBreakpoint)}`}
              >
                {getMetafieldValue(product.metafields, col.key)}
              </td>
            ))}
            <td className="py-2 text-right">
              {formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode,
              )}
            </td>
            <td className="py-2 pr-4 text-right">
              <Link
                href={`/product/${product.handle}`}
                className="underline underline-offset-2"
              >
                Más info
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
