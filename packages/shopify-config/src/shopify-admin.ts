import { env } from "./config.js";

// Normalize shop: accept "my-store", "my-store.myshopify.com", or full URL
function getShopDomain(): string {
  let shop = env.SHOPIFY_SHOP.trim();
  shop = shop.replace(/^https?:\/\//, "");
  shop = shop.replace(/\/.*$/, "");
  if (!shop.includes(".")) {
    shop = `${shop}.myshopify.com`;
  }
  return shop;
}

const SHOP_DOMAIN = getShopDomain();

let token: string | null = null;
let tokenExpiresAt = 0;

/**
 * Obtains an Admin API access token using the client credentials grant.
 * Tokens expire after 24 hours; this function caches and auto-refreshes.
 * https://shopify.dev/docs/apps/build/dev-dashboard/get-api-access-tokens
 */
async function getToken(): Promise<string> {
  if (token && Date.now() < tokenExpiresAt - 60_000) return token;

  const tokenUrl = `https://${SHOP_DOMAIN}/admin/oauth/access_token`;
  console.log(`  Requesting token from: ${tokenUrl}`);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    let errorDetail: string;

    if (contentType.includes("application/json")) {
      const json = await response.json();
      errorDetail = JSON.stringify(json, null, 2);
    } else {
      // HTML error page — extract just the useful part
      const text = await response.text();
      const titleMatch = text.match(/<title>(.*?)<\/title>/i);
      errorDetail = titleMatch ? titleMatch[1] : `(HTML response, ${text.length} bytes)`;
    }

    console.error(`\n  Token request failed (HTTP ${response.status}):`);
    console.error(`  ${errorDetail}`);
    console.error(`\n  Checklist:`);
    console.error(`    1. SHOPIFY_SHOP should be your store handle (e.g., "my-store")`);
    console.error(`       Currently resolving to: ${SHOP_DOMAIN}`);
    console.error(`    2. SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET must be from Dev Dashboard > Settings`);
    console.error(`    3. App must have a released version with scopes: write_products, read_products`);
    console.error(`    4. App must be installed on the store (Dev Dashboard > Home > Install app)\n`);
    process.exit(1);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
    scope: string;
  };

  token = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  console.log(`  Token obtained (scopes: ${data.scope})`);
  return token;
}

/**
 * Execute a GraphQL query/mutation against the Shopify Admin API.
 */
export async function adminGraphql<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<{ data: T; errors?: Array<{ message: string; extensions?: Record<string, unknown> }> }> {
  const accessToken = await getToken();

  const response = await fetch(
    `https://${env.SHOPIFY_SHOP}.myshopify.com/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GraphQL request failed (${response.status}): ${body}`);
  }

  return (await response.json()) as {
    data: T;
    errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
  };
}
