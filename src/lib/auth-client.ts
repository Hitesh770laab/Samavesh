"use client"
import { createAuthClient } from "better-auth/react"

const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        // Browser: use current origin
        return window.location.origin;
    }

    // Server: use environment variables or default
    return process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [],
});

export const { 
    useSession, 
    signIn, 
    signUp, 
    signOut, 
} = authClient;