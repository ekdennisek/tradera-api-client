import { z } from "zod";

import { HttpClient } from "../http";
import {
    ActiveFilter,
    Item,
    ItemAddedDescription,
    ItemQuickInfo,
    ItemRestarts,
    ItemTypeFilter,
    itemAddedDescriptionSchema,
    itemQuickInfoSchema,
    itemRestartsSchema,
    itemSchema,
} from "../schemas/items";

export interface GetSellerItemsOptions {
    categoryId?: number;
    filterActive?: ActiveFilter;
    filterItemType?: ItemTypeFilter;
    minEndDate?: Date;
    maxEndDate?: Date;
}

export interface GetSellerItemsQuickInfoOptions extends GetSellerItemsOptions {
    minCreatedDate?: Date;
    maxCreatedDate?: Date;
}

export class ItemsResource {
    constructor(private readonly http: HttpClient) {}

    /** Gets a single item by ID. */
    getItem(itemId: number): Promise<Item> {
        return this.http.get(`items/${itemId}`, { schema: itemSchema });
    }

    /** Gets added descriptions for an item. */
    getItemDescriptions(itemId: number): Promise<ItemAddedDescription[]> {
        return this.http.get(`items/${itemId}/descriptions`, {
            schema: z.array(itemAddedDescriptionSchema),
        });
    }

    /** Gets the restart history for an item. */
    getItemRestarts(itemId: number): Promise<ItemRestarts> {
        return this.http.get(`items/${itemId}/restarts`, { schema: itemRestartsSchema });
    }

    /** Gets items listed by a specific seller. */
    getSellerItems(userId: number, options: GetSellerItemsOptions = {}): Promise<Item[]> {
        return this.http.get(`items/seller/${userId}`, {
            query: { ...options },
            schema: z.array(itemSchema),
        });
    }

    /** Gets quick info for items listed by a specific seller. */
    getSellerItemsQuickInfo(
        userId: number,
        options: GetSellerItemsQuickInfoOptions = {},
    ): Promise<ItemQuickInfo[]> {
        return this.http.get(`items/seller/${userId}/quick-info`, {
            query: { ...options },
            schema: z.array(itemQuickInfoSchema),
        });
    }
}
