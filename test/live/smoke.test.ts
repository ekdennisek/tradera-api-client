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

        it("gets the official time", async () => {
            const time = await client!.referenceData.getOfficialTime();
            // Within an hour of local now — catches both misparsing and a wrong response shape.
            assert.ok(Math.abs(time.getTime() - Date.now()) < 60 * 60 * 1000);
        });

        it("gets reference data lists", async () => {
            const [itemTypes, counties, fieldValues] = await Promise.all([
                client!.referenceData.getItemTypes(),
                client!.referenceData.getCounties(),
                client!.referenceData.getItemFieldValues(),
            ]);
            assert.ok(itemTypes.length > 0);
            assert.ok(itemTypes[0]!.id !== undefined);
            assert.ok(counties.length > 0);
            assert.ok((fieldValues.itemAttributes?.length ?? 0) > 0);
        });

        it("gets shipping options for Sweden", async () => {
            const options = await client!.referenceData.getShippingOptions({
                fromCountryCodes: ["SE"],
            });
            assert.ok((options.productsPerWeightSpan?.length ?? 0) > 0);
        });

        it("looks up a user by alias and gets their feedback", async () => {
            const result = await client!.search.search("vas", { pageNumber: 1 });
            const searchItem = result.items?.find(item => item.sellerAlias);
            assert.ok(searchItem?.sellerAlias);

            const user = await client!.users.getUserByAlias(searchItem.sellerAlias);
            assert.equal(user.id, searchItem.sellerId);

            const summary = await client!.users.getFeedbackSummary(user.id);
            assert.equal(summary.userId, user.id);

            const feedback = await client!.users.getFeedback(user.id, { maxNumberOfItems: 5 });
            assert.ok(Array.isArray(feedback));
        });

        it("gets attribute definitions for a category", async () => {
            const categories = await client!.categories.getCategories();
            const firstId = categories[0]!.id;
            const definitions = await client!.categories.getAttributeDefinitions(firstId);
            assert.ok(Array.isArray(definitions));
        });
    },
);
