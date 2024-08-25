import { ZodType } from "zod";

export function readEnvVar<T>(envVar: string, schema: ZodType<T>): T {
    try {
        return schema.parse(process.env[envVar]);
    } catch (error) {
        throw new Error(`Environment variable ${envVar} not set.`);
    }
}
