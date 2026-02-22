import { connection } from "next/server";

import { Hero } from "@/components/home/hero";
import { InfoSection } from "@/components/home/info-section";
import { ProductTable } from "@/components/ProductTable/Table";
import { getAboutUs, getHeroGallery, getProducts } from "@/lib/shopify";

export default async function HomePage() {
  await connection();
  const [products, heroGallery, aboutUs] = await Promise.all([
    getProducts({}),
    getHeroGallery(),
    getAboutUs(),
  ]);

  return (
    <div>
      <Hero
        leftImages={heroGallery?.leftImages}
        rightImages={heroGallery?.rightImages}
      />
      <ProductTable products={products} />
      <InfoSection content={aboutUs?.content} />
    </div>
  );
}
