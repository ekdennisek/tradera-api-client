import { TraderaClientConfig, resolveConfig } from "./config";
import { HttpClient } from "./http";
import { AuthResource } from "./resources/auth";
import { BuyerResource } from "./resources/buyer";
import { CategoriesResource } from "./resources/categories";
import { ItemsResource } from "./resources/items";
import { ListingsResource } from "./resources/listings";
import { OrdersResource } from "./resources/orders";
import { ReferenceDataResource } from "./resources/referenceData";
import { SearchResource } from "./resources/search";
import { UsersResource } from "./resources/users";

export class TraderaClient {
    readonly auth: AuthResource;
    readonly buyer: BuyerResource;
    readonly categories: CategoriesResource;
    readonly items: ItemsResource;
    readonly listings: ListingsResource;
    readonly orders: OrdersResource;
    readonly referenceData: ReferenceDataResource;
    readonly search: SearchResource;
    readonly users: UsersResource;

    constructor(config: TraderaClientConfig = {}) {
        const http = new HttpClient(resolveConfig(config));
        this.auth = new AuthResource(http);
        this.buyer = new BuyerResource(http);
        this.categories = new CategoriesResource(http);
        this.items = new ItemsResource(http);
        this.listings = new ListingsResource(http);
        this.orders = new OrdersResource(http);
        this.referenceData = new ReferenceDataResource(http);
        this.search = new SearchResource(http);
        this.users = new UsersResource(http);
    }
}
