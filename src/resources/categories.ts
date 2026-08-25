import { z } from "zod";

import { HttpClient } from "../http";
import {
    AttributeDefinition,
    Category,
    attributeDefinitionSchema,
    categorySchema,
} from "../schemas/categories";

export class CategoriesResource {
    constructor(private readonly http: HttpClient) {}

    /** Gets the category tree. */
    getCategories(): Promise<Category[]> {
        return this.http.get("categories", { schema: z.array(categorySchema) });
    }

    /**
     * Gets attribute definitions for a category, including category-specific attributes such
     * as "Skick" (condition). Each definition carries its id and the allowed possibleTermValues.
     */
    getAttributeDefinitions(categoryId: number): Promise<AttributeDefinition[]> {
        return this.http.get(`categories/${categoryId}/attribute-definitions`, {
            schema: z.array(attributeDefinitionSchema),
        });
    }
}
