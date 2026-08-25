import { z } from "zod";

// The OpenAPI spec declares Category as an empty object; this shape was verified against the
// live API (2026-08-25): every node has id, name and childCategories (possibly empty).
export interface Category {
    id: number;
    name?: string | null;
    childCategories?: Category[] | null;
}

export const categorySchema: z.ZodType<Category> = z.lazy(() =>
    z.object({
        id: z.number(),
        name: z.string().nullish(),
        childCategories: z.array(categorySchema).nullish(),
    }),
);

export const attributeDefinitionSchema = z.object({
    id: z.number(),
    name: z.string().nullish(),
    description: z.string().nullish(),
    maxNumberOfValues: z.number(),
    minNumberOfValues: z.number(),
    possibleTermValues: z.array(z.string()).nullish(),
    key: z.string().nullish(),
    attributeType: z.string().nullish(),
    valueFormatting: z.string().nullish(),
});
export type AttributeDefinition = z.infer<typeof attributeDefinitionSchema>;
