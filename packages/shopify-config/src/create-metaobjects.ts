import { adminGraphql } from "./shopify-admin.js";
import { metaobjectDefinitions } from "./metaobject-definitions.js";

const CREATE_METAOBJECT_DEFINITION = `
  mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition {
        id
        type
        name
        fieldDefinitions {
          key
          name
          type {
            name
          }
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

interface CreateMetaobjectDefinitionResponse {
  metaobjectDefinitionCreate: {
    metaobjectDefinition?: {
      id: string;
      type: string;
      name: string;
      fieldDefinitions: Array<{
        key: string;
        name: string;
        type: { name: string };
      }>;
    };
    userErrors: UserError[];
  };
}

async function createMetaobjectDefinitions() {
  console.log(
    `\nCreating ${metaobjectDefinitions.length} metaobject definition(s)...\n`
  );

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const def of metaobjectDefinitions) {
    try {
      const { data, errors } =
        await adminGraphql<CreateMetaobjectDefinitionResponse>(
          CREATE_METAOBJECT_DEFINITION,
          {
            definition: {
              type: def.type,
              name: def.name,
              description: def.description,
              access: {
                storefront: "PUBLIC_READ",
              },
              capabilities: {
                publishable: {
                  enabled: true,
                },
              },
              fieldDefinitions: def.fieldDefinitions.map((field) => ({
                key: field.key,
                name: field.name,
                type: field.type,
                description: field.description,
                validations: field.required
                  ? [{ name: "required", value: "true" }]
                  : [],
              })),
            },
          }
        );

      if (errors?.length) {
        console.error(`  FAIL  ${def.type}`);
        errors.forEach((e) => console.error(`        ${e.message}`));
        failed++;
        continue;
      }

      const result = data.metaobjectDefinitionCreate;
      const userErrors = result.userErrors ?? [];

      if (userErrors.length > 0) {
        const alreadyExists = userErrors.some(
          (e) => e.code === "TAKEN" || e.code === "TYPE_ALREADY_EXISTS"
        );

        if (alreadyExists) {
          console.log(`  SKIP  ${def.type} — already exists`);
          skipped++;
        } else {
          console.error(`  FAIL  ${def.type}`);
          userErrors.forEach((e) => {
            console.error(`        ${e.field ?? ""}: ${e.message}`);
          });
          failed++;
        }
      } else {
        const createdDef = result.metaobjectDefinition;
        const fields = createdDef?.fieldDefinitions
          .map((f) => f.key)
          .join(", ");
        console.log(
          `  OK    ${def.type} — created (id: ${createdDef?.id}, fields: ${fields})`
        );
        created++;
      }
    } catch (error) {
      console.error(`  FAIL  ${def.type}`);
      console.error(
        `        ${error instanceof Error ? error.message : String(error)}`
      );
      failed++;
    }
  }

  console.log(
    `\nDone: ${created} created, ${skipped} skipped, ${failed} failed.\n`
  );

  if (failed > 0) {
    process.exit(1);
  }
}

createMetaobjectDefinitions();
