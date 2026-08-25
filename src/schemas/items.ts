import { z } from "zod";

import { attributeValuesSchema, imageLinkSchema, traderaDateSchema, userSchema } from "./common";

/**
 * Item type as returned in Item.itemType and ItemQuickInfo.itemType.
 * The OpenAPI spec also allows the value 5, whose meaning is undocumented, so response
 * schemas validate itemType as a plain number.
 */
export enum ApiItemType {
    Auction = 1,
    PureBuyItNow = 3,
    ShopItem = 4,
}

// Names inferred from v3 semantics; the spec only gives the numeric values 0-2.
export enum ActiveFilter {
    All = 0,
    Active = 1,
    Ended = 2,
}

// Names inferred from v3 semantics; the spec only gives the numeric values 0-3.
export enum ItemTypeFilter {
    All = 0,
    Auction = 1,
    PureBuyItNow = 2,
    ShopItem = 3,
}

// The OpenAPI spec declares ItemStatus as an empty object; this shape was verified against
// the live API (2026-08-25).
export const itemStatusSchema = z.object({
    ended: z.boolean().optional(),
    gotBidders: z.boolean().optional(),
    gotWinner: z.boolean().optional(),
});
export type ItemStatus = z.infer<typeof itemStatusSchema>;

export const itemShippingSchema = z.object({
    shippingOptionId: z.number().nullish(),
    cost: z.number(),
    shippingWeight: z.number().nullish(),
    shippingWeightSpecified: z.boolean().optional(),
    shippingProductId: z.number().nullish(),
    shippingProductIdSpecified: z.boolean().optional(),
    shippingProviderId: z.number().nullish(),
    sellerSurcharge: z.number().nullish(),
    sellerSurchargeSpecified: z.boolean().optional(),
    sellerDiscount: z.number().nullish(),
    sellerDiscountSpecified: z.boolean().optional(),
});
export type ItemShipping = z.infer<typeof itemShippingSchema>;

// The xSpecified boolean pairs are serialization artifacts kept by the v4 API: when
// xSpecified is false, the value of x is meaningless.
export const itemSchema = z.object({
    shippingOptions: z.array(itemShippingSchema).nullish(),
    paymentOptions: z.array(z.number()).nullish(),
    imageLinks: z.array(z.string()).nullish(),
    buyerList: z.array(userSchema).nullish(),
    status: itemStatusSchema.nullish(),
    startQuantity: z.number(),
    remainingQuantity: z.number(),
    itemType: z.number(),
    detailedImageLinks: z.array(imageLinkSchema).nullish(),
    id: z.number(),
    vat: z.number(),
    vatSpecified: z.boolean(),
    shortDescription: z.string().nullish(),
    ownReferences: z.array(z.string()).nullish(),
    attributeValues: attributeValuesSchema.nullish(),
    itemAttributes: z.array(z.number()).nullish(),
    longDescription: z.string().nullish(),
    startDate: traderaDateSchema,
    endDate: traderaDateSchema,
    categoryId: z.number(),
    openingBid: z.number(),
    openingBidSpecified: z.boolean(),
    reservePrice: z.number(),
    reservePriceSpecified: z.boolean(),
    reservePriceReached: z.boolean().nullish(),
    buyItNowPrice: z.number(),
    buyItNowPriceSpecified: z.boolean(),
    nextBid: z.number(),
    nextBidSpecified: z.boolean(),
    paymentCondition: z.string().nullish(),
    shippingCondition: z.string().nullish(),
    acceptsPickup: z.boolean(),
    totalBids: z.number(),
    maxBid: z.number(),
    maxBidSpecified: z.boolean(),
    statusId: z.number(),
    bold: z.boolean(),
    thumbnail: z.boolean(),
    highlight: z.boolean(),
    featuredItem: z.boolean(),
    itemLink: z.string().nullish(),
    thumbnailLink: z.string().nullish(),
    acceptedBuyerId: z.number(),
    paypal: z.boolean(),
    paymentTypeId: z.number(),
    seller: userSchema.nullish(),
    maxBidder: userSchema.nullish(),
    userSelectedEndDate: z.boolean(),
    restarts: z.number(),
    duration: z.number(),
    reservePriceManuallySet: z.boolean(),
    // The following fields are returned by the live API but missing from the OpenAPI spec.
    creationDate: traderaDateSchema.optional(),
    hasImage: z.boolean().optional(),
    imageId: z.string().nullish(),
    internalType: z.number().optional(),
    numberOfImages: z.number().optional(),
});
export type Item = z.infer<typeof itemSchema>;

export const itemAddedDescriptionSchema = z.object({
    description: z.string().nullish(),
    createdDate: traderaDateSchema,
});
export type ItemAddedDescription = z.infer<typeof itemAddedDescriptionSchema>;

export const restartedItemSchema = z.object({
    restartedItemId: z.number(),
    restartedAsItemId: z.number(),
    restartedDate: traderaDateSchema,
});
export type RestartedItem = z.infer<typeof restartedItemSchema>;

export const itemRestartsSchema = z.object({
    lastRestartedItemId: z.number(),
    ancestorItemId: z.number(),
    restartedItems: z.array(restartedItemSchema).nullish(),
});
export type ItemRestarts = z.infer<typeof itemRestartsSchema>;

export const itemQuickInfoSchema = z.object({
    creationDate: traderaDateSchema,
    itemType: z.number(),
    id: z.number(),
});
export type ItemQuickInfo = z.infer<typeof itemQuickInfoSchema>;
