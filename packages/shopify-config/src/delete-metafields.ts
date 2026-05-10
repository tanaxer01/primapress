import { adminGraphql } from "./shopify-admin.js";

// Usage: tsx delete-metafields.ts custom.table_images custom.catalog_front
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("\nUsage: pnpm run delete-metafields <namespace.key> [namespace.key ...]\n");
  console.error("  Example: pnpm run delete-metafields custom.table_images custom.catalog_front\n");
  process.exit(1);
}

const TO_DELETE = args.map((arg) => {
  const dotIndex = arg.indexOf(".");
  if (dotIndex === -1) {
    console.error(`\nInvalid argument "${arg}" — expected format: namespace.key\n`);
    process.exit(1);
  }
  return { namespace: arg.slice(0, dotIndex), key: arg.slice(dotIndex + 1) };
});

const FIND_METAFIELD_DEFINITION = `
  query FindMetafieldDefinition($namespace: String!, $key: String!, $ownerType: MetafieldOwnerType!) {
    metafieldDefinitions(namespace: $namespace, key: $key, ownerType: $ownerType, first: 1) {
      nodes {
        id
      }
    }
  }
`;

const DELETE_METAFIELD_DEFINITION = `
  mutation DeleteMetafieldDefinition($id: ID!, $deleteAllAssociatedMetafields: Boolean!) {
    metafieldDefinitionDelete(id: $id, deleteAllAssociatedMetafields: $deleteAllAssociatedMetafields) {
      deletedDefinitionId
      userErrors {
        field
        message
        code
      }
    }
  }
`;

interface FindMetafieldResponse {
  metafieldDefinitions: {
    nodes: { id: string }[];
  };
}

interface DeleteMetafieldResponse {
  metafieldDefinitionDelete: {
    deletedDefinitionId?: string;
    userErrors: { field?: string; message: string; code?: string }[];
  };
}

async function deleteMetafieldDefinitions() {
  console.log(`\nDeleting ${TO_DELETE.length} metafield definition(s)...\n`);

  let deleted = 0;
  let skipped = 0;
  let failed = 0;

  for (const { namespace, key } of TO_DELETE) {
    const identifier = `${namespace}.${key}`;

    try {
      const { data: findData } = await adminGraphql<FindMetafieldResponse>(
        FIND_METAFIELD_DEFINITION,
        { namespace, key, ownerType: "PRODUCT" }
      );

      const id = findData?.metafieldDefinitions?.nodes?.[0]?.id;
      if (!id) {
        console.log(`  SKIP  ${identifier} — not found in Shopify`);
        skipped++;
        continue;
      }

      const { data, errors } = await adminGraphql<DeleteMetafieldResponse>(
        DELETE_METAFIELD_DEFINITION,
        { id, deleteAllAssociatedMetafields: true }
      );

      if (errors?.length) {
        console.error(`  FAIL  ${identifier}`);
        errors.forEach((e) => console.error(`        ${e.message}`));
        failed++;
        continue;
      }

      const userErrors = data?.metafieldDefinitionDelete?.userErrors ?? [];
      if (userErrors.length > 0) {
        console.error(`  FAIL  ${identifier}`);
        userErrors.forEach((e) => console.error(`        ${e.field ?? ""}: ${e.message}`));
        failed++;
      } else {
        console.log(`  OK    ${identifier} — deleted`);
        deleted++;
      }
    } catch (error) {
      console.error(`  FAIL  ${identifier}`);
      console.error(`        ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  }

  console.log(`\nDone: ${deleted} deleted, ${skipped} skipped, ${failed} failed.\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

deleteMetafieldDefinitions();
