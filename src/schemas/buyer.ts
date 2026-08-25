import { z } from "zod";

import { traderaDateSchema, userSchema } from "./common";

// Names from the v3 BuyerService WSDL enumeration order; values from the spec (0-11).
export enum BuyStatus {
    Bought = 0,
    Ended = 1,
    NotStarted = 2,
    NotAllowed = 3,
    PurchaseOwnItem = 4,
    RegionNotAccepted = 5,
    UnexpectedError = 6,
    BuyItNowNoLongerAvailable = 7,
    PriceChanged = 8,
    ItemNotFound = 9,
    NumberOfBuysLimitReached = 10,
    BuyNotAvailableOnItem = 11,
}

export const buyResultSchema = z.object({
    nextBid: z.number().optional(),
    status: z.number(),
});
export type BuyResult = z.infer<typeof buyResultSchema>;

export const transactionItemSchema = z.object({
    id: z.number(),
    type: z.number(),
    title: z.string().nullish(),
    ownReferences: z.array(z.string()).nullish(),
});
export type TransactionItem = z.infer<typeof transactionItemSchema>;

export const buyerTransactionSchema = z.object({
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
    seller: userSchema.nullish(),
    item: transactionItemSchema.nullish(),
    isMarkedAsPaid: z.boolean(),
});
export type BuyerTransaction = z.infer<typeof buyerTransactionSchema>;
