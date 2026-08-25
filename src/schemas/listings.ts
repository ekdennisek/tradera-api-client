import { z } from "zod";

import { transactionItemSchema } from "./buyer";
import { traderaDateSchema, userSchema } from "./common";

// Names from the v3 RestrictedService WSDL enumerations.
export enum ImageFormat {
    Gif = 0,
    Jpeg = 1,
    Png = 2,
}

export enum FeedbackType {
    Positive = 0,
    Negative = 1,
}

/** Flags describing the outcome of a queued request (see getRequestResults). */
export enum ResultCode {
    Ok = 1,
    ImageProcessingError = 2,
    Error = 4,
    Timeout = 8,
    TryAgain = 16,
    UpdateNotAllowed = 32,
    ReachedMaximumActiveItemsThreshold = 64,
    WaitingToBeProcessed = 128,
    Uncommited = 256,
}

export enum TransactionFilter {
    New = 2,
    NewAndUpdated = 4,
}

// ---------- Request types (validated by the server, not client-side) ----------

export interface TermValues {
    id: number;
    values?: string[];
}

export interface NumberValues {
    id: number;
    values?: number[];
}

/**
 * Attribute values to set on a listing. Term attribute ids and their allowed values come
 * from categories.getAttributeDefinitions (e.g. the "Skick" condition selector).
 */
export interface ItemAttributeValues {
    terms?: TermValues[];
    numbers?: NumberValues[];
}

/** Shipping option on an item being created or updated. */
export interface ItemShippingInput {
    shippingOptionId?: number | null;
    /** Buyer-facing shipping cost. Still the authoritative, required field. */
    cost: number;
    shippingWeight?: number | null;
    shippingProductId?: number | null;
    shippingProviderId?: number | null;
    sellerSurcharge?: number | null;
    sellerDiscount?: number | null;
}

export interface ItemRequest {
    title?: string;
    ownReferences?: string[];
    categoryId: number;
    /** Listing duration in days. Ignored for itemType 3, which is fixed at 30 days. */
    duration?: number;
    restarts?: number;
    startPrice?: number;
    reservePrice?: number;
    buyItNowPrice?: number;
    description?: string;
    paymentOptionIds?: number[];
    shippingOptions?: ItemShippingInput[];
    /** Buyer regions allowed to bid/buy: 1 = Sweden, 3 = International, 4 = EU. */
    acceptedBidderId?: number;
    expoItemIds?: number[];
    customEndDate?: Date;
    /** Coarse condition flag from reference-data item-field-values: 1 = Ny, 2 = Begagnad. */
    itemAttributes?: number[];
    /** 1 = auction (add buyItNowPrice for Buy Now), 3 = fixed-price "Endast Köp Nu". */
    itemType: number;
    /**
     * When false the request is prepared and validated but nothing is published until
     * commitItem is called — also the documented way to test listing calls without
     * publishing (skip the commit and the draft is never listed).
     */
    autoCommit?: boolean;
    vat?: number | null;
    shippingCondition?: string;
    paymentCondition?: string;
    campaignCode?: string;
    descriptionLanguageCodeIso2?: string;
    attributeValues?: ItemAttributeValues;
    restartedFromItemId?: number | null;
}

export interface AddItemImageRequest {
    /** Base64-encoded image data. */
    imageData: string;
    imageFormat: ImageFormat;
    hasMega?: boolean;
}

export interface ItemImageData {
    hasMega?: boolean;
    format: ImageFormat;
    /** Base64-encoded image data. */
    data?: string;
    name?: string;
}

export interface ShopItemData {
    activateDate?: Date | null;
    acceptedBuyerId?: number | null;
    categoryId?: number | null;
    deactivateDate?: Date | null;
    itemAttributes?: number[];
    description?: string;
    paymentCondition?: string;
    price?: number | null;
    quantity?: number | null;
    absoluteQuantity?: number | null;
    shippingCondition?: string;
    title?: string;
    vat?: number | null;
    shippingOptions?: ItemShippingInput[];
    paymentOptionIds?: number[];
    ownReferences?: string[];
    itemImages?: ItemImageData[];
    externalId?: number | null;
    attributeValues?: ItemAttributeValues;
    descriptionLanguageCodeIso2?: string;
}

export interface VariantAttribute {
    name?: string;
    value?: string;
}

export interface VariantData {
    variantGroupId?: string;
    variantAttributes?: VariantAttribute[];
}

export interface ShopItemVariantData extends ShopItemData {
    sellerPartNo?: string;
    variantData?: VariantData;
}

export interface SetPricesNonShopItem {
    id: number;
    openingPrice?: number;
    reservedPrice?: { price: number };
    binPrice?: { price: number };
}

export interface UpdateItemPriceRequest {
    /** For auctions. */
    openingPrice?: number | null;
    /** Buy Now / fixed price. */
    binPrice?: number | null;
}

export interface SetPriceShopItem {
    id: number;
    price: number;
}

export interface SetQuantityShopItem {
    id: number;
    quantity: number;
}

export interface SetActivateDateShopItem {
    id: number;
    activateDate: Date;
}

export interface TransactionStatusUpdateData {
    transactionId: number;
    markAsPaidConfirmed?: boolean | null;
    markedAsShipped?: boolean | null;
    markShippingBooked?: boolean | null;
}

export interface LeaveFeedbackRequest {
    comment?: string;
    type: FeedbackType;
}

export interface ValidateCampaignCodeRequest {
    campaignCode?: string;
    categoryId: number;
}

