import { adminGraphql } from "./shopify-admin.js";
import { metafieldDefinitions } from "./definitions.js";

const CREATE_METAFIELD_DEFINITION = `
  mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        name
        namespace
        key
        type {
          name
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

interface UserError {
  field?: string;
  message: string;
  code?: string;
}

interface CreateMetafieldResponse {
  metafieldDefinitionCreate: {
    createdDefinition?: {
      id: string;
      name: string;
      namespace: string;
      key: string;
      type: { name: string };
    };
    userErrors: UserError[];
  };
}

async function createMetafieldDefinitions() {
  console.log(`\nCreating ${metafieldDefinitions.length} metafield definition(s)...\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const def of metafieldDefinitions) {
    const identifier = `${def.namespace}.${def.key}`;

    try {
      const { data, errors } = await adminGraphql<CreateMetafieldResponse>(
        CREATE_METAFIELD_DEFINITION,
        {
          definition: {
            name: def.name,
            namespace: def.namespace,
            key: def.key,
            type: def.type,
            description: def.description,
            ownerType: "PRODUCT",
            access: {
              storefront: "PUBLIC_READ",
            },
          },
        }
      );

      if (errors?.length) {
        console.error(`  FAIL  ${identifier}`);
        errors.forEach((e) => console.error(`        ${e.message}`));
        failed++;
        continue;
      }

      const result = data.metafieldDefinitionCreate;
      const userErrors = result.userErrors ?? [];

      if (userErrors.length > 0) {
        const alreadyExists = userErrors.some(
          (e) => e.code === "TAKEN" || e.code === "RESERVED_NAMESPACE_KEY"
        );

        if (alreadyExists) {
          console.log(`  SKIP  ${identifier} — already exists`);
          skipped++;
        } else {
          console.error(`  FAIL  ${identifier}`);
          userErrors.forEach((e) => {
            console.error(`        ${e.field ?? ""}: ${e.message}`);
          });
          failed++;
        }
      } else {
        const createdDef = result.createdDefinition;
        console.log(`  OK    ${identifier} — created (id: ${createdDef?.id})`);
        created++;
      }
    } catch (error) {
      console.error(`  FAIL  ${identifier}`);
      console.error(`        ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped, ${failed} failed.\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

createMetafieldDefinitions();
