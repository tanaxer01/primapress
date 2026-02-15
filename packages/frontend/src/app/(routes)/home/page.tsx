import { connection } from "next/server";

import { Hero } from "@/components/home/hero";
import { InfoSection } from "@/components/home/info-section";
import { ProductTable } from "@/components/ProductTable/Table";
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  await connection();
  const products = await getProducts({});

  return (
    <div>
      <Hero />
      <ProductTable products={products} />
      <InfoSection />
    </div>
  );
}
