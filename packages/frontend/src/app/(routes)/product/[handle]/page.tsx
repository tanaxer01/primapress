import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/cart/add-to-cart";
import { ProductDescription } from "@/components/product/product-description";
import { PriceDisplay } from "@/components/ui/price-display";
import { getProduct } from "@/lib/shopify";

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await props.params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const fieldMapper: { [key: string]: string } = {
    id_libro: "id",
    autor: "Autor",
    isbn: "Isbn",
    formato: "Formato",
    paginas: "Páginas",
    encuadernacion: "Encuadernación",
    idioma: "Idioma",
    impresores: "Impresores",
    ano: "Año",
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="h-1/2 md:h-screen w-full md:w-[60%] flex flex-col gap-2 no-scrollbar overflow-y-scroll">
        {product.images.map((item) => (
          <Image
            key={item.id}
            src={item.url}
            alt={item.altText ?? ""}
            width={item.width}
            height={item.height}
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        ))}
      </div>
      <div className="h-1/2 md:h-screen w-full md:w-[40%] p-5 pr-10  overflow-y-scroll space-y-4">
        <p className="text-lg font-semibold">{product.title}</p>
        <div className="flex flex-col items-start gap-2">
          <PriceDisplay
            price={product.priceRange.minVariantPrice}
            compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
          />
          <AddToCart product={product} />
        </div>
        <ProductDescription product={product} className="space-y-2" />
      </div>
    </div>
  );
}
