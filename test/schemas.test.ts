import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { categorySchema } from "../src/schemas/categories";
import { parseTraderaDate } from "../src/schemas/common";
import { itemSchema } from "../src/schemas/items";
import { searchResultSchema } from "../src/schemas/search";
import itemFixture from "./fixtures/item.json";

describe("schemas", () => {
    it("parses a full item and coerces dates", () => {
        const item = itemSchema.parse(itemFixture);
        assert.equal(item.id, 123456789);
        // Offset-less startDate is Swedish local time (CEST in August).
        assert.equal(item.startDate.toISOString(), "2026-08-20T18:00:00.000Z");
        assert.equal(item.endDate.toISOString(), "2026-08-27T18:00:00.000Z");
        assert.equal(item.imageId, "655791754");
        assert.equal(item.numberOfImages, 5);
        assert.equal(item.seller?.alias, "seller_alias");
        assert.equal(item.shippingOptions?.[0]?.cost, 79);
        assert.equal(
            item.attributeValues?.termAttributeValues?.[0]?.values?.[0],
            "Mycket gott skick",
        );
    });

    it("tolerates unknown extra fields (beta API may add fields)", () => {
        assert.ok("someUnknownFutureField" in itemFixture);
        assert.doesNotThrow(() => itemSchema.parse(itemFixture));
    });

    it("parses a recursive category tree", () => {
        const category = categorySchema.parse({
            id: 10,
            name: "Antikt & Design",
            childCategories: [
                { id: 11, name: "Glas", childCategories: [{ id: 12, name: "Kosta Boda" }] },
            ],
        });
        assert.equal(category.childCategories?.[0]?.name, "Glas");
        assert.equal(category.childCategories?.[0]?.childCategories?.[0]?.id, 12);
    });

    it("interprets offset-less timestamps as Swedish local time", () => {
        // Summer (CEST, UTC+2) — mirrors the live API, which returns 11:42 local for an item
        // that search reports as 09:42Z.
        assert.equal(
            parseTraderaDate("2026-08-25T11:42:56.32").toISOString(),
            "2026-08-25T09:42:56.320Z",
        );
        // Winter (CET, UTC+1).
        assert.equal(
            parseTraderaDate("2026-01-15T12:00:00").toISOString(),
            "2026-01-15T11:00:00.000Z",
        );
        // Explicit offsets are respected as-is.
        assert.equal(
            parseTraderaDate("2026-08-25T09:42:56.320Z").toISOString(),
            "2026-08-25T09:42:56.320Z",
        );
    });

    it("parses a search result with nullable numeric fields", () => {
        const result = searchResultSchema.parse({
            totalNumberOfItems: 2,
            totalNumberOfPages: 1,
            items: [
                {
                    id: 1,
                    shortDescription: "Auktion",
                    buyItNowPrice: null,
                    maxBid: 100,
                    nextBid: 110,
                    hasBids: true,
                    isEnded: false,
                    endDate: "2026-09-01T12:00:00Z",
                    itemType: "Auction",
                },
                { id: 2, buyItNowPrice: 250, maxBid: null, nextBid: null },
            ],
            errors: null,
        });
        assert.equal(result.items?.length, 2);
        assert.equal(result.items?.[0]?.buyItNowPrice, null);
        assert.ok(result.items?.[0]?.endDate instanceof Date);
    });
});
