import { z } from "zod";

import { HttpClient } from "../http";
import { ActiveFilter, Item, ItemTypeFilter, itemSchema } from "../schemas/items";
import {
    AddItemImageRequest,
    ItemRequest,
    LeaveFeedbackRequest,
    QueuedRequestResponse,
    RequestResult,
    RestartItemResult,
    SellerTransaction,
    SetActivateDateOnShopItemsResult,
    SetActivateDateShopItem,
    SetPriceOnShopItemsResult,
    SetPriceShopItem,
    SetPricesNonShopItem,
    SetPricesOnNonShopItemsResult,
    SetQuantityOnShopItemsResult,
    SetQuantityShopItem,
    ShopItemData,
    ShopItemVariantData,
    ShopSettings,
    ShopSettingsUpdate,
    TransactionFilter,
    TransactionStatusUpdateData,
    UpdateItemPriceRequest,
    UpdateItemPriceResult,
    UpdatedItemInfo,
    ValidateCampaignCodeRequest,
    ValidateCampaignCodeResult,
    queuedRequestResponseSchema,
    requestResultSchema,
    restartItemResultSchema,
    sellerTransactionSchema,
    setActivateDateOnShopItemsResultSchema,
    setPriceOnShopItemsResultSchema,
    setPricesOnNonShopItemsResultSchema,
    setQuantityOnShopItemsResultSchema,
    shopSettingsSchema,
    updateItemPriceResultSchema,
    updatedItemInfoSchema,
    validateCampaignCodeResultSchema,
} from "../schemas/listings";

export interface GetListingsSellerItemsOptions {
    categoryId?: number;
    filterActive?: ActiveFilter;
    filterItemType?: ItemTypeFilter;
    minEndDate?: Date;
    maxEndDate?: Date;
    maxStartDate?: Date;
}

export interface GetSellerTransactionsOptions {
    minTransactionDate?: Date;
    maxTransactionDate?: Date;
    filter?: TransactionFilter;
}

export class ListingsResource {
    constructor(private readonly http: HttpClient) {}

    // ---------- Non-shop items ----------

    /**
     * Adds a new item listing: an auction (itemType 1), an auction with a Buy Now price
     * (itemType 1 plus buyItNowPrice) or a fixed-price "Endast Köp Nu" listing (itemType 3).
     * The request is queued and processed asynchronously — poll getRequestResults with the
     * returned requestId to confirm the outcome.
     *
     * To attach images, set autoCommit to false, call addItemImage for each image, then
     * commitItem. A request that is never committed is never listed, which is also the
     * documented way to test listing calls (v4 has no sandbox).
     *
     * Restricted seller accounts (new or unproven sellers) may only list plain auctions
     * with no fixed price and an end date at least 7 days out.
     */
    addItem(request: ItemRequest): Promise<QueuedRequestResponse> {
        return this.http.post("listings/items", {
            body: request,
            schema: queuedRequestResponseSchema,
            userAuth: true,
        });
    }

    /** Adds a new item listing from an XML document (AddItemXml format). */
    addItemXml(createItemRequestXml: string): Promise<QueuedRequestResponse> {
        return this.http.post("listings/items/xml", {
            body: { createItemRequestXml },
            schema: queuedRequestResponseSchema,
            userAuth: true,
        });
    }

    /** Adds an image to a pending (uncommitted) item request. */
    addItemImage(requestId: number, request: AddItemImageRequest): Promise<void> {
        return this.http.post(`listings/items/${requestId}/images`, {
            body: request,
            userAuth: true,
        });
    }

    /** Adds a campaign code to a pending item request. */
    addItemCampaignCode(requestId: number, campaignCode: string): Promise<void> {
        return this.http.post(`listings/items/${requestId}/campaign-code`, {
            body: { campaignCode },
            userAuth: true,
        });
    }

    /** Commits a pending item request, finalizing the listing. */
    commitItem(requestId: number): Promise<void> {
        return this.http.post(`listings/items/${requestId}/commit`, { userAuth: true });
    }

