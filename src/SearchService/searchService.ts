import { Service } from "../service";

export class SearchService extends Service {
    public async SearchAdvanced(request: SearchAdvancedRequest) {
        const result = await this.callApiMethod<SearchResult>("SearchAdvanced", "SearchAdvancedResult", request);
        if (result.Errors && result.Errors.length > 0) {
            throw new Error(result.Errors.map(error => `${error.Code}: ${error.Message}.`).join(" "));
    }
        return result;
}

type SearchError = {
    Code: string;
    Message: string;
};

type SearchAdvancedRequest = {
    request: {
        SearchWords?: string;
        CategoryId?: number;
        SearchInDescription?: boolean;
        Mode?: "Or" | "Exact" | "And";
        PriceMinimum?: number | null;
        PriceMaximum?: number | null;
        BidsMinimum?: number | null;
        BidsMaximum?: number | null;
        ZipCode?: string;
        CountyId?: number;
        Alias?: string | null;
        OrderBy?:
            | "Relevance"
            | "BidsAscending"
            | "BidsDescending"
            | "PriceAscending"
            | "PriceDescending"
            | "EndDateAscending"
            | "EndDateDescending"
            | "StartDateDescending"
            | "DsrAverage";
        ItemStatus?: "Ended" | "Active";
        ItemType?: "All" | "Auction" | "BuyItNow";
        OnlyAuctionsWithBuyNow?: boolean;
        OnlyItemsWithThumbnail?: boolean;
        ItemsPerPage?: number;
        PageNumber?: number;
        ItemCondition?: "All" | "OnlySecondHand" | "OnlyNew";
        SellerType?: "All" | "Private" | "Company";
        Brands?: string[];
        CampaignCodeIds?: number[];
    };
};

type SearchItem = {
    Id: number;
    ShortDescription: string;
    CategoryId: number;
    BuyItNowPrice: number;
    SellerId: number;
    SellerAlias: string;
    MaxBid: number;
    ThumbnailLink: string;
    SellerDsrAverage: number;
    EndDate: Date;
    NextBid: number;
    HasBids: boolean;
    IsEnded: boolean;
    ItemType: "Auction" | "AuctionWithBuyItNow" | "PureBuyItNow" | "ShopItem";
};

type SearchResult = {
    TotalNumberOfItems: number;
    TotalNumberOfPages: number;
    Items: SearchItem[];
    Errors: SearchError[] | undefined;
};
