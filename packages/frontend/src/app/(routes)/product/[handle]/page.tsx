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
      <div className="h-screen w-full md:w-[60%] flex flex-col gap-2 no-scrollbar overflow-y-scroll">
        {product.images.map((item) => (
          <Image
            key={item.id}
            src={item.url}
            alt={item.altText ?? ""}
            width={item.width}
            height={item.height}
          />
        ))}
      </div>
      <div className="h-[40%] md:h-screen w-full md:w-[40%] p-5 overflow-y-scroll space-y-4">
        <p className="text-lg font-semibold">{product.title}</p>
        <div className="flex flex-col items-start gap-2">
          <PriceDisplay
            price={product.priceRange.minVariantPrice}
            compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
          />
          <AddToCart product={product} />
        </div>
        <div>
          {Object.values(product.metafields)
            .filter((item) => item?.key)
            .map((field, idx) => (
              <p key={`${field?.key}-${idx}`}>
                {field?.key ? fieldMapper[field?.key] : "Key"}: {field?.value}
              </p>
            ))}
        </div>
        <ProductDescription product={product} />
      </div>
    </div>
  );
}
