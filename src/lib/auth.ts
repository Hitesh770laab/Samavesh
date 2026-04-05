import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
        provider: "libsql",
    }),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // Set to true only after email verification flow is set up
	},
	baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
	secret: process.env.BETTER_AUTH_SECRET,
	plugins: [bearer(), nextCookies()],
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 24 hours
	},
});

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		return session;
	} catch (error) {
		console.error("Error getting current user:", error);
		return null;
	}
}