    /**
     * Gets a specific item for the authenticated seller, including seller-specific details.
     * Returns 404 if the item does not exist or does not belong to the seller.
     */
    getItem(itemId: number): Promise<Item> {
        return this.http.get(`listings/items/${itemId}`, { schema: itemSchema, userAuth: true });
    }

    /** Ends (deletes) an item listing. */
    endItem(itemId: number): Promise<boolean> {
        return this.http.delete(`listings/items/${itemId}`, {
            schema: z.boolean(),
            userAuth: true,
        });
    }

    /**
     * Restarts an ended item, listing it again as a new item. Processed asynchronously: on
     * success the result carries the id reserved for the new item. Items that do not qualify
     * (not ended, sold, no restarts left) return isSuccessful false with a validationError.
     */
    restartItem(itemId: number): Promise<RestartItemResult> {
        return this.http.post(`listings/items/${itemId}/restart`, {
            schema: restartItemResultSchema,
            userAuth: true,
        });
    }

    /**
     * Sets prices on a non-shop item. The item type is derived from the supplied prices, so
     * this may convert the item (e.g. a fixed-price item becomes an auction). To change the
     * price while keeping the item type, use updateItemPrice instead.
     */
    setPricesOnNonShopItem(request: SetPricesNonShopItem): Promise<SetPricesOnNonShopItemsResult> {
        return this.http.put("listings/items/prices", {
            body: request,
            schema: setPricesOnNonShopItemsResultSchema,
            userAuth: true,
        });
    }

    /**
     * Updates the price of a non-shop item without changing its item type: supply binPrice
     * for a fixed-price item, openingPrice (and optionally binPrice) for an auction. Omitted
     * fields are left unchanged.
     */
    updateItemPrice(
        itemId: number,
        request: UpdateItemPriceRequest,
    ): Promise<UpdateItemPriceResult> {
        return this.http.put(`listings/items/${itemId}/price`, {
            body: request,
            schema: updateItemPriceResultSchema,
            userAuth: true,
        });
    }

    // ---------- Seller queries ----------

    /** Gets the authenticated seller's items. */
    getSellerItems(options: GetListingsSellerItemsOptions = {}): Promise<Item[]> {
        return this.http.get("listings/seller-items", {
            query: { ...options },
            schema: z.array(itemSchema),
            userAuth: true,
        });
    }

    /** Gets updated seller items since a given row version. */
    getUpdatedSellerItems(rowVersion?: number): Promise<UpdatedItemInfo[]> {
        return this.http.get("listings/updated-seller-items", {
            query: { rowVersion },
            schema: z.array(updatedItemInfoSchema),
            userAuth: true,
        });
    }

    /** Gets seller transactions within a date range. */
    getSellerTransactions(
        options: GetSellerTransactionsOptions = {},
    ): Promise<SellerTransaction[]> {
        return this.http.get("listings/seller-transactions", {
            query: { ...options },
            schema: z.array(sellerTransactionSchema),
            userAuth: true,
        });
    }

    /** Gets results for previously queued requests (addItem, addShopItem, price updates, …). */
    getRequestResults(requestIds: number[]): Promise<RequestResult[]> {
        return this.http.get("listings/request-results", {
            query: { requestIds },
            schema: z.array(requestResultSchema),
            userAuth: true,
        });
    }

    // ---------- Shop items ----------

    /** Adds a new shop item. Queued — confirm via getRequestResults. */
    addShopItem(data: ShopItemData): Promise<QueuedRequestResponse> {
        return this.http.post("listings/shop-items", {
            body: data,
            schema: queuedRequestResponseSchema,
            userAuth: true,
        });
    }

    /** Updates an existing shop item. Queued — confirm via getRequestResults. */
    updateShopItem(itemId: number, itemData: ShopItemData): Promise<QueuedRequestResponse> {
        return this.http.put("listings/shop-items", {
            body: { itemId, itemData },
            schema: queuedRequestResponseSchema,
            userAuth: true,
        });
    }

