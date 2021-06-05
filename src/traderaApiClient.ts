import { createClientAsync } from "soap";
import { PublicService } from "./PublicService/publicService";
import { SearchService } from "./SearchService/searchService";

export class TraderaApiClient {
    private readonly publicServiceUrl = "https://api.tradera.com/v3/publicservice.asmx";
    private readonly searchServiceUrl = "https://api.tradera.com/v3/searchservice.asmx";
    // public readonly buyerService: BuyerService;
    // public readonly listingService: ListingService;
    // public readonly orderService: OrderService;
    public readonly publicService: PublicService;
    // public readonly restrictedService: RestrictedService;
    public readonly searchService: SearchService;

    public constructor(private readonly appId: number, private readonly appKey: string) {
        this.publicService = new PublicService();
        this.searchService = new SearchService();
    }

    public async init() {
        this.publicService.setSoapClient(
            await createClientAsync(
                this.wdsl(this.publicServiceUrl),
                undefined,
                this.serviceUrlWithAuth(this.publicServiceUrl),
            ),
        );
        this.searchService.setSoapClient(
            await createClientAsync(
                this.wdsl(this.searchServiceUrl),
                undefined,
                this.serviceUrlWithAuth(this.searchServiceUrl),
            ),
        );
    }

    private wdsl(serviceUrl: string) {
        return `${serviceUrl}?WSDL`;
    }

    private serviceUrlWithAuth(serviceUrl: string) {
        const url = new URL(serviceUrl);
        url.searchParams.append("appId", this.appId.toString());
        url.searchParams.append("appKey", this.appKey);
        return url.toString();
    }
}
