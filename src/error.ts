export class TraderaApiError extends Error {
    /** HTTP status code of the failed request. */
    readonly status: number;
    /** Error code from the API's error envelope, e.g. "SandboxNotSupported", if present. */
    readonly code: string | undefined;

    constructor(status: number, code: string | undefined, message: string) {
        super(message);
        this.name = "TraderaApiError";
        this.status = status;
        this.code = code;
    }

    /** True when the request was rejected because the rate limit (10,000 calls/24h per method) was exceeded. */
    get isRateLimited(): boolean {
        return this.status === 429;
    }
}
