import { Client, createClientAsync } from "soap";
import { PublicService } from "./PublicService/publicService";

export class TraderaApiClient {
    private readonly publicServiceUrl = "https://api.tradera.com/v3/PublicService.asmx";
    private soapClient: Client | undefined;
    // public readonly buyerService: BuyerService;
    // public readonly listingService: ListingService;
    // public readonly orderService: OrderService;
    public readonly publicService: PublicService;
    // public readonly restrictedService: RestrictedService;
    // public readonly searchService: SearchService;

    public constructor(private readonly appId: number, private readonly appKey: string) {
        this.publicService = new PublicService();
    }

    public async init() {
        this.soapClient = await createClientAsync(
            this.wdsl(),
            undefined,
            this.publicServiceUrlWithAuth(),
        );
        this.publicService.setSoapClient(this.soapClient);
    }

    private wdsl() {
        return `${this.publicServiceUrl}?WSDL`;
    }

    private publicServiceUrlWithAuth() {
        const url = new URL(this.publicServiceUrl);
        url.searchParams.append("appId", this.appId.toString());
        url.searchParams.append("appKey", this.appKey);
        return url.toString();
    }
}
