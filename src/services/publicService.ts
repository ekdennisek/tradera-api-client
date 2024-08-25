import { Client, createClientAsync } from "soap";
import { readEnvVar } from "../util/readEnvVar";
import { z } from "zod";
import {
    arrayOfIntSchema,
    arrayOfStringSchema,
    attributeValuesSchema,
    imageLinkSchema,
    itemShippingSchema,
    itemStatusSchema,
    itemTypeSchema,
    userSchema,
} from "../schemas";

export class PublicService {
    private readonly url = "https://api.tradera.com/v3/publicservice.asmx";
    private client: Client | undefined;

    public async FetchToken() {
        const client = await this.getClient();
        const [result] = await client.FetchTokenAsync();
        return fetchTokenSchema.parse(result);
    }

    public async GetAcceptedBidderTypes() {
        const client = await this.getClient();
        const [result] = await client.GetAcceptedBidderTypesAsync();
        return getAcceptedBidderTypesSchema.parse(result);
    }

    public async GetAttributeDefinitions() {
        const client = await this.getClient();
        const [result] = await client.GetAttributeDefinitionsAsync();
        return getAttributeDefinitionsSchema.parse(result);
    }

    public async GetCategories() {
        const client = await this.getClient();
        const [result] = await client.GetCategoriesAsync();
        return getCategoriesSchema.parse(result);
    }

    public async GetCounties() {
        const client = await this.getClient();
        const [result] = await client.GetCountiesAsync();
        return getCountiesSchema.parse(result);
    }

    public async GetExpoItemTypes() {
        const client = await this.getClient();
        const [result] = await client.GetExpoItemTypesAsync();
        return getExpoItemTypesSchema.parse(result);
    }

    public async GetFeedback() {
        const client = await this.getClient();
        const [result] = await client.GetFeedbackAsync();
        return getFeedbackSchema.parse(result);
    }

    public async GetFeedbackSummary() {
        const client = await this.getClient();
        const [result] = await client.GetFeedbackSummaryAsync();
        return getFeedbackSummarySchema.parse(result);
    }

    public async GetItem(itemId: number) {
        const client = await this.getClient();
        const [result] = await client.GetItemAsync({ itemId });
        return getItemSchema.parse(result).GetItemResult;
    }

    public async GetItemAddedDescriptions() {
        const client = await this.getClient();
        const [result] = await client.GetItemAddedDescriptionsAsync();
        return getItemAddedDescriptionsSchema.parse(result);
    }

    public async GetItemFieldValues() {
        const client = await this.getClient();
        const [result] = await client.GetItemFieldValuesAsync();
        return getItemFieldValuesSchema.parse(result);
    }

    public async GetItemTypes() {
        const client = await this.getClient();
        const [result] = await client.GetItemTypesAsync();
        return getItemTypes.parse(result);
    }

    public async GetOfficalTime() {
        const client = await this.getClient();
        const [result] = await client.GetOfficalTimeAsync();
        return getOfficalTimeSchema.parse(result).GetOfficalTimeResult;
    }

    /**
     * @deprecated Use GetItemFieldValues instead.
     */
    public async GetPaymentTypes() {
        const client = await this.getClient();
        const [result] = await client.GetPaymentTypesAsync();
        return getPaymentTypesSchema.parse(result);
    }

    /**
     * @deprecated Use Search in SearchService instead.
     */
    public async GetSearchResult() {
        const client = await this.getClient();
        const [result] = await client.GetSearchResultAsync();
        return getSearchResultSchema.parse(result);
    }

    /**
     * @deprecated Use SearchAdvanced in SearchService instead.
     */
    public async GetSearchResultAdvanced() {
        const client = await this.getClient();
        const [result] = await client.GetSearchResultAdvancedAsync();
        return getSearchResultAdvancedSchema.parse(result);
    }

    public async GetSearchResultAdvancedXml() {
        const client = await this.getClient();
        const [result] = await client.GetSearchResultAdvancedXmlAsync();
        return getSearchResultAdvancedXmlSchema.parse(result);
    }

    public async GetSellerItems() {
        const client = await this.getClient();
        const [result] = await client.GetSellerItemsAsync();
        return getSellerItemsSchema.parse(result);
    }

    public async GetSellerItemsQuickInfo() {
        const client = await this.getClient();
        const [result] = await client.GetSellerItemsQuickInfoAsync();
        return getSellerItemsQuickinfoSchema.parse(result);
    }

    public async GetShippingOptions() {
        const client = await this.getClient();
        const [result] = await client.GetShippingOptionsAsync();
        return getShippingOptionsSchema.parse(result);
    }

