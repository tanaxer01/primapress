"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProductDescription } from "@/components/product/product-description";
import { PriceDisplay } from "@/components/ui/price-display";
import type { Product } from "@/lib/shopify/types";

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

// Total number of visible columns: ID + Título + metafields + Precio + Más info
const TOTAL_COLUMNS = 2 + METAFIELD_COLUMNS.length + 2;

const FIELD_MAPPER: Record<string, string> = {
  id_libro: "ID",
  autor: "Autor",
  isbn: "Isbn",
  formato: "Formato",
  paginas: "Páginas",
  encuadernacion: "Encuadernación",
  idioma: "Idioma",
  impresores: "Impresores",
  ano: "Año",
};

// Keys that are used internally but should not appear in the detail metafields list
const HIDDEN_DETAIL_KEYS = new Set(["table_images", "table_text"]);

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

type DetailImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

function DetailCarousel({ images, title }: { images: DetailImage[]; title: string }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    setCurrent((n) => (n - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((n) => (n + 1) % images.length);
  }, [images.length]);

  const img = images[current];

  return (
    <div className="relative w-full overflow-hidden">
      <Image
        src={img.url}
        alt={img.altText ?? title}
        width={img.width}
        height={img.height}
        className="w-full h-auto object-contain"
      />

      {images.length > 1 && (
        <>
          {/* Click zones — same pattern as hero Gallery */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 top-0 h-full w-1/3 cursor-w-resize"
            aria-label="Previous image"
          />
          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-0 h-full w-2/3 cursor-e-resize"
            aria-label="Next image"
          />

          {/* Counter */}
          <div className="absolute bottom-2 right-3 text-xs text-white mix-blend-difference">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

function ProductDetail({ product }: { product: Product }) {
  // Prefer tableImages metafield; fall back to product images array
  const tableImages: DetailImage[] =
    product.tableImages?.references?.edges?.map((edge) => edge.node.image) ?? [];
  const fallbackImages: DetailImage[] =
    product.images.length > 0
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : [];
  const displayImages = tableImages.length > 0 ? tableImages : fallbackImages;

  // Prefer table_text metafield; fall back to product description HTML
  const tableTextValue = product.metafields?.find(
    (mf) => mf?.key === "table_text",
  )?.value;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Left: carousel */}
      {displayImages.length > 0 && (
        <div className="w-full md:w-1/2 flex-shrink-0">
          <DetailCarousel images={displayImages} title={product.title} />
        </div>
      )}

      {/* Right: product info + table_text or description */}
      <div className="w-full md:w-1/2 space-y-4 text-sm">
        <p className="text-lg font-semibold">{product.title}</p>
        <div>
          {product.metafields
            .filter((item) => item?.key && !HIDDEN_DETAIL_KEYS.has(item.key))
            .map((field, idx) => (
              <p key={`${field?.key}-${idx}`}>
                {field?.key ? FIELD_MAPPER[field.key] : "Key"}: {field?.value}
              </p>
            ))}
        </div>
        {tableTextValue ? (
          <div className="whitespace-pre-line">{tableTextValue}</div>
        ) : (
          <ProductDescription product={product} />
        )}
      </div>
    </div>
  );
}

export function ProductTable({ products }: { products: Product[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleRow(productId: string) {
    setExpandedId((prev) => (prev === productId ? null : productId));
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-t border-black">
          <th className="py-2 pl-4 text-left font-normal">ID</th>
          <th className="py-2 text-left font-normal">Título</th>
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
        {products.map((product) => {
          const isExpanded = expandedId === product.id;

          return (
            <ProductTableRow
              key={product.id}
              product={product}
              isExpanded={isExpanded}
              onToggle={() => toggleRow(product.id)}
            />
          );
        })}
      </tbody>
    </table>
  );
}

function ProductTableRow({
  product,
  isExpanded,
  onToggle,
}: {
  product: Product;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (isExpanded && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isExpanded]);

  return (
    <>
      <tr
        ref={rowRef}
        onClick={onToggle}
        className={`border-b border-black cursor-pointer transition-colors hover:text-blue-500 scroll-mt-10 ${
          isExpanded ? "text-blue-500" : ""
        }`}
      >
        <td className="py-2 pl-4">{getMetafieldValue(product.metafields, "id_libro")}</td>
        <td className="py-2">{product.title}</td>
        {METAFIELD_COLUMNS.map((col) => (
          <td
            key={col.key}
            className={`py-2 ${visibilityClass(col.minBreakpoint)}`}
          >
            {getMetafieldValue(product.metafields, col.key)}
          </td>
        ))}
        <td className="py-2 text-right">
          <PriceDisplay
            price={product.priceRange.minVariantPrice}
            compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
          />
        </td>
        <td className="py-2 pr-4 text-right">
          <Link
            href={`/product/${product.handle}`}
            className="underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            Más info
          </Link>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b border-black">
          <td colSpan={TOTAL_COLUMNS}>
            <ProductDetail product={product} />
          </td>
        </tr>
      )}
    </>
  );
}
