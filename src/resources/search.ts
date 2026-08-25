import { HttpClient } from "../http";
import {
    CategoryCountRequest,
    CategoryCountResult,
    SearchAdvancedRequest,
    SearchByFixedCriteriaRequest,
    SearchByZipCodeRequest,
    SearchResult,
    categoryCountResultSchema,
    searchResultSchema,
} from "../schemas/search";

export interface SearchOptions {
    categoryId?: number;
    pageNumber?: number;
    orderBy?: string;
}

export class SearchResource {
    constructor(private readonly http: HttpClient) {}

    /** Searches for items with basic parameters. */
    search(query: string, options: SearchOptions = {}): Promise<SearchResult> {
        return this.http.get("search", {
            query: { query, ...options },
            schema: searchResultSchema,
        });
    }

    /** Performs an advanced search with multiple filter criteria. */
    searchAdvanced(request: SearchAdvancedRequest): Promise<SearchResult> {
        return this.http.post("search/advanced", { body: request, schema: searchResultSchema });
    }

    /** Gets category counts for a search query. */
    getCategoryCount(request: CategoryCountRequest): Promise<CategoryCountResult> {
        return this.http.post("search/category-count", {
            body: request,
            schema: categoryCountResultSchema,
        });
    }

    /** Searches for items by zip code. */
    searchByZipCode(request: SearchByZipCodeRequest): Promise<SearchResult> {
        return this.http.post("search/by-zip-code", { body: request, schema: searchResultSchema });
    }

    /** Searches for items by fixed criteria (e.g. ending soon, newly listed). */
    searchByFixedCriteria(request: SearchByFixedCriteriaRequest): Promise<SearchResult> {
        return this.http.post("search/by-fixed-criteria", {
            body: request,
            schema: searchResultSchema,
        });
    }
}
