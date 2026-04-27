import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { PriceDisplay } from "@/components/ui/price-display";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";

export default async function CatalogPage() {
  await connection();
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === "latest-desc") || defaultSort;
  const products = await getProducts({ sortKey, reverse });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((item) => {
        const frontImage =
          item.catalogFront?.reference?.image ?? item.images[0];
        const backImage = item.catalogBack?.reference?.image ?? null;

        return (
          <Link key={item.id} href={`/product/${item.handle}`}>
            {/* Container locked to the native 4500×3417 ratio of the catalog images */}
            <div className="group relative w-full aspect-[4500/3417] border border-black overflow-hidden">
              {/* Front image — always visible, hidden on hover when back exists */}
              <Image
                className={`object-contain w-full h-full ${backImage ? "group-hover:opacity-0 transition-opacity duration-200" : ""}`}
                src={frontImage.url}
                width={frontImage.width}
                height={frontImage.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={item.title}
              />

              {/* Back image — hidden by default, shown on hover */}
              {backImage && (
                <Image
                  className="object-contain w-full h-full absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  src={backImage.url}
                  width={backImage.width}
                  height={backImage.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={`${item.title} - back`}
                />
              )}

              <div className="absolute bottom-1 w-full p-2 flex justify-between items-end text-blue-600 group-hover:text-white transition-colors duration-200">
                <span>{item.title}</span>
                <PriceDisplay
                  price={item.priceRange.minVariantPrice}
                  compareAtPrice={item.compareAtPriceRange?.minVariantPrice}
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
