import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buyerTransactionSchema } from "../src/schemas/buyer";
import { categorySchema } from "../src/schemas/categories";
import { validateCampaignCodeResultSchema } from "../src/schemas/listings";
import { sellerOrderSchema } from "../src/schemas/orders";
import { parseTraderaDate } from "../src/schemas/common";
import { itemSchema } from "../src/schemas/items";
import { officialTimeSchema } from "../src/schemas/referenceData";
import { searchResultSchema } from "../src/schemas/search";
import { feedbackSchema } from "../src/schemas/users";
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

    it("parses the official time in both documented response shapes", () => {
        const fromString = officialTimeSchema.parse("2026-03-17T14:30:00Z");
        assert.equal(fromString.toISOString(), "2026-03-17T14:30:00.000Z");
        const fromObject = officialTimeSchema.parse({ time: "2026-03-17T14:30:00Z" });
        assert.equal(fromObject.toISOString(), "2026-03-17T14:30:00.000Z");
    });

    it("parses feedback with date coercion", () => {
        const feedback = feedbackSchema.parse({
            feedbackRole: 0,
            feedbackRating: 3,
            alias: "someone",
            comment: "Snabb leverans!",
            created: "2026-08-01T10:00:00",
            totalRating: 42,
        });
        assert.equal(feedback.created.toISOString(), "2026-08-01T08:00:00.000Z");
    });

    it("parses a seller order with nested payments and items", () => {
        const order = sellerOrderSchema.parse({
            orderId: 10187,
            createdDate: "2026-08-20T12:00:00",
            expiresDate: null,
            lastUpdatedDate: "2026-08-21T09:30:00",
            subTotal: 250,
            seller: { userId: 111, alias: "seller_alias" },
            buyer: { userId: 222, firstName: "Anna", city: "Täby" },
            shipTo: { name: "Anna A", addressLine1: "Gatan 1", zipCode: "18300", city: "Täby" },
            items: [
                {
                    itemId: 745031047,
                    type: 1,
                    title: "Vas",
                    quantity: 1,
                    unitPrice: 250,
                    vatRate: 0,
                    ownReferences: [],
                    merchantPartNumber: null,
                },
            ],
            sellerOrderPayments: [
                {
                    paymentType: "TraderaDirectPayment",
                    reference: "abc",
                    additionalInfo: [{ key: "k", value: "v" }],
                    amount: 309,
                    paidDate: "2026-08-20T12:05:00",
                    paymentCost: 0,
                },
            ],
            shippingType: "PostNord",
            shippingCost: 59,
            shippingWeight: 2,
            purchaseOrderId: "PO-1",
        });
        assert.equal(order.createdDate.toISOString(), "2026-08-20T10:00:00.000Z");
        assert.equal(order.items?.[0]?.title, "Vas");
        assert.equal(order.sellerOrderPayments?.[0]?.amount, 309);
    });

    it("parses a campaign code validation result", () => {
        const result = validateCampaignCodeResultSchema.parse({
            isValid: false,
            isInvalidBecauseDoesNotExist: true,
            isInvalidBecauseHasNotStarted: false,
            isInvalidBecauseHasEnded: false,
            isInvalidBecauseCategoryIsNotAllowed: false,
            isInvalidBecauseAlreadyUsed: false,
            isInvalidBecauseUserIsNotAllowed: false,
            description: null,
            discountFactor: null,
            provisionFactor: null,
            maxFeeCap: null,
            isCustomLengthFeeFree: false,
            isUnsoldFeeFree: false,
        });
        assert.equal(result.isValid, false);
        assert.equal(result.isInvalidBecauseDoesNotExist, true);
    });

    it("parses a buyer transaction with date coercion", () => {
        const transaction = buyerTransactionSchema.parse({
            id: 1,
            date: "2026-08-20T12:00:00",
            amount: 250,
            lastUpdatedDate: "2026-08-21T09:30:00",
            isMarkedAsPaidConfirmed: true,
            isMarkedAsShipped: false,
            isShippingBooked: false,
            isFeedbackLeftBySeller: false,
            isFeedbackLeftByBuyer: true,
            buyer: null,
            seller: { id: 111, alias: "seller_alias" },
            item: { id: 745031047, type: 1, title: "Vas", ownReferences: [] },
            isMarkedAsPaid: true,
        });
        assert.equal(transaction.date.toISOString(), "2026-08-20T10:00:00.000Z");
        assert.equal(transaction.item?.title, "Vas");
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
