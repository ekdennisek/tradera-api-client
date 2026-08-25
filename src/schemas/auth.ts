import { z } from "zod";

import { traderaDateSchema } from "./common";

export const tokenSchema = z.object({
    authToken: z.string().nullish(),
    hardExpirationTime: traderaDateSchema,
});
export type Token = z.infer<typeof tokenSchema>;

export const beginBankIdVerificationResultSchema = z.object({
    bankIdOrderRef: z.string().nullish(),
    error: z.string().nullish(),
    qrData: z.string().nullish(),
    autoStartToken: z.string().nullish(),
});
export type BeginBankIdVerificationResult = z.infer<typeof beginBankIdVerificationResultSchema>;

export const beginBankIdOnFileVerificationResultSchema = z.object({
    bankIdOrderRef: z.string().nullish(),
    error: z.string().nullish(),
    autoStartToken: z.string().nullish(),
});
export type BeginBankIdOnFileVerificationResult = z.infer<
    typeof beginBankIdOnFileVerificationResultSchema
>;

export const bankIdVerificationProgressSchema = z.object({
    isCompleted: z.boolean(),
    progress: z.string().nullish(),
    error: z.string().nullish(),
    qrData: z.string().nullish(),
});
export type BankIdVerificationProgress = z.infer<typeof bankIdVerificationProgressSchema>;
