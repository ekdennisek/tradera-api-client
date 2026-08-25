import { TraderaClientConfig, resolveConfig } from "./config";
import { HttpClient } from "./http";
import { AuthResource } from "./resources/auth";
import { CategoriesResource } from "./resources/categories";
import { ItemsResource } from "./resources/items";
import { SearchResource } from "./resources/search";

export class TraderaClient {
    readonly auth: AuthResource;
    readonly categories: CategoriesResource;
    readonly items: ItemsResource;
    readonly search: SearchResource;

    constructor(config: TraderaClientConfig = {}) {
        const http = new HttpClient(resolveConfig(config));
        this.auth = new AuthResource(http);
        this.categories = new CategoriesResource(http);
        this.items = new ItemsResource(http);
        this.search = new SearchResource(http);
    }
}
