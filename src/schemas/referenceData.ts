import { z } from "zod";

import { traderaDateSchema } from "./common";

// The OpenAPI spec declares IdDescriptionPair as an empty object; this is the v3 WSDL shape
// camelCased.
export const idDescriptionPairSchema = z.object({
    id: z.number(),
    description: z.string().nullish(),
    value: z.string().nullish(),
});
export type IdDescriptionPair = z.infer<typeof idDescriptionPairSchema>;

export const itemFieldsResponseSchema = z.object({
    vat: z.array(z.number()).nullish(),
    itemAttributes: z.array(idDescriptionPairSchema).nullish(),
    paymentTypes: z.array(idDescriptionPairSchema).nullish(),
    shippingTypes: z.array(idDescriptionPairSchema).nullish(),
});
export type ItemFieldsResponse = z.infer<typeof itemFieldsResponseSchema>;

// Verified live (2026-08-25): the time endpoint returns a bare JSON date-time string in
// Swedish local time without an offset. The { "time": "..." } form from the docs example is
// still accepted defensively; both normalize to a Date.
export const officialTimeSchema = z.union([
    z.object({ time: traderaDateSchema }).transform(value => value.time),
    traderaDateSchema,
]);

export const shippingEstimatedDeliveryTimeSchema = z.object({
    minWeekdays: z.number().optional(),
    maxWeekdays: z.number().nullish(),
});
export type ShippingEstimatedDeliveryTime = z.infer<typeof shippingEstimatedDeliveryTimeSchema>;

export const shippingInsuranceSchema = z.object({
    totalAmount: z.number().nullish(),
    totalAmountUpToItemValue: z.number().nullish(),
    amountPerKilogram: z.number().nullish(),
    hasReimbursementUpToPackageCost: z.boolean().optional(),
});
export type ShippingInsurance = z.infer<typeof shippingInsuranceSchema>;

export const shippingDeliveryInformationSchema = z.object({
    mailBoxWithServicePointBackup: z.boolean().optional(),
    servicePoint: z.boolean().optional(),
    canChangeServicePoint: z.boolean().optional(),
    isTraceable: z.boolean().optional(),
    isParcelBoxDeliveryPossible: z.boolean().optional(),
    estimatedDeliveryTime: shippingEstimatedDeliveryTimeSchema.nullish(),
    insurance: shippingInsuranceSchema.nullish(),
});
export type ShippingDeliveryInformation = z.infer<typeof shippingDeliveryInformationSchema>;

export const shippingPackageRequirementsSchema = z.object({
    maxWeight: z.number().nullish(),
    minWeight: z.number().nullish(),
    maxSumOfAllSides: z.number().nullish(),
    maxSumOfLengthAndHeight: z.number().nullish(),
    maxLengthPlusCircumference: z.number().nullish(),
    maxLength: z.number().nullish(),
    maxWidth: z.number().nullish(),
    maxHeight: z.number().nullish(),
    maxVolume: z.number().nullish(),
    minLength: z.number().nullish(),
    minWidth: z.number().nullish(),
    minHeight: z.number().nullish(),
    restrictions: z.array(z.string()).nullish(),
});
export type ShippingPackageRequirements = z.infer<typeof shippingPackageRequirementsSchema>;

export const shippingTermsAndConditionsSchema = z.object({
    termsAndConditionUrl: z.string().nullish(),
    general: z.string().nullish(),
    termsOfService: z.string().nullish(),
    termsOfPurchase: z.string().nullish(),
});
export type ShippingTermsAndConditions = z.infer<typeof shippingTermsAndConditionsSchema>;

export const shippingProductSchema = z.object({
    id: z.number(),
    shippingProvider: z.string().nullish(),
    shippingProviderId: z.number().optional(),
    name: z.string().nullish(),
    weight: z.number().optional(),
    price: z.number().optional(),
    vatPercent: z.number().nullish(),
    toCountry: z.string().nullish(),
    fromCountry: z.string().nullish(),
    packageRequirements: shippingPackageRequirementsSchema.nullish(),
    dimensionsExceededPenalty: z.number().optional(),
    weightExceededPenalty: z.number().optional(),
    displayPenaltyWarning: z.boolean().optional(),
    deliveryInformation: shippingDeliveryInformationSchema.nullish(),
    termsAndConditions: shippingTermsAndConditionsSchema.nullish(),
});
export type ShippingProduct = z.infer<typeof shippingProductSchema>;

export const productsPerWeightSpanSchema = z.object({
    weight: z.number(),
    products: z.array(shippingProductSchema).nullish(),
});
export type ProductsPerWeightSpan = z.infer<typeof productsPerWeightSpanSchema>;

export const shippingOptionsResponseSchema = z.object({
    productsPerWeightSpan: z.array(productsPerWeightSpanSchema).nullish(),
});
export type ShippingOptionsResponse = z.infer<typeof shippingOptionsResponseSchema>;
