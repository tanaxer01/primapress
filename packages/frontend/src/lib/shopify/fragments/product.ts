import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    metafield(namespace: "custom", key: "related_content") {
      reference {
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            value
          }
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "autor" }
      { namespace: "custom", key: "isbn" }
      { namespace: "custom", key: "formato" }
      { namespace: "custom", key: "paginas" }
      { namespace: "custom", key: "encuadernacion" }
      { namespace: "custom", key: "idioma" }
      { namespace: "custom", key: "impresores" }
      { namespace: "custom", key: "ano" }
    ]) {
      key
      value
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