export interface ShopLogoData {
    imageFormat: ImageFormat;
    /** Base64-encoded image data. */
    imageData?: string;
    removeLogo?: boolean | null;
}

export interface ShopSettingsUpdate {
    companyInformation?: string;
    purchaseTerms?: string;
    showGalleryMode?: boolean | null;
    showAuctionView?: boolean | null;
    logoInformation?: ShopLogoData;
    bannerColor?: string;
    isTemporaryClosed?: boolean | null;
    temporaryClosedMessage?: string;
    contactInformation?: string;
}

// ---------- Response schemas ----------

export const queuedRequestResponseSchema = z.object({
    requestId: z.number(),
    itemId: z.number(),
});
export type QueuedRequestResponse = z.infer<typeof queuedRequestResponseSchema>;

export const requestResultSchema = z.object({
    requestId: z.number(),
    resultCode: z.number(),
    message: z.string().nullish(),
});
export type RequestResult = z.infer<typeof requestResultSchema>;

export const restartItemResultSchema = z.object({
    isSuccessful: z.boolean(),
    oldItemId: z.number(),
    newItemId: z.number().nullish(),
    validationError: z.string().nullish(),
});
export type RestartItemResult = z.infer<typeof restartItemResultSchema>;

export const updateItemPriceResultSchema = z.object({
    isSuccessful: z.boolean(),
    validationErrors: z
        .array(z.object({ itemId: z.number(), errorMessage: z.string().nullish() }))
        .nullish(),
});
export type UpdateItemPriceResult = z.infer<typeof updateItemPriceResultSchema>;

export const setPricesOnNonShopItemsResultSchema = z.object({
    isSuccessful: z.boolean(),
    validationErrors: z
        .array(z.object({ item: z.unknown().nullish(), errorMessage: z.string().nullish() }))
        .nullish(),
});
export type SetPricesOnNonShopItemsResult = z.infer<typeof setPricesOnNonShopItemsResultSchema>;

const shopItemErrorSchema = z.object({
    item: z.unknown().nullish(),
    errorMessage: z.string().nullish(),
});

export const setPriceOnShopItemsResultSchema = z.object({
    queuedRequestResponses: z.array(queuedRequestResponseSchema).nullish(),
    validationErrors: z.array(shopItemErrorSchema).nullish(),
});
export type SetPriceOnShopItemsResult = z.infer<typeof setPriceOnShopItemsResultSchema>;

export const setQuantityOnShopItemsResultSchema = z.object({
    successfulUpdates: z.number(),
    validationErrors: z.array(shopItemErrorSchema).nullish(),
});
export type SetQuantityOnShopItemsResult = z.infer<typeof setQuantityOnShopItemsResultSchema>;

export const setActivateDateOnShopItemsResultSchema = z.object({
    queuedRequestResponses: z.array(queuedRequestResponseSchema).nullish(),
    validationErrors: z.array(shopItemErrorSchema).nullish(),
});
export type SetActivateDateOnShopItemsResult = z.infer<
    typeof setActivateDateOnShopItemsResultSchema
>;

export const updatedItemInfoSchema = z.object({
    id: z.number(),
    rowVersion: z.number(),
    itemType: z.number(),
});
export type UpdatedItemInfo = z.infer<typeof updatedItemInfoSchema>;

export const validateCampaignCodeResultSchema = z.object({
    isValid: z.boolean(),
    isInvalidBecauseDoesNotExist: z.boolean().optional(),
    isInvalidBecauseHasNotStarted: z.boolean().optional(),
    isInvalidBecauseHasEnded: z.boolean().optional(),
    isInvalidBecauseCategoryIsNotAllowed: z.boolean().optional(),
    isInvalidBecauseAlreadyUsed: z.boolean().optional(),
    isInvalidBecauseUserIsNotAllowed: z.boolean().optional(),
    description: z.string().nullish(),
    discountFactor: z.number().nullish(),
    provisionFactor: z.number().nullish(),
    maxFeeCap: z.number().nullish(),
    isCustomLengthFeeFree: z.boolean().optional(),
    isUnsoldFeeFree: z.boolean().optional(),
});
export type ValidateCampaignCodeResult = z.infer<typeof validateCampaignCodeResultSchema>;

export const shopSettingsSchema = z.object({
    companyInformation: z.string().nullish(),
    purchaseTerms: z.string().nullish(),
    showGalleryMode: z.boolean().nullish(),
    showAuctionView: z.boolean().nullish(),
    bannerColor: z.string().nullish(),
    isTemporaryClosed: z.boolean().nullish(),
    temporaryClosedMessage: z.string().nullish(),
    contactInformation: z.string().nullish(),
    logoImageUrl: z.string().nullish(),
    maxActiveItems: z.number().optional(),
    maxInventoryItems: z.number().optional(),
});
export type ShopSettings = z.infer<typeof shopSettingsSchema>;

export const sellerTransactionSchema = z.object({
    id: z.number(),
    date: traderaDateSchema,
    amount: z.number(),
    lastUpdatedDate: traderaDateSchema,
    isMarkedAsPaidConfirmed: z.boolean(),
    isMarkedAsShipped: z.boolean(),
    isShippingBooked: z.boolean(),
    isFeedbackLeftBySeller: z.boolean(),
    isFeedbackLeftByBuyer: z.boolean(),
    buyer: userSchema.nullish(),
    item: transactionItemSchema.nullish(),
});
export type SellerTransaction = z.infer<typeof sellerTransactionSchema>;
