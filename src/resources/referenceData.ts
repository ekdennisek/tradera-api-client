import { z } from "zod";

import { HttpClient } from "../http";
import {
    IdDescriptionPair,
    ItemFieldsResponse,
    ShippingOptionsResponse,
    idDescriptionPairSchema,
    itemFieldsResponseSchema,
    officialTimeSchema,
    shippingOptionsResponseSchema,
} from "../schemas/referenceData";

export interface GetShippingOptionsOptions {
    /** ISO 3166-1 alpha-2 country codes to get shipping options from, e.g. ["SE"]. */
    fromCountryCodes?: string[];
    categoryIds?: number[];
}

export class ReferenceDataResource {
    constructor(private readonly http: HttpClient) {}

    /** Gets the current official Tradera server time. */
    getOfficialTime(): Promise<Date> {
        return this.http.get("reference-data/time", { schema: officialTimeSchema });
    }

    /** Gets the accepted bidder types (buyer regions): 1 = Sweden, 3 = International, 4 = EU. */
    getAcceptedBidderTypes(): Promise<IdDescriptionPair[]> {
        return this.http.get("reference-data/accepted-bidder-types", {
            schema: z.array(idDescriptionPairSchema),
        });
    }

    /** Gets the expo item types with current fees. */
    getExpoItemTypes(): Promise<IdDescriptionPair[]> {
        return this.http.get("reference-data/expo-item-types", {
            schema: z.array(idDescriptionPairSchema),
        });
    }

    /** Gets the available item types. */
    getItemTypes(): Promise<IdDescriptionPair[]> {
        return this.http.get("reference-data/item-types", {
            schema: z.array(idDescriptionPairSchema),
        });
    }

    /** Gets the Swedish counties. */
    getCounties(): Promise<IdDescriptionPair[]> {
        return this.http.get("reference-data/counties", {
            schema: z.array(idDescriptionPairSchema),
        });
    }

    /**
     * Gets the available item field values (VAT rates, payment types, shipping types, and the
     * coarse Ny/Begagnad condition flag in itemAttributes). Finer category-specific "Skick"
     * values come from categories.getAttributeDefinitions instead.
     */
    getItemFieldValues(): Promise<ItemFieldsResponse> {
        return this.http.get("reference-data/item-field-values", {
            schema: itemFieldsResponseSchema,
        });
    }

    /** Gets shipping options (products per weight span) for the specified country codes. */
    getShippingOptions(options: GetShippingOptionsOptions = {}): Promise<ShippingOptionsResponse> {
        return this.http.get("reference-data/shipping-options", {
            query: { ...options },
            schema: shippingOptionsResponseSchema,
        });
    }
}
