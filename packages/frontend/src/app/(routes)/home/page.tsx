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

  const sortedProducts = [...products].sort((a, b) => {
    const aId = a.metafields?.find((mf) => mf?.key === "id_libro")?.value ?? "";
    const bId = b.metafields?.find((mf) => mf?.key === "id_libro")?.value ?? "";
    const aNum = parseFloat(aId);
    const bNum = parseFloat(bId);
    if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum;
    return bId.localeCompare(aId);
  });

  return (
    <div>
      <Hero
        leftImages={heroGallery?.leftImages}
        rightImages={heroGallery?.rightImages}
      />
      <ProductTable products={sortedProducts} />
      <InfoSection content={aboutUs?.content} />
    </div>
  );
}
