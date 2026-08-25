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
