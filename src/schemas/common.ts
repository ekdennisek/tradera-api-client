import { z } from "zod";

// All response schemas use z.object (never z.strictObject): the v4 API is in beta and may add
// fields without notice, so unknown extra fields must not make parsing throw.

const TIMEZONE_SUFFIX = /(?:Z|[+-]\d{2}:?\d{2})$/i;

function stockholmOffsetMs(date: Date): number {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Stockholm",
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).formatToParts(date);
    const get = (type: string) => Number(parts.find(part => part.type === type)?.value);
    const asUtc = Date.UTC(
        get("year"),
        get("month") - 1,
        get("day"),
        get("hour"),
        get("minute"),
        get("second"),
    );
    return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/**
 * Some v4 endpoints emit timestamps in Swedish local time without a timezone offset (e.g.
 * "2026-08-25T11:42:56.32"), while others include one. Offset-less timestamps are interpreted
 * as Europe/Stockholm regardless of the host machine's time zone.
 */
export function parseTraderaDate(value: string): Date {
    if (TIMEZONE_SUFFIX.test(value)) return new Date(value);
    const utcGuess = new Date(value + "Z");
    if (Number.isNaN(utcGuess.getTime())) return utcGuess;
    const corrected = new Date(utcGuess.getTime() - stockholmOffsetMs(utcGuess));
    // Second pass for instants near a DST transition, where the first guess can land on the
    // other side of the switch.
    return new Date(utcGuess.getTime() - stockholmOffsetMs(corrected));
}

export const traderaDateSchema = z
    .union([z.string(), z.date()])
    .transform(value => (value instanceof Date ? value : parseTraderaDate(value)))
    .pipe(z.date());

export const userSchema = z.object({
    id: z.number(),
    alias: z.string().nullish(),
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
    email: z.string().nullish(),
    totalRating: z.number().nullish(),
    totalRatingSpecified: z.boolean().optional(),
    phoneNumber: z.string().nullish(),
    mobilePhoneNumber: z.string().nullish(),
    address: z.string().nullish(),
    zipCode: z.string().nullish(),
    city: z.string().nullish(),
    countryName: z.string().nullish(),
    personalNumber: z.string().nullish(),
    transactionId: z.number().nullish(),
    transactionIdSpecified: z.boolean().optional(),
});
export type User = z.infer<typeof userSchema>;

export const imageLinkSchema = z.object({
    url: z.string().nullish(),
    format: z.string().nullish(),
});
export type ImageLink = z.infer<typeof imageLinkSchema>;

export const termAttributeValueSchema = z.object({
    id: z.number(),
    name: z.string().nullish(),
    values: z.array(z.string()).nullish(),
});
export type TermAttributeValue = z.infer<typeof termAttributeValueSchema>;

export const numberAttributeValueSchema = z.object({
    id: z.number(),
    name: z.string().nullish(),
    values: z.array(z.number()).nullish(),
});
export type NumberAttributeValue = z.infer<typeof numberAttributeValueSchema>;

export const attributeValuesSchema = z.object({
    termAttributeValues: z.array(termAttributeValueSchema).nullish(),
    numberAttributeValues: z.array(numberAttributeValueSchema).nullish(),
});
export type AttributeValues = z.infer<typeof attributeValuesSchema>;
