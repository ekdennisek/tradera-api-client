import { z } from "zod";

import { traderaDateSchema } from "./common";

// Names from the v3 OrderService WSDL enumeration.
export enum SellerOrderQueryDateMode {
    CreatedDate = 0,
    LastUpdatedDate = 1,
}

export const sellerOrderUserSchema = z.object({
    userId: z.number(),
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
    addressLine1: z.string().nullish(),
    addressLine2: z.string().nullish(),
    zipCode: z.string().nullish(),
    city: z.string().nullish(),
    countryName: z.string().nullish(),
    email: z.string().nullish(),
    phone: z.string().nullish(),
    alias: z.string().nullish(),
});
export type SellerOrderUser = z.infer<typeof sellerOrderUserSchema>;

export const sellerOrderAddressSchema = z.object({
    name: z.string().nullish(),
    addressLine1: z.string().nullish(),
    addressLine2: z.string().nullish(),
    zipCode: z.string().nullish(),
    city: z.string().nullish(),
    countryName: z.string().nullish(),
});
export type SellerOrderAddress = z.infer<typeof sellerOrderAddressSchema>;

export const sellerOrderPaymentSchema = z.object({
    paymentType: z.string().nullish(),
    reference: z.string().nullish(),
    additionalInfo: z
        .array(z.object({ key: z.string().nullish(), value: z.string().nullish() }))
        .nullish(),
    amount: z.number(),
    paidDate: traderaDateSchema,
    paymentCost: z.number(),
});
export type SellerOrderPayment = z.infer<typeof sellerOrderPaymentSchema>;

export const sellerOrderItemSchema = z.object({
    itemId: z.number(),
    type: z.number(),
    title: z.string().nullish(),
    quantity: z.number(),
    unitPrice: z.number(),
    vatRate: z.number(),
    ownReferences: z.array(z.string()).nullish(),
    merchantPartNumber: z.string().nullish(),
});
export type SellerOrderItem = z.infer<typeof sellerOrderItemSchema>;

export const sellerOrderSchema = z.object({
    orderId: z.number(),
    createdDate: traderaDateSchema,
    expiresDate: traderaDateSchema.nullish(),
    lastUpdatedDate: traderaDateSchema,
    subTotal: z.number(),
    seller: sellerOrderUserSchema.nullish(),
    buyer: sellerOrderUserSchema.nullish(),
    shipTo: sellerOrderAddressSchema.nullish(),
    items: z.array(sellerOrderItemSchema).nullish(),
    sellerOrderPayments: z.array(sellerOrderPaymentSchema).nullish(),
    shippingType: z.string().nullish(),
    shippingCost: z.number(),
    shippingWeight: z.number().nullish(),
    purchaseOrderId: z.string().nullish(),
});
export type SellerOrder = z.infer<typeof sellerOrderSchema>;

export const freightLabelSchema = z.object({
    orderId: z.number(),
    freightLabelContent: z.string().nullish(),
});
export type FreightLabel = z.infer<typeof freightLabelSchema>;

export const shippingCodeSchema = z.object({
    orderId: z.number(),
    shippingProvider: z.string().nullish(),
    labellessShippingCode: z.string().nullish(),
    qrCodeImageUrl: z.string().nullish(),
    shipmentNo: z.string().nullish(),
    hasFreightLabel: z.boolean(),
});
export type ShippingCode = z.infer<typeof shippingCodeSchema>;

export const setSellerOrderAsShippedResponseSchema = z.object({
    orderId: z.number(),
});
export type SetSellerOrderAsShippedResponse = z.infer<typeof setSellerOrderAsShippedResponseSchema>;
