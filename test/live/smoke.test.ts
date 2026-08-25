import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { TraderaClient } from "../../src";

// Live smoke test against the production v4 API (read-only endpoints only).
// Runs only when app credentials are present:
//   TRADERA_APP_ID=... TRADERA_APP_KEY=... npm run test:live
const hasCredentials = Boolean(process.env["TRADERA_APP_ID"] && process.env["TRADERA_APP_KEY"]);

describe(
    "live smoke test",
    { skip: !hasCredentials && "TRADERA_APP_ID/TRADERA_APP_KEY not set" },
    () => {
        const client = hasCredentials ? new TraderaClient() : undefined;

        it("gets the category tree", async () => {
            const categories = await client!.categories.getCategories();
            assert.ok(categories.length > 0);
            const root = categories[0]!;
            assert.ok(root.id !== undefined);
            // Guard against the children being stripped by a wrong property name in the schema.
            assert.ok(
                categories.some(category => (category.childCategories?.length ?? 0) > 0),
                "expected at least one category with children",
            );
        });

        it("searches and fetches one of the found items", async () => {
            const result = await client!.search.search("vas", { pageNumber: 1 });
            assert.ok((result.totalNumberOfItems ?? 0) > 0);
            assert.ok(result.items && result.items.length > 0);
            console.log("first search item:", JSON.stringify(result.items[0]).slice(0, 500));

            const item = await client!.items.getItem(result.items[0]!.id);
            assert.equal(item.id, result.items[0]!.id);
            assert.ok(item.startDate instanceof Date);
            console.log(
                "item summary:",
                JSON.stringify({
                    id: item.id,
                    itemType: item.itemType,
                    status: item.status,
                    seller: item.seller && { id: item.seller.id, alias: item.seller.alias },
                }),
            );
        });

        it("performs an advanced search", async () => {
            const result = await client!.search.searchAdvanced({
                searchWords: "vas",
                itemsPerPage: 10,
                pageNumber: 1,
            });
            assert.ok(result.items && result.items.length > 0);
        });

        it("gets attribute definitions for a category", async () => {
            const categories = await client!.categories.getCategories();
            const firstId = categories[0]!.id;
            const definitions = await client!.categories.getAttributeDefinitions(firstId);
            assert.ok(Array.isArray(definitions));
        });
    },
);
