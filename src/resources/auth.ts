import { HttpClient } from "../http";
import {
    BankIdVerificationProgress,
    BeginBankIdOnFileVerificationResult,
    BeginBankIdVerificationResult,
    Token,
    bankIdVerificationProgressSchema,
    beginBankIdOnFileVerificationResultSchema,
    beginBankIdVerificationResultSchema,
    tokenSchema,
} from "../schemas/auth";

export interface FetchTokenRequest {
    /** The user ID to fetch a token for. */
    userId: number;
    /** The session-specific secret key (skey) used in the token login flow. */
    secretKey: string;
}

export class AuthResource {
    constructor(private readonly http: HttpClient) {}

    /**
     * Fetches an authentication token for a user who has completed the token login flow
     * (https://api.tradera.com/token-login?appId=..&pkey=..&skey=..), using the same skey
     * as secretKey.
     */
    fetchToken(request: FetchTokenRequest): Promise<Token> {
        return this.http.post("auth/token", { body: request, schema: tokenSchema });
    }

    /**
     * Begins a BankID verification process.
     *
     * Requires userId/userToken in the client config, and BankID access must be activated
     * for your application by Tradera (apiadmin@tradera.com).
     */
    beginBankId(): Promise<BeginBankIdVerificationResult> {
        return this.http.post("auth/bankid/begin", {
            schema: beginBankIdVerificationResultSchema,
            userAuth: true,
        });
    }

    /**
     * Begins a BankID-on-file verification process.
     *
     * Requires userId/userToken in the client config, and BankID access must be activated
     * for your application by Tradera (apiadmin@tradera.com).
     */
    beginBankIdOnFile(): Promise<BeginBankIdOnFileVerificationResult> {
        return this.http.post("auth/bankid/begin-on-file", {
            schema: beginBankIdOnFileVerificationResultSchema,
            userAuth: true,
        });
    }

    /**
     * Gets the progress of an ongoing BankID verification.
     *
     * Requires userId/userToken in the client config, and BankID access must be activated
     * for your application by Tradera (apiadmin@tradera.com).
     */
    getBankIdProgress(bankIdOrderRef: string): Promise<BankIdVerificationProgress> {
        return this.http.get("auth/bankid/progress", {
            query: { bankIdOrderRef },
            schema: bankIdVerificationProgressSchema,
            userAuth: true,
        });
    }

    /**
     * Cancels an ongoing BankID verification.
     *
     * Requires userId/userToken in the client config, and BankID access must be activated
     * for your application by Tradera (apiadmin@tradera.com).
     */
    cancelBankId(bankIdOrderRef: string): Promise<void> {
        return this.http.post("auth/bankid/cancel", {
            body: { bankIdOrderRef },
            userAuth: true,
        });
    }
}