    /** Adds a new shop item variant. Queued — confirm via getRequestResults. */
    addShopItemVariant(data: ShopItemVariantData): Promise<QueuedRequestResponse> {
        return this.http.post("listings/shop-items/variant", {
            body: data,
            schema: queuedRequestResponseSchema,
            userAuth: true,
        });
    }

    /** Updates an existing shop item variant. Queued — confirm via getRequestResults. */
    updateShopItemVariant(
        itemId: number,
        itemData: ShopItemVariantData,
    ): Promise<QueuedRequestResponse> {
        return this.http.put("listings/shop-items/variant", {
            body: { itemId, itemData },
            schema: queuedRequestResponseSchema,
            userAuth: true,
        });
    }

    /** Removes a shop item (sets its end date to the past). */
    removeShopItem(itemId: number): Promise<QueuedRequestResponse> {
        return this.http.delete(`listings/shop-items/${itemId}`, {
            schema: queuedRequestResponseSchema,
            userAuth: true,
        });
    }

    /** Sets prices on multiple shop items. */
    setShopItemPrices(shopItems: SetPriceShopItem[]): Promise<SetPriceOnShopItemsResult> {
        return this.http.put("listings/shop-items/prices", {
            body: { shopItems },
            schema: setPriceOnShopItemsResultSchema,
            userAuth: true,
        });
    }

    /** Sets quantities on multiple shop items. */
    setShopItemQuantities(shopItems: SetQuantityShopItem[]): Promise<SetQuantityOnShopItemsResult> {
        return this.http.put("listings/shop-items/quantities", {
            body: { shopItems },
            schema: setQuantityOnShopItemsResultSchema,
            userAuth: true,
        });
    }

    /** Sets activate dates on multiple shop items. */
    setShopItemActivateDates(
        shopItems: SetActivateDateShopItem[],
    ): Promise<SetActivateDateOnShopItemsResult> {
        return this.http.put("listings/shop-items/activate-dates", {
            body: { shopItems },
            schema: setActivateDateOnShopItemsResultSchema,
            userAuth: true,
        });
    }

    /** Gets the authenticated seller's shop settings. */
    getShopSettings(): Promise<ShopSettings> {
        return this.http.get("listings/shop-settings", {
            schema: shopSettingsSchema,
            userAuth: true,
        });
    }

    /** Updates the authenticated seller's shop settings. */
    updateShopSettings(settings: ShopSettingsUpdate): Promise<void> {
        return this.http.put("listings/shop-settings", { body: settings, userAuth: true });
    }

    // ---------- Feedback, campaign codes, transactions ----------

    /** Leaves feedback for a transaction. Requires activation by Tradera (apiadmin@tradera.com). */
    leaveFeedback(transactionId: number, request: LeaveFeedbackRequest): Promise<boolean> {
        return this.http.post(`listings/feedback/transaction/${transactionId}`, {
            body: request,
            schema: z.boolean(),
            userAuth: true,
        });
    }

    /** Leaves order feedback to the buyer. Requires activation by Tradera (apiadmin@tradera.com). */
    leaveOrderFeedback(orderNumber: number, request: LeaveFeedbackRequest): Promise<void> {
        return this.http.post(`listings/feedback/order/${orderNumber}`, {
            body: request,
            userAuth: true,
        });
    }

    /** Validates a campaign code for a category. */
    validateCampaignCode(
        request: ValidateCampaignCodeRequest,
    ): Promise<ValidateCampaignCodeResult> {
        return this.http.post("listings/validate-campaign-code", {
            body: request,
            schema: validateCampaignCodeResultSchema,
            userAuth: true,
        });
    }

    /** Updates the status of a transaction (paid confirmed / shipped / shipping booked). */
    updateTransactionStatus(data: TransactionStatusUpdateData): Promise<SellerTransaction> {
        return this.http.put("listings/transaction-status", {
            body: data,
            schema: sellerTransactionSchema,
            userAuth: true,
        });
    }
}
