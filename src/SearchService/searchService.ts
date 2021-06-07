import { array, boolean, keyof, number, string, type, TypeOf } from "io-ts";
import { date } from "io-ts-types";
import { Service } from "../service";

export class SearchService extends Service {
    // TODO public async Search(request)

    public async SearchAdvanced(request: SearchAdvancedRequest) {
        const result = await this.callApiMethod<SearchResult>(
            "SearchAdvanced",
            "SearchAdvancedResult",
            request,
        );
        if (result.Errors && result.Errors.length > 0) {
            throw new Error(
                result.Errors.map(error => `${error.Code}: ${error.Message}.`).join(" "),
            );
        }
        return result;
    }

    // TODO public async SearchByFixedCriteria(request)

    // TODO public async SearchByZipCode(request)

    // TODO public async SearchCategoryCount(request)
}

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

const searchItemCodec = type({
    Id: number,
    ShortDescription: string,
    CategoryId: number,
    BuyItNowPrice: number,
    SellerId: number,
    SellerAlias: string,
    MaxBid: number,
    ThumbnailLink: string,
    SellerDsrAverage: number,
    EndDate: date,
    NextBid: number,
    HasBids: boolean,
    IsEnded: boolean,
    ItemType: keyof({
        Auction: null,
        AuctionWithBuyItNow: null,
        PureBuyItNow: null,
        ShopItem: null,
    }),
});

const errorCodec = type({
    Code: string,
    Message: string,
});

type SearchResult = TypeOf<typeof searchResultCodec>;
const searchResultCodec = type({
    TotalNumberOfItems: number,
    TotalNumberOfPages: number,
    Items: array(searchItemCodec),
    Errors: array(errorCodec),
});
