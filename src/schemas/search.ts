import { z } from "zod";

import { attributeValuesSchema, imageLinkSchema, traderaDateSchema } from "./common";

export interface AttributeFilter {
    key?: string;
    values?: string[];
}

export interface NumberAttributeFilter {
    key?: string;
    filterFrom?: number | null;
    filterTo?: number | null;
}

// Request bodies are typed but not validated client-side; the server validates them.
export interface SearchAdvancedRequest {
    searchWords?: string;
    categoryId?: number;
    searchInDescription?: boolean;
    mode?: "And" | "Or" | "Exact";
    priceMinimum?: number | null;
    priceMaximum?: number | null;
    bidsMinimum?: number | null;
    bidsMaximum?: number | null;
    zipCode?: string;
    countyId?: number;
    alias?: string;
    orderBy?: string;
    itemStatus?: string;
    itemType?: string;
    onlyAuctionsWithBuyNow?: boolean;
    onlyItemsWithThumbnail?: boolean;
    itemsPerPage?: number;
    pageNumber?: number;
    itemCondition?: string;
    sellerType?: string;
    brands?: string[];
    campaignCodeIds?: number[];
    attributes?: AttributeFilter[];
    numberAttributes?: NumberAttributeFilter[];
}

export interface CategoryCountRequest {
    categoryId?: number;
    alias?: string;
    countyId?: number;
    searchInDescription?: boolean;
    itemCondition?: string;
    zipCode?: string;
    searchWords?: string;
    pageNumber?: number;
    onlyItemsWithThumbnail?: boolean;
    onlyAuctionsWithBuyNow?: boolean;
    mode?: "And" | "Or" | "Exact";
    priceMinimum?: number | null;
    priceMaximum?: number | null;
    bidsMinimum?: number | null;
    bidsMaximum?: number | null;
    itemStatus?: string;
    itemType?: string;
    sellerType?: string;
}

export interface SearchByZipCodeRequest {
    zipCode?: string;
    pageNumber?: number;
    orderBy?: string;
}

export interface SearchByFixedCriteriaRequest {
    name?: string;
    pageNumber?: number;
    itemType?: string;
    orderBy?: string;
}

export const searchErrorSchema = z.object({
    code: z.string().nullish(),
    message: z.string().nullish(),
});
export type SearchError = z.infer<typeof searchErrorSchema>;

// The OpenAPI spec declares SearchResult as an empty object; this shape was verified against
// the live API (2026-08-25).
export const searchItemSchema = z.object({
    id: z.number(),
    shortDescription: z.string().nullish(),
    buyItNowPrice: z.number().nullish(),
    sellerId: z.number().optional(),
    sellerAlias: z.string().nullish(),
    maxBid: z.number().nullish(),
    thumbnailLink: z.string().nullish(),
    sellerDsrAverage: z.number().optional(),
    endDate: traderaDateSchema.optional(),
    nextBid: z.number().nullish(),
    hasBids: z.boolean().optional(),
    isEnded: z.boolean().optional(),
    itemType: z.string().nullish(),
    itemUrl: z.string().nullish(),
    categoryId: z.number().optional(),
    bidCount: z.number().optional(),
    imageLinks: z.array(imageLinkSchema).nullish(),
    attributeValues: attributeValuesSchema.nullish(),
    longDescription: z.string().nullish(),
});
export type SearchItem = z.infer<typeof searchItemSchema>;

export const searchResultSchema = z.object({
    totalNumberOfItems: z.number().optional(),
    totalNumberOfPages: z.number().optional(),
    items: z.array(searchItemSchema).nullish(),
    errors: z.array(searchErrorSchema).nullish(),
});
export type SearchResult = z.infer<typeof searchResultSchema>;

// UNVERIFIED: recursive shape from the v3 WSDL, camelCased. (category-count is not covered
// by the live smoke test yet.)
export interface SearchCategory {
    id?: number;
    name?: string | null;
    noOfItemsInCategory?: number;
    noOfItemsInCategoryIncludingChildren?: number;
    childCategories?: SearchCategory[] | null;
}

export const searchCategorySchema: z.ZodType<SearchCategory> = z.lazy(() =>
    z.object({
        id: z.number().optional(),
        name: z.string().nullish(),
        noOfItemsInCategory: z.number().optional(),
        noOfItemsInCategoryIncludingChildren: z.number().optional(),
        childCategories: z.array(searchCategorySchema).nullish(),
    }),
);

export const categoryCountResultSchema = z.object({
    categories: z.array(searchCategorySchema).nullish(),
    errors: z.array(searchErrorSchema).nullish(),
});
export type CategoryCountResult = z.infer<typeof categoryCountResultSchema>;
