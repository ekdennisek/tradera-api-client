# Tradera API client

A Node.js client for the official [Tradera REST API (v4)](https://api.tradera.com/documentation), written in TypeScript. All responses are validated at runtime with [zod](https://github.com/colinhacks/zod).

> **Beta:** the Tradera v4 API is in beta. The API's endpoints and response shapes may change without notice.

## Requirements

-   Node.js 18 or later (native `fetch`)
-   A Tradera developer account with an application (AppId + AppKey) — register at [api.tradera.com](https://api.tradera.com)

## Installation

```
npm install tradera-api-client
```

## Usage

```ts
import { TraderaClient } from "tradera-api-client";

const client = new TraderaClient({ appId: 1234, appKey: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" });

const item = await client.items.getItem(123456789);
console.log(item.shortDescription, item.endDate);

const result = await client.search.search("vas", { pageNumber: 1 });
console.log(result.totalNumberOfItems);
```

If `appId`/`appKey` are omitted, they are read from the `TRADERA_APP_ID` and `TRADERA_APP_KEY` environment variables:

```ts
const client = new TraderaClient(); // credentials from env vars
```

### Available methods

| Method                                                       | Endpoint                                                 |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| `client.auth.fetchToken({ userId, secretKey })`              | `POST /v4/auth/token`                                    |
| `client.auth.beginBankId()`                                  | `POST /v4/auth/bankid/begin`                             |
| `client.auth.beginBankIdOnFile()`                            | `POST /v4/auth/bankid/begin-on-file`                     |
| `client.auth.getBankIdProgress(orderRef)`                    | `GET /v4/auth/bankid/progress`                           |
| `client.auth.cancelBankId(orderRef)`                         | `POST /v4/auth/bankid/cancel`                            |
| `client.buyer.buy(request)` †                                | `POST /v4/buyer/buy`                                     |
| `client.buyer.getTransactions(options?)` †                   | `GET /v4/buyer/transactions`                             |
| `client.buyer.getWishlist(options?)` †                       | `GET /v4/buyer/wishlist`                                 |
| `client.items.getItem(itemId)`                               | `GET /v4/items/{itemId}`                                 |
| `client.items.getItemDescriptions(itemId)`                   | `GET /v4/items/{itemId}/descriptions`                    |
| `client.items.getItemRestarts(itemId)`                       | `GET /v4/items/{itemId}/restarts`                        |
| `client.items.getSellerItems(userId, options?)`              | `GET /v4/items/seller/{userId}`                          |
| `client.items.getSellerItemsQuickInfo(userId, options?)`     | `GET /v4/items/seller/{userId}/quick-info`               |
| `client.categories.getCategories()`                          | `GET /v4/categories`                                     |
| `client.categories.getAttributeDefinitions(categoryId)`      | `GET /v4/categories/{categoryId}/attribute-definitions`  |
| `client.listings.addItem(request)` †                         | `POST /v4/listings/items`                                |
| `client.listings.addItemXml(xml)` †                          | `POST /v4/listings/items/xml`                            |
| `client.listings.addItemImage(requestId, request)` †         | `POST /v4/listings/items/{requestId}/images`             |
| `client.listings.addItemCampaignCode(requestId, code)` †     | `POST /v4/listings/items/{requestId}/campaign-code`      |
| `client.listings.commitItem(requestId)` †                    | `POST /v4/listings/items/{requestId}/commit`             |
| `client.listings.getItem(itemId)` †                          | `GET /v4/listings/items/{itemId}`                        |
| `client.listings.endItem(itemId)` †                          | `DELETE /v4/listings/items/{itemId}`                     |
| `client.listings.restartItem(itemId)` †                      | `POST /v4/listings/items/{itemId}/restart`               |
| `client.listings.setPricesOnNonShopItem(request)` †          | `PUT /v4/listings/items/prices`                          |
| `client.listings.updateItemPrice(itemId, request)` †         | `PUT /v4/listings/items/{itemId}/price`                  |
| `client.listings.getSellerItems(options?)` †                 | `GET /v4/listings/seller-items`                          |
| `client.listings.getUpdatedSellerItems(rowVersion?)` †       | `GET /v4/listings/updated-seller-items`                  |
| `client.listings.getSellerTransactions(options?)` †          | `GET /v4/listings/seller-transactions`                   |
| `client.listings.getRequestResults(requestIds)` †            | `GET /v4/listings/request-results`                       |
| `client.listings.addShopItem(data)` †                        | `POST /v4/listings/shop-items`                           |
| `client.listings.updateShopItem(itemId, data)` †             | `PUT /v4/listings/shop-items`                            |
| `client.listings.addShopItemVariant(data)` †                 | `POST /v4/listings/shop-items/variant`                   |
| `client.listings.updateShopItemVariant(itemId, data)` †      | `PUT /v4/listings/shop-items/variant`                    |
| `client.listings.removeShopItem(itemId)` †                   | `DELETE /v4/listings/shop-items/{itemId}`                |
| `client.listings.setShopItemPrices(items)` †                 | `PUT /v4/listings/shop-items/prices`                     |
| `client.listings.setShopItemQuantities(items)` †             | `PUT /v4/listings/shop-items/quantities`                 |
| `client.listings.setShopItemActivateDates(items)` †          | `PUT /v4/listings/shop-items/activate-dates`             |
| `client.listings.getShopSettings()` †                        | `GET /v4/listings/shop-settings`                         |
| `client.listings.updateShopSettings(settings)` †             | `PUT /v4/listings/shop-settings`                         |
| `client.listings.leaveFeedback(transactionId, request)` †    | `POST /v4/listings/feedback/transaction/{transactionId}` |
| `client.listings.leaveOrderFeedback(orderNumber, request)` † | `POST /v4/listings/feedback/order/{orderNumber}`         |
| `client.listings.validateCampaignCode(request)` †            | `POST /v4/listings/validate-campaign-code`               |
| `client.listings.updateTransactionStatus(data)` †            | `PUT /v4/listings/transaction-status`                    |
| `client.orders.getOrders(options?)` †                        | `GET /v4/orders`                                         |
| `client.orders.getOrdersByIds(orderIds)` †                   | `GET /v4/orders/{orderIds}`                              |
| `client.orders.shipOrder(orderId)` †                         | `POST /v4/orders/{orderId}/ship`                         |
| `client.orders.getFreightLabels(orderIds)` †                 | `GET /v4/orders/{orderIds}/freight-labels`               |
| `client.orders.getShippingCodes(orderIds)` †                 | `GET /v4/orders/{orderIds}/shipping-codes`               |
| `client.referenceData.getOfficialTime()`                     | `GET /v4/reference-data/time`                            |
| `client.referenceData.getAcceptedBidderTypes()`              | `GET /v4/reference-data/accepted-bidder-types`           |
| `client.referenceData.getExpoItemTypes()`                    | `GET /v4/reference-data/expo-item-types`                 |
| `client.referenceData.getItemTypes()`                        | `GET /v4/reference-data/item-types`                      |
| `client.referenceData.getCounties()`                         | `GET /v4/reference-data/counties`                        |
| `client.referenceData.getItemFieldValues()`                  | `GET /v4/reference-data/item-field-values`               |
| `client.referenceData.getShippingOptions(options?)`          | `GET /v4/reference-data/shipping-options`                |
| `client.users.getUserByAlias(alias)`                         | `GET /v4/users/by-alias/{alias}`                         |
| `client.users.getFeedback(userId, options?)`                 | `GET /v4/users/{userId}/feedback`                        |
| `client.users.getFeedbackSummary(userId)`                    | `GET /v4/users/{userId}/feedback/summary`                |
| `client.users.getMe()` †                                     | `GET /v4/users/me`                                       |
| `client.users.getMyPaymentOptions()` †                       | `GET /v4/users/me/payment-options`                       |
| `client.users.getSellerInfo(userId)` †                       | `GET /v4/users/{userId}/seller-info`                     |
| `client.search.search(query, options?)`                      | `GET /v4/search`                                         |
| `client.search.searchAdvanced(request)`                      | `POST /v4/search/advanced`                               |
| `client.search.getCategoryCount(request)`                    | `POST /v4/search/category-count`                         |
| `client.search.searchByZipCode(request)`                     | `POST /v4/search/by-zip-code`                            |
| `client.search.searchByFixedCriteria(request)`               | `POST /v4/search/by-fixed-criteria`                      |

### User authorization

Methods marked with † above (and the BankID methods) require a user token, obtained through Tradera's [token login flow](https://api.tradera.com/documentation): redirect the user to `https://api.tradera.com/token-login?appId=..&pkey=..&skey=..`, then call `client.auth.fetchToken({ userId, secretKey: skey })`. Configure the token on the client:

```ts
const client = new TraderaClient({ appId, appKey, userId, userToken });
```

The BankID endpoints and `client.buyer.buy` must also be activated for your application by Tradera (apiadmin@tradera.com). Note that `buy` places a **binding purchase** — per Tradera's developer terms it must only ever be triggered by an explicit, user-initiated action, never automatically.

### Selling: the add-item flow

`listings.addItem` queues the listing and returns a `requestId`/`itemId` pair; poll `listings.getRequestResults([requestId])` to confirm the outcome (see the `ResultCode` enum). To attach images, set `autoCommit: false`, call `addItemImage` for each image, then `commitItem`. There is no sandbox in v4 — the documented way to test a listing call is `autoCommit: false` without ever committing (the draft is validated but never published), or ending a published test item immediately with `endItem`.

Restricted seller accounts (new or unproven sellers) may only list plain auctions with an end date at least 7 days out; fixed-price and Buy Now listings are rejected until Tradera lifts the restriction. Shop items (`addShopItem` etc.) require a Tradera shop.

### Errors

Failed requests throw a `TraderaApiError` with `status` (HTTP status), `code`/`message` (from the API's error envelope, when present) and an `isRateLimited` getter. The API allows 10,000 calls per 24 hours per method; exceeding it yields a 429.

```ts
import { TraderaApiError } from "tradera-api-client";

try {
    await client.items.getItem(1);
} catch (error) {
    if (error instanceof TraderaApiError && error.isRateLimited) {
        // back off
    }
}
```

### Good to know

-   **Dates:** some endpoints return timestamps in Swedish local time without a timezone offset (e.g. `2026-08-25T11:42:56.32`). This client detects offset-less timestamps and interprets them as `Europe/Stockholm`, so the `Date` objects it returns are correct regardless of the machine's time zone.
-   **`*Specified` fields:** the API keeps serialization artifacts like `openingBid`/`openingBidSpecified`. When `openingBidSpecified` is `false`, the value of `openingBid` is meaningless.
-   **No sandbox:** the v3 sandbox is retired in v4; a `sandbox` parameter is rejected with `400 SandboxNotSupported`.
-   **Lenient validation:** response schemas tolerate unknown extra fields, since the beta API may add fields without notice. Unknown fields are stripped from the parsed result.

## Development

```
npm run build      # compile to lib/
npm test           # unit tests (no network)
npm run test:live  # smoke test against the production API; requires TRADERA_APP_ID/TRADERA_APP_KEY
```

The live test's user-auth block additionally needs `TRADERA_USER_ID` plus either `TRADERA_USER_TOKEN` or `TRADERA_SKEY` (the skey used when authorizing the app via the token-login URL — the test then fetches the token itself and prints it for reuse). It only calls read-only endpoints; `buyer.buy` is never exercised.

# Contributing

Feel free to send pull requests.
