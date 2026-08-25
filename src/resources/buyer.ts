import { z } from "zod";

import { HttpClient } from "../http";
import {
    BuyResult,
    BuyerTransaction,
    buyResultSchema,
    buyerTransactionSchema,
} from "../schemas/buyer";
import { ActiveFilter, Item, itemSchema } from "../schemas/items";

export interface BuyRequest {
    /** The item ID to buy. */
    itemId: number;
    /** The amount to buy for. */
    buyAmount: number;
}

export interface GetBuyerTransactionsOptions {
    minTransactionDate?: Date;
    maxTransactionDate?: Date;
}

export interface GetWishlistOptions {
    filterActive?: ActiveFilter;
    minEndDate?: Date;
    maxEndDate?: Date;
}

export class BuyerResource {
    constructor(private readonly http: HttpClient) {}

    /**
     * Buys an item (Buy It Now) on behalf of the authenticated user.
     *
     * This places a binding purchase. Per Tradera's developer terms it must only be
     * triggered by an explicit, user-initiated action — never automatically. The Buy
     * endpoint must also be activated for your application by Tradera
     * (apiadmin@tradera.com) before it can be used.
     */
    buy(request: BuyRequest): Promise<BuyResult> {
        return this.http.post("buyer/buy", {
            body: request,
            schema: buyResultSchema,
            userAuth: true,
        });
    }

    /**
     * Gets the authenticated buyer's transactions, matched on their creation date.
     * When minTransactionDate is omitted, the API defaults to the last 60 days.
     */
    getTransactions(options: GetBuyerTransactionsOptions = {}): Promise<BuyerTransaction[]> {
        return this.http.get("buyer/transactions", {
            query: { ...options },
            schema: z.array(buyerTransactionSchema),
            userAuth: true,
        });
    }

    /** Gets the authenticated buyer's wishlist items. */
    getWishlist(options: GetWishlistOptions = {}): Promise<Item[]> {
        return this.http.get("buyer/wishlist", {
            query: { ...options },
            schema: z.array(itemSchema),
            userAuth: true,
        });
    }
}
