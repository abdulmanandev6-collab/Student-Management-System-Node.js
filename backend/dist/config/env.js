import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().default('4000'),
    // For local default PostgreSQL: db "school_mgmt" on localhost:5432, user "postgres" with no password.
    // Override via DATABASE_URL in .env for real deployments.
    DATABASE_URL: z
        .string()
        .default('postgres://postgres:11223344@localhost:5432/school_mgmt'),
    // Provide safe-but-dev-only defaults so the app starts without extra config.
    JWT_ACCESS_SECRET: z
        .string()
        .min(8)
        .default('dev-access-secret-change-me'),
    JWT_REFRESH_SECRET: z
        .string()
        .min(8)
        .default('dev-refresh-secret-change-me'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().email().optional()
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    // Fail fast on invalid configuration
    console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
export const config = {
    nodeEnv: parsed.data.NODE_ENV,
    port: Number(parsed.data.PORT),
    dbUrl: parsed.data.DATABASE_URL,
    jwt: {
        accessSecret: parsed.data.JWT_ACCESS_SECRET,
        refreshSecret: parsed.data.JWT_REFRESH_SECRET,
        accessExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
        refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN
    },
    corsOrigin: parsed.data.CORS_ORIGIN,
    resendApiKey: parsed.data.RESEND_API_KEY,
    emailFrom: parsed.data.EMAIL_FROM
};
