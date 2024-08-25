import { number, z } from "zod";

export const arrayOfIntSchema = z.strictObject({
    int: z.array(number()).optional(),
});

export const arrayOfStringSchema = z.strictObject({
    string: z.array(z.string()).optional(),
});

export const itemShippingSchema = z.strictObject({
    ShippingOptionId: z.number(),
    Cost: z.number(),
    ShippingWeight: z.number().optional(),
    ShippingProductId: z.number().optional(),
    ShippingProviderId: z.number(),
});

export const userSchema = z.strictObject({
    Id: z.number(),
    Alias: z.string().optional(),
    FirstName: z.string().optional(),
    LastName: z.string().optional(),
    Email: z.string().optional(),
    TotalRating: z.number().optional(),
    PhoneNumber: z.string().optional(),
    MobilePhoneNumber: z.string().optional(),
    Address: z.string().optional(),
    ZipCode: z.string().optional(),
    City: z.string().optional(),
    CountryName: z.string().optional(),
    PersonalNumber: z.string().optional(),
    TransactionId: z.number().optional(),
});

export const itemStatusSchema = z.strictObject({
    Ended: z.boolean(),
    GotBidders: z.boolean(),
    GotWinner: z.boolean(),
});

export const itemTypeSchema = z.union([
    z.literal("Auction"),
    z.literal("PureBuyItNow"),
    z.literal("ShopItem"),
]);

export const imageLinkSchema = z.strictObject({
    Url: z.string().optional(),
    Format: z.string().optional(),
});

const termAttributeValueSchema = z.strictObject({
    Id: z.number(),
    Name: z.string().optional(),
    Values: arrayOfStringSchema.optional(),
});

const arrayOfTermAttributeValueSchema = z.strictObject({
    TermAttributeValue: z.array(termAttributeValueSchema).optional(),
});

const arrayOfDecimalSchema = z.strictObject({
    decimal: z.array(z.number()).optional(),
});

const numberAttributeValueSchema = z.strictObject({
    Id: z.number(),
    Name: z.string().optional(),
    Values: arrayOfDecimalSchema.optional(),
});

const arrayOfNumberAttributeValueSchema = z.strictObject({
    NumberAttributeValue: z.array(numberAttributeValueSchema).optional(),
});

export const attributeValuesSchema = z.strictObject({
    TermAttributeValues: arrayOfTermAttributeValueSchema.optional().nullable(),
    NumberAttributeValues: arrayOfNumberAttributeValueSchema.optional().nullable(),
});
