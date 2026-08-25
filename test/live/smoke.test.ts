import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { TraderaApiError, TraderaClient } from "../../src";

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

        // User-auth endpoints additionally need either a user token or the skey from a
        // completed token-login authorization in the environment:
        //   TRADERA_USER_ID + TRADERA_USER_TOKEN, or
        //   TRADERA_USER_ID + TRADERA_SKEY (the skey used in the token-login URL
        //   https://api.tradera.com/token-login?appId=..&pkey=..&skey=.. — the token is then
        //   fetched automatically below).
        // Read-only calls only — buyer.buy places a real, binding purchase and is never
        // exercised by tests.
        const userId = Number(process.env["TRADERA_USER_ID"]);
        const userToken = process.env["TRADERA_USER_TOKEN"];
        const secretKey = process.env["TRADERA_SKEY"];
        const hasUserAuth =
            hasCredentials && Number.isInteger(userId) && Boolean(userToken || secretKey);

        describe(
            "user-auth endpoints",
            {
                skip:
                    !hasUserAuth && "TRADERA_USER_ID with TRADERA_USER_TOKEN/TRADERA_SKEY not set",
            },
            () => {
                let userClient: TraderaClient | undefined;

                before(async () => {
                    let token = userToken;
                    if (!token) {
                        const fetched = await client!.auth.fetchToken({
                            userId,
                            secretKey: secretKey!,
                        });
                        assert.ok(
                            fetched.authToken,
                            "fetchToken returned no authToken — re-authorize the app via the token-login URL",
                        );
                        console.log(
                            `fetched user token, valid until ${fetched.hardExpirationTime.toISOString()};`,
                            "set it as TRADERA_USER_TOKEN in .env to skip this fetch:",
                        );
                        console.log(fetched.authToken);
                        token = fetched.authToken;
                    }
                    userClient = new TraderaClient({ userId, userToken: token });
                });

                it("gets the authenticated user's profile", async () => {
                    const me = await userClient!.users.getMe();
                    assert.equal(me.id, userId);
                });

                it("gets the authenticated user's payment options", async () => {
                    const options = await userClient!.users.getMyPaymentOptions();
                    assert.ok(Array.isArray(options.paymentOptions ?? []));
                });

                it("gets seller info for the authenticated user", async () => {
                    const info = await userClient!.users.getSellerInfo(userId);
                    assert.equal(typeof info.totalRating, "number");
                });

                it("gets buyer transactions", async () => {
                    const transactions = await userClient!.buyer.getTransactions();
                    assert.ok(Array.isArray(transactions));
                });

                it("gets the wishlist", async () => {
                    const wishlist = await userClient!.buyer.getWishlist();
                    assert.ok(Array.isArray(wishlist));
                });

                it("gets seller listings data", async () => {
                    const [items, transactions, updated] = await Promise.all([
                        userClient!.listings.getSellerItems(),
                        userClient!.listings.getSellerTransactions(),
                        userClient!.listings.getUpdatedSellerItems(),
                    ]);
                    assert.ok(Array.isArray(items));
                    assert.ok(Array.isArray(transactions));
                    assert.ok(Array.isArray(updated));
                });

                it("gets seller orders", async () => {
                    const orders = await userClient!.orders.getOrders();
                    assert.ok(Array.isArray(orders));
                });

                it("gets shop settings (tolerating accounts without a shop)", async () => {
                    try {
                        const settings = await userClient!.listings.getShopSettings();
                        assert.equal(typeof settings, "object");
                    } catch (error) {
                        assert.ok(error instanceof TraderaApiError, String(error));
                        console.log(
                            `shop-settings not available: ${error.status} ${error.message}`,
                        );
                    }
                });

                // The docs-sanctioned no-sandbox test path: prepare a draft listing with
                // autoCommit: false and never commit it — it is validated but never
                // published. Opt-in because it still creates a queued request on the
                // account. Enable with TRADERA_LIVE_DRAFT=1.
                it(
                    "prepares (but never commits) a draft listing",
                    {
                        skip:
                            process.env["TRADERA_LIVE_DRAFT"] !== "1" &&
                            "TRADERA_LIVE_DRAFT not set",
                    },
                    async () => {
                        const categories = await userClient!.categories.getCategories();
                        const leafCategory =
                            categories[0]!.childCategories?.[0]?.childCategories?.[0] ??
                            categories[0]!.childCategories?.[0] ??
                            categories[0]!;
                        const draft = await userClient!.listings.addItem({
                            title: "tradera-api-client draft test (never published)",
                            description: "Draft created by an API client test; never committed.",
                            categoryId: leafCategory.id,
                            itemType: 1,
                            duration: 14,
                            startPrice: 10000,
                            acceptedBidderId: 1,
                            shippingOptions: [{ shippingOptionId: 1, cost: 79 }],
                            itemAttributes: [2],
                            autoCommit: false,
                        });
                        assert.ok(draft.requestId > 0);
                        console.log("draft request:", JSON.stringify(draft));
                        const results = await userClient!.listings.getRequestResults([
                            draft.requestId,
                        ]);
                        console.log("request results:", JSON.stringify(results));
                        assert.ok(Array.isArray(results));
                        // Deliberately no commitItem call — and end the reserved item
                        // immediately as extra cleanup, per the docs' no-sandbox guidance.
                        // An uncommitted draft may not be endable; tolerate an API error.
                        try {
                            const ended = await userClient!.listings.endItem(draft.itemId);
                            console.log("draft item ended:", ended);
                        } catch (error) {
                            assert.ok(error instanceof TraderaApiError, String(error));
                            console.log(
                                `ending draft not needed/allowed: ${error.status} ${error.message}`,
                            );
                        }
                    },
                );
            },
        );
    },
);
