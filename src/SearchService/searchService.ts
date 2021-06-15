import { array, boolean, keyof, number, string, type, TypeOf } from "io-ts";
import { date } from "io-ts-types";
import { checkTypes, undefinable } from "../checkTypes";
import { Service } from "../service";

export class SearchService extends Service {
    // TODO public async Search(request)

    public async SearchAdvanced(request: SearchAdvancedRequest) {
        const result = await this.callApiMethod<SearchAdvancedResult>(
            "SearchAdvanced",
            "SearchAdvancedResult",
            request,
        );
        if (result.Errors && result.Errors.length > 0) {
            throw new Error(
                result.Errors.map(error => `${error.Code}: ${error.Message}.`).join(" "),
            );
        }
        return checkTypes(result, searchAdvancedResultCodec);
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

type SearchAdvancedResult = TypeOf<typeof searchAdvancedResultCodec>;
const searchAdvancedResultCodec = type({
    Errors: undefinable(array(type({
        Code: string,
        Message: string,
    }))),
    Items: array(type({
        CategoryId: number,
        EndDate: date,
        HasBids: boolean,
        Id: number,
        IsEnded: boolean,
        ItemType: keyof({
            Auction: null,
            AuctionWithBuyItNow: null,
            PureBuyItNow: null,
            ShopItem: null,
        }),
        MaxBid: number,
        NextBid: number,
        SellerAlias: string,
        SellerDsrAverage: number,
        SellerId: number,
        ShortDescription: string,
        ThumbnailLink: string,
    })),
    TotalNumberOfItems: number,
    TotalNumberOfPages: number,
});
