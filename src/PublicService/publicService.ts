import { array, boolean, keyof, number, string, type, TypeOf } from "io-ts";
import { date } from "io-ts-types";
import { checkTypes, nullable, undefinable } from "../checkTypes";
import { Service } from "../service";

export class PublicService extends Service {
    // TODO public async FetchToken(request)

    // TODO public async GetAcceptedBidderTypes(request)

    // TODO public async GetAttributeDefinitions(request)

    // TODO public async GetCategories(request)

    // TODO public async GetCounties(request)

    // TODO public async GetExpoItemTypes(request)

    // TODO public async GetFeedback(request)

    // TODO public async GetFeedbackSummary(request)

    public async GetItem(request: GetItemRequest) {
        const result = await this.callApiMethod<GetItemResult>("GetItem", "GetItemResult", request);
        return checkTypes(result, getItemResultCodec);
    }

    // TODO public async GetItemAddedDescriptions(request)

    // TODO public async GetItemFieldValues(request)

    // TODO public async GetItemTypes(request)

    public async GetOfficalTime() {
        return this.callApiMethod<GetOfficalTimeResult>("GetOfficalTime", "GetOfficalTimeResult");
    }

    /**
     *
     * @deprecated
     */
    // TODO public async GetPaymentTypes(request)

    /**
     *
     * @deprecated
     */
    // TODO public async GetSearchResult(request)

    /**
     *
     * @deprecated
     */
    public async GetSearchResultAdvanced(filter?: GetSearchResultAdvancedRequest) {
        return this.callApiMethod<GetSearchResultAdvancedResult>(
            "GetSearchResultAdvanced",
            "GetSearchResultAdvancedResult",
            filter,
        );
    }

    // TODO public async GetSearchResultAdvancedXml(request)

    // TODO public async GetSellerItems(request)

    // TODO public async GetSellerItemsQuickInfo(request)

    // TODO public async GetShippingProducts(request)

    /**
     *
     * @deprecated
     */
    // TODO public async GetShippingTypes(request)

    // TODO public async GetUserByAlias(request)
}

type GetItemRequest = {
    itemId: number;
};

type GetOfficalTimeResult = Date;

type GetSearchResultAdvancedResult = {
    TotalNumberOfItems: number;
    TotalNumberOfPages: number;
    Items: {
        ShippingOptions: {
            ShippingOptionId: number;
            Cost: number;
            ShippingWeight: number;
            ShippingProductId: number;
        }[];
        PaymentOptions: unknown; // TODO
        ImageLinks: string[];
        Buyers: {
            Id: number;
            Alias: string;
            FirstName: string;
            LastName: string;
            Email: string;
            TotalRating: number;
            PhoneNumber: string;
            MobilePhoneNumber: string;
            Address: string;
            ZipCode: string;
            City: string;
            CountryName: string;
            TransactionId: number;
        }[];
        Status: {
            Ended: boolean;
            GotBidders: boolean;
            GotWinner: boolean;
        };
        StartQuantity: number;
        RemainingQuantity: number;
        ItemType: "Auction" | "PureBuyItNow" | "ShopItem";
        Id: number;
        VAT: number;
        ShortDescription: string;
        OwnReferences: unknown; // TODO
        AttributeValues: unknown; // TODO
        ItemAttributes: unknown; // TODO
        LongDescription: string;
        StartDate: Date;
        EndDate: Date;
        CategoryId: number;
        OpeningBid: number;
        ReservePrice: number;
        ReservePriceReached: boolean;
        BuyItNowPrice: number;
        NextBid: number;
        PaymentCondition: string;
        ShippingCondition: string;
        AcceptsPickup: boolean;
        TotalBids: number;
        MaxBid: number;
        Bold: boolean;
        Thumbnail: boolean;
        Highlight: boolean;
        FeaturedItem: boolean;
        ItemLink: string;
        ThumbnailLink: string;
        AcceptedBuyerId: number;
        Paypal: boolean;
        PaymentTypeId: number;
        Seller: {
            Id: number;
            Alias: string;
            FirstName: string;
            LastName: string;
            Email: string;
            TotalRating: number;
            PhoneNumber: string;
            MobilePhoneNumber: string;
            Address: string;
            ZipCode: string;
            City: string;
            CountryName: string;
            TransactionId: number;
        };
        MaxBidder: {
            Id: number;
            Alias: string;
            FirstName: string;
            LastName: string;
            Email: string;
            TotalRating: number;
            PhoneNumber: string;
            MobilePhoneNumber: string;
            Address: string;
            ZipCode: string;
            City: string;
            CountryName: string;
            TransactionId: number;
        };
    }[];
};

type GetSearchResultAdvancedRequest = {
    query: {
        SearchWords?: string;
        CategoryId?: number;
        SearchInDescription?: boolean;
        Mode?: "AllWords" | "AnyWords";
        PriceMinimum?: number;
        PriceMaximum?: number;
        BidsMinimum?: number;
        BidsMaximum?: number;
        ZipCode?: string;
        CountyId?: number;
        Alias?: string;
        OrderBy?:
            | "EndDateAscending"
            | "EndDateDescending"
            | "PriceAscending"
            | "PriceDescending"
            | "BidsDescending";
        ItemStatus?: "Active" | "Ended";
        ItemType?: "All" | "Auction" | "FixedPrice";
        OnlyAuctionsWithBuyNow?: boolean;
        OnlyItemsWithThumbnail?: boolean;
        ItemsPerPage?: number; // Minimum 1, maximum 500. 0 or blank for default (50).
        PageNumber?: number;
        ItemConditon?: "All" | "OnlyNew" | "OnlySecondHand";
        SellerType?: "All" | "OnlyPrivate" | "OnlyBusiness";
    };
};

type GetItemResult = TypeOf<typeof getItemResultCodec>;
const getItemResultCodec = type({
    AcceptedBuyerId: number,
    AcceptsPickup: boolean,
    Bold: boolean,
    BuyItNowPrice: undefinable(number),
    Buyers: array(type({
        Id: number,
        Alias: string,
        TotalRating: number,
    })),
    CategoryId: number,
    EndDate: date,
    FeaturedItem: boolean,
    Highlight: boolean,
    Id: number,
    ImageLinks: type({
        string: array(string),
    }),
    ItemAttributes: type({
        int: array(number),
    }),
    ItemLink: string,
    ItemType: keyof({
        Auction: null,
        PureBuyItNow: null,
        ShopItem: null,
    }),
    LongDescription: string,
    MaxBid: number,
    MaxBidder: nullable(type({
        Id: number,
        Alias: string,
        TotalRating: number,
    })),
    NextBid: number,
    OpeningBid: number,
    OwnReferences: nullable(array(string)),
    PaymentCondition: string,
    PaymentOptions: type({
        int: array(number),
    }),
    PaymentTypeId: number,
    Paypal: boolean,
    RemainingQuantity: number,
    ReservePrice: undefinable(number),
    ReservePriceReached: undefinable(boolean),
    Seller: type({
        Id: number,
        Alias: string,
        TotalRating: number,
    }),
    ShippingCondition: string,
    ShippingOptions: array(type({
        ShippingOptionId: number,
        Cost: number,
        ShippingWeight: undefinable(number),
        ShippingProductId: undefinable(number),
    })),
    ShortDescription: string,
    StartDate: date,
    StartQuantity: number,
    Status: type({
        Ended: boolean,
        GotBidders: boolean,
        GotWinner: boolean,
    }),
    Thumbnail: boolean,
    ThumbnailLink: string,
    TotalBids: number,
    VAT: undefinable(number),
})
