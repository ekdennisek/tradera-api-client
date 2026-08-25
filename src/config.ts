import { z } from "zod";

import { readEnvVar } from "./util/readEnvVar";

export const DEFAULT_BASE_URL = "https://api.tradera.com/v4/";

export interface TraderaClientConfig {
    /** Application ID. Falls back to the TRADERA_APP_ID environment variable. */
    appId?: number;
    /** Application key. Falls back to the TRADERA_APP_KEY environment variable. */
    appKey?: string;
    /** Tradera user ID, required only for endpoints that need user authorization. */
    userId?: number;
    /** User token obtained via the token login flow, required only for endpoints that need user authorization. */
    userToken?: string;
    /** Override the API base URL. Defaults to https://api.tradera.com/v4/. */
    baseUrl?: string;
    /** Override the fetch implementation, e.g. for testing. Defaults to the global fetch. */
    fetch?: typeof fetch;
}

export interface ResolvedConfig {
    appId: number;
    appKey: string;
    userId: number | undefined;
    userToken: string | undefined;
    baseUrl: string;
    fetch: typeof fetch;
}

export function resolveConfig(config: TraderaClientConfig): ResolvedConfig {
    return {
        appId: config.appId ?? readEnvVar("TRADERA_APP_ID", z.coerce.number().int()),
        appKey: config.appKey ?? readEnvVar("TRADERA_APP_KEY", z.string()),
        userId: config.userId,
        userToken: config.userToken,
        baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
        fetch: config.fetch ?? fetch,
    };
}
