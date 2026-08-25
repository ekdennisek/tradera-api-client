import { z } from "zod";

import { HttpClient } from "../http";
import {
    FreightLabel,
    SellerOrder,
    SellerOrderQueryDateMode,
    SetSellerOrderAsShippedResponse,
    ShippingCode,
    freightLabelSchema,
    sellerOrderSchema,
    setSellerOrderAsShippedResponseSchema,
    shippingCodeSchema,
} from "../schemas/orders";

export interface GetOrdersOptions {
    fromDate?: Date;
    toDate?: Date;
    /** Which date the fromDate/toDate range matches on: created date or last updated date. */
    queryDateMode?: SellerOrderQueryDateMode;
}

export class OrdersResource {
    constructor(private readonly http: HttpClient) {}

    /** Gets the authenticated seller's orders within a date range. */
    getOrders(options: GetOrdersOptions = {}): Promise<SellerOrder[]> {
        return this.http.get("orders", {
            query: { ...options },
            schema: z.array(sellerOrderSchema),
            userAuth: true,
        });
    }

    /** Gets orders by their IDs. */
    getOrdersByIds(orderIds: number[]): Promise<SellerOrder[]> {
        return this.http.get(`orders/${orderIds.join(",")}`, {
            schema: z.array(sellerOrderSchema),
            userAuth: true,
        });
    }

    /** Marks an order as shipped. */
    shipOrder(orderId: number): Promise<SetSellerOrderAsShippedResponse> {
        return this.http.post(`orders/${orderId}/ship`, {
            schema: setSellerOrderAsShippedResponseSchema,
            userAuth: true,
        });
    }

    /** Gets freight labels for the specified orders. */
    getFreightLabels(orderIds: number[]): Promise<FreightLabel[]> {
        return this.http.get(`orders/${orderIds.join(",")}/freight-labels`, {
            schema: z.array(freightLabelSchema),
            userAuth: true,
        });
    }

    /**
     * Gets the shipping codes for the specified orders (at most 50) — the code to write on
     * the parcel for a labelless shipment, and the QR code to show at drop-off. Use this for
     * shipping options that have no printable freight label, such as Instabox.
     */
    getShippingCodes(orderIds: number[]): Promise<ShippingCode[]> {
        return this.http.get(`orders/${orderIds.join(",")}/shipping-codes`, {
            schema: z.array(shippingCodeSchema),
            userAuth: true,
        });
    }
}
