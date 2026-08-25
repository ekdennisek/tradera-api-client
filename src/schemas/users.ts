import { z } from "zod";

import { traderaDateSchema } from "./common";

// Role filter for the feedback endpoint. Names follow the v3 WSDL enumeration order.
export enum GetFeedbackRole {
    All = 0,
    Seller = 1,
    Buyer = 2,
}

// Role the feedback was left in. Names follow the v3 WSDL enumeration order.
export enum FeedbackRole {
    Buyer = 0,
    Seller = 1,
}

// The spec allows the values 0, 1 and 3; names inferred from the v3 WSDL enumeration
// (None, Negative, Positive). Responses are validated as plain numbers.
export enum FeedbackRating {
    None = 0,
    Negative = 1,
    Positive = 3,
}

export const feedbackSchema = z.object({
    feedbackRole: z.number(),
    feedbackRating: z.number(),
    alias: z.string().nullish(),
    comment: z.string().nullish(),
    created: traderaDateSchema,
    totalRating: z.number(),
});
export type Feedback = z.infer<typeof feedbackSchema>;

export const feedbackSummaryItemSchema = z.object({
    totalPositive: z.number(),
    totalNegative: z.number(),
});
export type FeedbackSummaryItem = z.infer<typeof feedbackSummaryItemSchema>;

export const feedbackSummarySchema = z.object({
    userId: z.number(),
    lastMonth: feedbackSummaryItemSchema.nullish(),
    lastSixMonth: feedbackSummaryItemSchema.nullish(),
    lastTwelveMonth: feedbackSummaryItemSchema.nullish(),
});
export type FeedbackSummary = z.infer<typeof feedbackSummarySchema>;

export const userInfoSchema = z.object({
    id: z.number(),
    alias: z.string().nullish(),
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
    email: z.string().nullish(),
    phoneNumber: z.string().nullish(),
    address: z.string().nullish(),
    zipCode: z.string().nullish(),
    city: z.string().nullish(),
    countryName: z.string().nullish(),
    personalNumber: z.string().nullish(),
    currencyCode: z.string().nullish(),
    languageCodeIso2: z.string().nullish(),
});
export type UserInfo = z.infer<typeof userInfoSchema>;

export const memberPaymentOptionSchema = z.object({
    name: z.string().nullish(),
    description: z.string().nullish(),
    displayName: z.string().nullish(),
});
export type MemberPaymentOption = z.infer<typeof memberPaymentOptionSchema>;

export const memberPaymentOptionsResultSchema = z.object({
    paymentOptions: z.array(memberPaymentOptionSchema).nullish(),
});
export type MemberPaymentOptionsResult = z.infer<typeof memberPaymentOptionsResultSchema>;

export const detailedSellerRatingSchema = z.object({
    itemAsDescribedCount: z.number().nullish(),
    itemAsDescribedAverage: z.number().nullish(),
    commResponsivenessCount: z.number().nullish(),
    commResponsivenessAverage: z.number().nullish(),
    shippingTimeCount: z.number().nullish(),
    shippingTimeAverage: z.number().nullish(),
    shippingHandlingChargesCount: z.number().nullish(),
    shippingHandlingChargesAverage: z.number().nullish(),
});
export type DetailedSellerRating = z.infer<typeof detailedSellerRatingSchema>;

export const sellerInfoSchema = z.object({
    detailedSellerRating: detailedSellerRatingSchema.nullish(),
    totalRating: z.number(),
    positiveFeedbackPercent: z.number().nullish(),
    personalMessage: z.string().nullish(),
    isCompany: z.boolean(),
    hasShop: z.boolean(),
});
export type SellerInfo = z.infer<typeof sellerInfoSchema>;
