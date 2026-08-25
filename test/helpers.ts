export interface RecordedRequest {
    url: URL;
    method: string | undefined;
    headers: Record<string, string>;
    body: string | undefined;
}

export function fakeFetch(
    status: number,
    responseBody: unknown,
): { fetch: typeof fetch; requests: RecordedRequest[] } {
    const requests: RecordedRequest[] = [];
    const fetchImpl = async (input: string | URL | Request, init?: RequestInit) => {
        requests.push({
            url: new URL(input instanceof Request ? input.url : input),
            method: init?.method,
            headers: (init?.headers ?? {}) as Record<string, string>,
            body: typeof init?.body === "string" ? init.body : undefined,
        });
        const text =
            responseBody === undefined
                ? ""
                : typeof responseBody === "string"
                  ? responseBody
                  : JSON.stringify(responseBody);
        return new Response(text, {
            status,
            headers: { "Content-Type": "application/json" },
        });
    };
    return { fetch: fetchImpl as typeof fetch, requests };
}
