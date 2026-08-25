export { TraderaClient } from "./client";
export type { TraderaClientConfig } from "./config";
export { TraderaApiError } from "./error";

export type { FetchTokenRequest } from "./resources/auth";
export type { GetSellerItemsOptions, GetSellerItemsQuickInfoOptions } from "./resources/items";
export type { SearchOptions } from "./resources/search";

export type {
    BankIdVerificationProgress,
    BeginBankIdOnFileVerificationResult,
    BeginBankIdVerificationResult,
    Token,
} from "./schemas/auth";
export type { AttributeDefinition, Category } from "./schemas/categories";
export type {
    AttributeValues,
    ImageLink,
    NumberAttributeValue,
    TermAttributeValue,
    User,
} from "./schemas/common";
export { ActiveFilter, ApiItemType, ItemTypeFilter } from "./schemas/items";
export type {
    Item,
    ItemAddedDescription,
    ItemQuickInfo,
    ItemRestarts,
    ItemShipping,
    ItemStatus,
    RestartedItem,
} from "./schemas/items";
export type {
    AttributeFilter,
    CategoryCountRequest,
    CategoryCountResult,
    NumberAttributeFilter,
    SearchAdvancedRequest,
    SearchByFixedCriteriaRequest,
    SearchByZipCodeRequest,
    SearchCategory,
    SearchError,
    SearchItem,
    SearchResult,
} from "./schemas/search";
