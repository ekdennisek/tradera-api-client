import { ZodType, ZodTypeDef, z } from "zod";

import { ResolvedConfig } from "./config";
import { TraderaApiError } from "./error";

export type QueryValue = string | number | boolean | Date | undefined | null;
export type Query = Record<string, QueryValue>;

interface RequestOptions<T> {
    query?: Query;
    body?: unknown;
    /** When omitted, the response body is ignored and the request resolves to void. */
    schema?: ZodType<T, ZodTypeDef, unknown>;
    /** Send X-User-Id/X-User-Token headers. Requires userId and userToken in the client config. */
    userAuth?: boolean;
}

const errorEnvelopeSchema = z.object({
    error: z.object({
        code: z.string().nullish(),
        message: z.string().nullish(),
    }),
});

export class HttpClient {
    constructor(private readonly config: ResolvedConfig) {}

    get<T = void>(path: string, options: RequestOptions<T>): Promise<T> {
        return this.request("GET", path, options);
    }

    post<T = void>(path: string, options: RequestOptions<T>): Promise<T> {
        return this.request("POST", path, options);
    }

    private async request<T>(method: string, path: string, options: RequestOptions<T>): Promise<T> {
        const url = new URL(path, this.config.baseUrl);
        for (const [key, value] of Object.entries(options.query ?? {})) {
            if (value === undefined || value === null) continue;
            url.searchParams.set(key, value instanceof Date ? value.toISOString() : String(value));
        }

        const headers: Record<string, string> = {
            "X-App-Id": String(this.config.appId),
            "X-App-Key": this.config.appKey,
            "Accept": "application/json",
        };
        if (options.userAuth) {
            if (this.config.userId === undefined || this.config.userToken === undefined) {
                throw new Error(
                    "This endpoint requires user authorization: " +
                        "configure userId and userToken on the TraderaClient.",
                );
            }
            headers["X-User-Id"] = String(this.config.userId);
            headers["X-User-Token"] = this.config.userToken;
        }

        let body: string | undefined;
        if (options.body !== undefined) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(options.body);
        }

        const response = await this.config.fetch(url, { method, headers, body });
        if (!response.ok) {
            throw await this.toApiError(response);
        }
        if (!options.schema) {
            return undefined as T;
        }
        return options.schema.parse(await response.json());
    }

    private async toApiError(response: Response): Promise<TraderaApiError> {
        let text = "";
        try {
            text = await response.text();
        } catch {
            // Fall through to the status-only message.
        }
        try {
            const envelope = errorEnvelopeSchema.parse(JSON.parse(text));
            return new TraderaApiError(
                response.status,
                envelope.error.code ?? undefined,
                envelope.error.message ??
                    `Tradera API request failed with status ${response.status}.`,
            );
        } catch {
            const detail = text ? `: ${text.slice(0, 200)}` : ".";
            return new TraderaApiError(
                response.status,
                undefined,
                `Tradera API request failed with status ${response.status}${detail}`,
            );
        }
    }
}
