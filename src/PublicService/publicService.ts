import { Service } from "./service";

export class PublicService extends Service {
    public async GetOfficalTime() {
        return this.callApiMethod<GetOfficalTimeResult>("GetOfficalTime", "GetOfficalTimeResult");
    }

    public async GetSearchResultAdvanced(filter?: GetSearchResultAdvancedRequest) {
        return this.callApiMethod<GetSearchResultAdvancedResult>(
            "GetSearchResultAdvanced",
            "GetSearchResultAdvancedResult",
            filter,
        );
    }
}

type GetOfficalTimeResult = Date;

type GetSearchResultAdvancedResult = {
    TotalNumberOfItems: number;
    TotalNumberOfPages: number;
    Items: Array<{
        ShippingOptions: Array<{
            ShippingOptionId: number;
            Cost: number;
            ShippingWeight: number;
            ShippingProductId: number;
        }>;
        PaymentOptions: unknown; // TODO
        ImageLinks: string[];
        Buyers: Array<{
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
        }>;
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
    }>;
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
