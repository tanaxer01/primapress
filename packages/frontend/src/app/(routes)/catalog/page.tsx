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
      {products.map((item) => (
        <Link key={item.id} href={`/product/${item.handle}`}>
          <div className="relative flex justify-center items-center border border-black hover:text-blue-600">
            <Image
              className="aspect-square w-[432px]"
              src={item.images[0].url}
              width={item.images[0].width}
              height={item.images[0].height}
              alt={item.title}
            />
            <div className="absolute bottom-1 w-full p-2 flex justify-between items-end">
              <span>{item.title}</span>
              <PriceDisplay
                price={item.priceRange.minVariantPrice}
                compareAtPrice={item.compareAtPriceRange?.minVariantPrice}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