    /**
     * @deprecated Use GetItemFieldValues instead.
     */
    public async GetShippingTypes() {
        const client = await this.getClient();
        const [result] = await client.GetShippingTypesAsync();
        return getShippingTypesSchema.parse(result);
    }

    public async GetUserByAlias() {
        const client = await this.getClient();
        const [result] = await client.GetUserByAliasAsync();
        return getUserByAliasSchema.parse(result);
    }

    private async getClient() {
        if (!this.client) {
            this.client = await createClientAsync(`${this.url}?WSDL`);
            const url = new URL(this.url);
            url.searchParams.append("appId", readEnvVar("TRADERA_APP_ID", z.string()));
            url.searchParams.append("appKey", readEnvVar("TRADERA_APP_KEY", z.string()));
            this.client.setEndpoint(url.toString());
        }
        return this.client;
    }
}

const fetchTokenSchema = z.strictObject({
    // TODO
});

const getAcceptedBidderTypesSchema = z.strictObject({
    // TODO
});

const getAttributeDefinitionsSchema = z.strictObject({
    // TODO
});

const getCategoriesSchema = z.strictObject({
    // TODO
});

const getCountiesSchema = z.strictObject({
    // TODO
});

const getExpoItemTypesSchema = z.strictObject({
    // TODO
});

const getFeedbackSchema = z.strictObject({
    // TODO
});

const getFeedbackSummarySchema = z.strictObject({
    // TODO
});

const getItemSchema = z.strictObject({
    GetItemResult: z.strictObject({
        ShippingOptions: z.array(itemShippingSchema).optional(),
        PaymentOptions: arrayOfIntSchema.optional().nullable(),
        ImageLinks: arrayOfStringSchema.optional(),
        Buyers: z.array(userSchema).optional(),
        Status: itemStatusSchema.optional(),
        StartQuantity: z.number(),
        RemainingQuantity: z.number(),
        ItemType: itemTypeSchema,
        DetailedImageLinks: z.array(imageLinkSchema).optional(),
        Id: z.number(),
        VAT: z.number().optional(),
        ShortDescription: z.string().optional(),
        OwnReferences: arrayOfStringSchema.optional().nullable(),
        AttributeValues: attributeValuesSchema.optional(),
        ItemAttributes: arrayOfIntSchema.optional(),
        LongDescription: z.string().optional(),
        StartDate: z.date(),
        EndDate: z.date(),
        CategoryId: z.number(),
        OpeningBid: z.number().optional(),
        ReservePrice: z.number().optional(),
        ReservePriceReached: z.boolean().optional(),
        BuyItNowPrice: z.number().optional(),
        NextBid: z.number().optional(),
        PaymentCondition: z.string().optional(),
        ShippingCondition: z.string().optional(),
        AcceptsPickup: z.boolean(),
        TotalBids: z.number(),
        MaxBid: z.number().optional(),
        Bold: z.boolean(),
        Thumbnail: z.boolean(),
        Highlight: z.boolean(),
        FeaturedItem: z.boolean(),
        ItemLink: z.string().optional(),
        ThumbnailLink: z.string().optional(),
        AcceptedBuyerId: z.number(),
        Paypal: z.boolean(),
        PaymentTypeId: z.number(),
        Seller: userSchema.optional(),
        MaxBidder: userSchema.optional(),
        UserSelectedEndDate: z.boolean(),
        Restarts: z.number(),
        Duration: z.number(),
        ReservePriceManuallySet: z.boolean(),
    }),
});

const getItemAddedDescriptionsSchema = z.strictObject({
    // TODO
});

const getItemFieldValuesSchema = z.strictObject({
    // TODO
});

const getItemTypes = z.strictObject({
    // TODO
});

const getOfficalTimeSchema = z.strictObject({
    GetOfficalTimeResult: z.date(),
});

const getPaymentTypesSchema = z.strictObject({
    // TODO
});

const getSearchResultSchema = z.strictObject({
    // TODO
});

const getSearchResultAdvancedSchema = z.strictObject({
    // TODO
});

const getSearchResultAdvancedXmlSchema = z.strictObject({
    // TODO
});

const getSellerItemsSchema = z.strictObject({
    // TODO
});

const getSellerItemsQuickinfoSchema = z.strictObject({
    // TODO
});

const getShippingOptionsSchema = z.strictObject({
    // TODO
});

const getShippingTypesSchema = z.strictObject({
    // TODO
});

const getUserByAliasSchema = z.strictObject({
    // TODO
});
