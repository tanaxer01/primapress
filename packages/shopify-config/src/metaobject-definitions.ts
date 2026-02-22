/**
 * Metaobject definitions for store content.
 *
 * To add a new metaobject, append an entry to this array and re-run:
 *   pnpm run create-metaobjects
 *
 * Field types reference:
 *   single_line_text_field, multi_line_text_field, rich_text_field,
 *   file_reference, list.file_reference, boolean, number_integer,
 *   number_decimal, date, date_time, color, url, json
 *
 * Full list: https://shopify.dev/docs/apps/build/custom-data/metaobjects
 */

export interface MetaobjectFieldDefinition {
  key: string;
  name: string;
  type: string;
  description?: string;
  required?: boolean;
}

export interface MetaobjectDefinition {
  type: string;
  name: string;
  description?: string;
  fieldDefinitions: MetaobjectFieldDefinition[];
}

export const metaobjectDefinitions: MetaobjectDefinition[] = [
  {
    type: "hero_gallery",
    name: "Hero Gallery",
    description: "Images for the homepage hero section (left and right galleries)",
    fieldDefinitions: [
      {
        key: "left_images",
        name: "Left Gallery Images",
        type: "list.file_reference",
        description: "Images displayed in the left gallery of the hero section",
      },
      {
        key: "right_images",
        name: "Right Gallery Images",
        type: "list.file_reference",
        description: "Images displayed in the right gallery of the hero section",
      },
    ],
  },
  {
    type: "about_us",
    name: "About Us",
    description: "Content for the info/about us section of the homepage",
    fieldDefinitions: [
      {
        key: "content",
        name: "Content",
        type: "multi_line_text_field",
        description: "Main text content for the about us section",
      },
    ],
  },
];
