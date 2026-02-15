/**
 * Metafield definitions for products.
 *
 * To add a new metafield, append an entry to this array and re-run:
 *   pnpm run create-metafields
 *
 * Available types:
 *   single_line_text_field, multi_line_text_field, number_integer,
 *   number_decimal, date, date_time, boolean, color, url, json,
 *   weight, dimension, volume, rating
 *
 * Full list: https://shopify.dev/docs/apps/build/metafields/list-of-data-types
 */

export interface MetafieldDefinition {
  name: string;
  key: string;
  namespace: string;
  type: string;
  description: string;
}

export const metafieldDefinitions: MetafieldDefinition[] = [
  {
    name: "Autor",
    key: "autor",
    namespace: "custom",
    type: "single_line_text_field",
    description: "Autor del libro",
  },
  {
    name: "ISBN",
    key: "isbn",
    namespace: "custom",
    type: "single_line_text_field",
    description: "ISBN del libro",
  },
  {
    name: "Formato",
    key: "formato",
    namespace: "custom",
    type: "single_line_text_field",
    description: "ISBN del libro",
  },
  {
    name: "Páginas",
    key: "paginas",
    namespace: "custom",
    type: "single_line_text_field",
    description: "Cant de páginas del libro",
  },
  {
    name: "Encuadernación",
    key: "encuadernacion",
    namespace: "custom",
    type: "single_line_text_field",
    description: "Tipo de encuadernación del libro",
  },
  {
    name: "Idioma",
    key: "idioma",
    namespace: "custom",
    type: "single_line_text_field",
    description: "Idioma del libro",
  },
  {
    name: "Impresores",
    key: "impresores",
    namespace: "custom",
    type: "single_line_text_field",
    description: "Impresores del libro",
  },
  {
    name: "Año",
    key: "ano",
    namespace: "custom",
    type: "single_line_text_field",
    description: "Año de publicación",
  }
];
