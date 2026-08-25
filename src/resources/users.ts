import { z } from "zod";

import { HttpClient } from "../http";
import { User, userSchema } from "../schemas/common";
import {
    Feedback,
    FeedbackSummary,
    GetFeedbackRole,
    MemberPaymentOptionsResult,
    SellerInfo,
    UserInfo,
    feedbackSchema,
    feedbackSummarySchema,
    memberPaymentOptionsResultSchema,
    sellerInfoSchema,
    userInfoSchema,
} from "../schemas/users";

export interface GetFeedbackOptions {
    role?: GetFeedbackRole;
    maxNumberOfItems?: number;
}

export class UsersResource {
    constructor(private readonly http: HttpClient) {}

    /** Gets a user by their alias. */
    getUserByAlias(alias: string): Promise<User> {
        return this.http.get(`users/by-alias/${encodeURIComponent(alias)}`, {
            schema: userSchema,
        });
    }

    /** Gets feedback left for a user. */
    getFeedback(userId: number, options: GetFeedbackOptions = {}): Promise<Feedback[]> {
        return this.http.get(`users/${userId}/feedback`, {
            query: { ...options },
            schema: z.array(feedbackSchema),
        });
    }

    /** Gets a feedback summary (positive/negative counts) for a user. */
    getFeedbackSummary(userId: number): Promise<FeedbackSummary> {
        return this.http.get(`users/${userId}/feedback/summary`, {
            schema: feedbackSummarySchema,
        });
    }

    /**
     * Gets the authenticated user's profile information.
     * Requires userId/userToken in the client config.
     */
    getMe(): Promise<UserInfo> {
        return this.http.get("users/me", { schema: userInfoSchema, userAuth: true });
    }

    /**
     * Gets the authenticated user's payment options.
     * Requires userId/userToken in the client config.
     */
    getMyPaymentOptions(): Promise<MemberPaymentOptionsResult> {
        return this.http.get("users/me/payment-options", {
            schema: memberPaymentOptionsResultSchema,
            userAuth: true,
        });
    }

    /**
     * Gets seller info (detailed seller rating, shop status) for a user.
     * Requires userId/userToken in the client config.
     */
    getSellerInfo(userId: number): Promise<SellerInfo> {
        return this.http.get(`users/${userId}/seller-info`, {
            schema: sellerInfoSchema,
            userAuth: true,
        });
    }
}
