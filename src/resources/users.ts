import { z } from "zod";

import { HttpClient } from "../http";
import { User, userSchema } from "../schemas/common";
import {
    Feedback,
    FeedbackSummary,
    GetFeedbackRole,
    feedbackSchema,
    feedbackSummarySchema,
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
}
