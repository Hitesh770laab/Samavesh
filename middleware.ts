import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	// Use fetch to bypass importing heavy db adapters into the Edge runtime
	const response = await fetch(new URL("/api/auth/get-session", request.url), {
		headers: {
			cookie: request.headers.get("cookie") || "",
		},
	});
	
	const session = response.ok ? await response.json() : null;

	if (!session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/captions", "/reader"], // Apply middleware to specific routes
};
