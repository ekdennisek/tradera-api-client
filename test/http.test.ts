import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { TraderaClient } from "../src";
import { TraderaApiError } from "../src/error";
import { fakeFetch } from "./helpers";
import itemFixture from "./fixtures/item.json";

const credentials = { appId: 1234, appKey: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" };

describe("HttpClient", () => {
    it("sends app credential headers and builds the URL", async () => {
        const { fetch, requests } = fakeFetch(200, itemFixture);
        const client = new TraderaClient({ ...credentials, fetch });
        await client.items.getItem(123456789);

        assert.equal(requests.length, 1);
        const request = requests[0]!;
        assert.equal(request.url.toString(), "https://api.tradera.com/v4/items/123456789");
        assert.equal(request.method, "GET");
        assert.equal(request.headers["X-App-Id"], "1234");
        assert.equal(request.headers["X-App-Key"], credentials.appKey);
        assert.equal(request.headers["Content-Type"], undefined);
    });

    it("serializes query parameters, dates as ISO strings, and skips undefined", async () => {
        const { fetch, requests } = fakeFetch(200, []);
        const client = new TraderaClient({ ...credentials, fetch });
        await client.items.getSellerItems(111, {
            categoryId: 20,
            minEndDate: new Date("2026-08-01T00:00:00Z"),
            maxEndDate: undefined,
        });

        const url = requests[0]!.url;
        assert.equal(url.pathname, "/v4/items/seller/111");
        assert.equal(url.searchParams.get("categoryId"), "20");
        assert.equal(url.searchParams.get("minEndDate"), "2026-08-01T00:00:00.000Z");
        assert.equal(url.searchParams.has("maxEndDate"), false);
        assert.equal(url.searchParams.has("filterActive"), false);
    });

    it("serializes array query parameters as repeated keys", async () => {
        const { fetch, requests } = fakeFetch(200, { productsPerWeightSpan: [] });
        const client = new TraderaClient({ ...credentials, fetch });
        await client.referenceData.getShippingOptions({
            fromCountryCodes: ["SE", "DE"],
            categoryIds: [1, 2],
        });

        const url = requests[0]!.url;
        assert.deepEqual(url.searchParams.getAll("fromCountryCodes"), ["SE", "DE"]);
        assert.deepEqual(url.searchParams.getAll("categoryIds"), ["1", "2"]);
    });

    it("URI-encodes path parameters built from user input", async () => {
        const { fetch, requests } = fakeFetch(200, { id: 1, alias: "KyrkornasSecondhand-Täby" });
        const client = new TraderaClient({ ...credentials, fetch });
        await client.users.getUserByAlias("KyrkornasSecondhand-Täby");

        assert.equal(requests[0]!.url.pathname, "/v4/users/by-alias/KyrkornasSecondhand-T%C3%A4by");
    });

    it("sends JSON bodies with Content-Type on POST", async () => {
        const { fetch, requests } = fakeFetch(200, { totalNumberOfItems: 0, items: [] });
        const client = new TraderaClient({ ...credentials, fetch });
        await client.search.searchAdvanced({ searchWords: "vas", categoryId: 20 });

        const request = requests[0]!;
        assert.equal(request.method, "POST");
        assert.equal(request.headers["Content-Type"], "application/json");
        assert.deepEqual(JSON.parse(request.body!), { searchWords: "vas", categoryId: 20 });
    });

    it("sends user authorization headers when configured", async () => {
        const { fetch, requests } = fakeFetch(200, undefined);
        const client = new TraderaClient({
            ...credentials,
            userId: 555,
            userToken: "user-token",
            fetch,
        });
        await client.auth.cancelBankId("order-ref");

        const request = requests[0]!;
        assert.equal(request.headers["X-User-Id"], "555");
        assert.equal(request.headers["X-User-Token"], "user-token");
    });

    it("rejects user-auth endpoints without userId/userToken", async () => {
        const { fetch, requests } = fakeFetch(200, undefined);
        const client = new TraderaClient({ ...credentials, fetch });
        await assert.rejects(client.auth.beginBankId(), /requires user authorization/);
        await assert.rejects(client.users.getMe(), /requires user authorization/);
        await assert.rejects(client.buyer.getWishlist(), /requires user authorization/);
        assert.equal(requests.length, 0);
    });

    it("sends a buy request as POST with body and user headers", async () => {
        const { fetch, requests } = fakeFetch(200, { nextBid: 0, status: 0 });
        const client = new TraderaClient({
            ...credentials,
            userId: 555,
            userToken: "user-token",
            fetch,
        });
        const result = await client.buyer.buy({ itemId: 745031047, buyAmount: 250 });

        const request = requests[0]!;
        assert.equal(request.url.pathname, "/v4/buyer/buy");
        assert.equal(request.method, "POST");
        assert.equal(request.headers["X-User-Id"], "555");
        assert.deepEqual(JSON.parse(request.body!), { itemId: 745031047, buyAmount: 250 });
        assert.equal(result.status, 0);
    });

    it("serializes wishlist filter options", async () => {
        const { fetch, requests } = fakeFetch(200, []);
        const client = new TraderaClient({
            ...credentials,
            userId: 555,
            userToken: "user-token",
            fetch,
        });
        await client.buyer.getWishlist({
            filterActive: 1,
            minEndDate: new Date("2026-08-01T00:00:00Z"),
        });

        const url = requests[0]!.url;
        assert.equal(url.pathname, "/v4/buyer/wishlist");
        assert.equal(url.searchParams.get("filterActive"), "1");
        assert.equal(url.searchParams.get("minEndDate"), "2026-08-01T00:00:00.000Z");
    });

    it("maps error envelopes to TraderaApiError", async () => {
        const { fetch } = fakeFetch(400, {
            error: { code: "SandboxNotSupported", message: "Sandbox is not supported." },
        });
        const client = new TraderaClient({ ...credentials, fetch });
        await assert.rejects(client.items.getItem(1), (error: unknown) => {
            assert.ok(error instanceof TraderaApiError);
            assert.equal(error.status, 400);
            assert.equal(error.code, "SandboxNotSupported");
            assert.equal(error.message, "Sandbox is not supported.");
            assert.equal(error.isRateLimited, false);
            return true;
        });
    });

    it("flags 429 responses as rate limited", async () => {
        const { fetch } = fakeFetch(429, "");
        const client = new TraderaClient({ ...credentials, fetch });
        await assert.rejects(client.items.getItem(1), (error: unknown) => {
            assert.ok(error instanceof TraderaApiError);
            assert.equal(error.isRateLimited, true);
            return true;
        });
    });

    it("survives non-JSON error bodies", async () => {
        const { fetch } = fakeFetch(500, "<html>Internal Server Error</html>");
        const client = new TraderaClient({ ...credentials, fetch });
        await assert.rejects(client.items.getItem(1), (error: unknown) => {
            assert.ok(error instanceof TraderaApiError);
            assert.equal(error.status, 500);
            assert.equal(error.code, undefined);
            assert.match(error.message, /status 500/);
            return true;
        });
    });

    it("falls back to TRADERA_APP_ID/TRADERA_APP_KEY env vars", async () => {
        process.env["TRADERA_APP_ID"] = "4321";
        process.env["TRADERA_APP_KEY"] = "env-app-key";
        try {
            const { fetch, requests } = fakeFetch(200, itemFixture);
            const client = new TraderaClient({ fetch });
            await client.items.getItem(1);
            assert.equal(requests[0]!.headers["X-App-Id"], "4321");
            assert.equal(requests[0]!.headers["X-App-Key"], "env-app-key");
        } finally {
            delete process.env["TRADERA_APP_ID"];
            delete process.env["TRADERA_APP_KEY"];
        }
    });
});
