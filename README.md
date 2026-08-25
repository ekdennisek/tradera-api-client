# Tradera API client

A Node.js client for the official [Tradera REST API (v4)](https://api.tradera.com/documentation), written in TypeScript. All responses are validated at runtime with [zod](https://github.com/colinhacks/zod).

> **Beta:** both the Tradera v4 API and this package (0.5.0) are in beta. The API's endpoints and response shapes may change without notice. Versions ≤ 0.4.0 of this package used the v3 SOAP API.

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

| Method                                                   | Endpoint                                                |
| -------------------------------------------------------- | ------------------------------------------------------- |
| `client.auth.fetchToken({ userId, secretKey })`          | `POST /v4/auth/token`                                   |
| `client.auth.beginBankId()`                              | `POST /v4/auth/bankid/begin`                            |
| `client.auth.beginBankIdOnFile()`                        | `POST /v4/auth/bankid/begin-on-file`                    |
| `client.auth.getBankIdProgress(orderRef)`                | `GET /v4/auth/bankid/progress`                          |
| `client.auth.cancelBankId(orderRef)`                     | `POST /v4/auth/bankid/cancel`                           |
| `client.items.getItem(itemId)`                           | `GET /v4/items/{itemId}`                                |
| `client.items.getItemDescriptions(itemId)`               | `GET /v4/items/{itemId}/descriptions`                   |
| `client.items.getItemRestarts(itemId)`                   | `GET /v4/items/{itemId}/restarts`                       |
| `client.items.getSellerItems(userId, options?)`          | `GET /v4/items/seller/{userId}`                         |
| `client.items.getSellerItemsQuickInfo(userId, options?)` | `GET /v4/items/seller/{userId}/quick-info`              |
| `client.categories.getCategories()`                      | `GET /v4/categories`                                    |
| `client.categories.getAttributeDefinitions(categoryId)`  | `GET /v4/categories/{categoryId}/attribute-definitions` |
| `client.referenceData.getOfficialTime()`                 | `GET /v4/reference-data/time`                           |
| `client.referenceData.getAcceptedBidderTypes()`          | `GET /v4/reference-data/accepted-bidder-types`          |
| `client.referenceData.getExpoItemTypes()`                | `GET /v4/reference-data/expo-item-types`                |
| `client.referenceData.getItemTypes()`                    | `GET /v4/reference-data/item-types`                     |
| `client.referenceData.getCounties()`                     | `GET /v4/reference-data/counties`                       |
| `client.referenceData.getItemFieldValues()`              | `GET /v4/reference-data/item-field-values`              |
| `client.referenceData.getShippingOptions(options?)`      | `GET /v4/reference-data/shipping-options`               |
| `client.users.getUserByAlias(alias)`                     | `GET /v4/users/by-alias/{alias}`                        |
| `client.users.getFeedback(userId, options?)`             | `GET /v4/users/{userId}/feedback`                       |
| `client.users.getFeedbackSummary(userId)`                | `GET /v4/users/{userId}/feedback/summary`               |
| `client.search.search(query, options?)`                  | `GET /v4/search`                                        |
| `client.search.searchAdvanced(request)`                  | `POST /v4/search/advanced`                              |
| `client.search.getCategoryCount(request)`                | `POST /v4/search/category-count`                        |
| `client.search.searchByZipCode(request)`                 | `POST /v4/search/by-zip-code`                           |
| `client.search.searchByFixedCriteria(request)`           | `POST /v4/search/by-fixed-criteria`                     |

### User authorization

Most methods above only need app credentials. The BankID methods additionally require a user token, obtained through Tradera's [token login flow](https://api.tradera.com/documentation): redirect the user to `https://api.tradera.com/token-login?appId=..&pkey=..&skey=..`, then call `client.auth.fetchToken({ userId, secretKey: skey })`. Configure the token on the client:

```ts
const client = new TraderaClient({ appId, appKey, userId, userToken });
```

The BankID endpoints must also be activated for your application by Tradera (apiadmin@tradera.com).

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

# Contributing

Feel free to send pull requests.
