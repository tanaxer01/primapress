const imageFragment = /* GraphQL */ `
  fragment MetaobjectImage on MediaImage {
    image {
      url
      altText
      width
      height
    }
  }
`;

export const getHeroGalleryQuery = /* GraphQL */ `
  query GetHeroGallery {
    metaobjects(type: "hero_gallery", first: 1) {
      edges {
        node {
          id
          handle
          fields {
            key
            references(first: 20) {
              edges {
                node {
                  ...MetaobjectImage
                }
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getAboutUsQuery = /* GraphQL */ `
  query GetAboutUs {
    metaobjects(type: "about_us", first: 1) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
          }
        }
      }
    }
  }
`;
