import { NextResponse } from "next/server";

/**
 * Step 1: Your First Next.js API Route Handler
 * 
 * In Next.js App Router:
 * 1. File must be named `route.ts` (or `route.js`).
 * 2. Placed inside a subfolder under `app/api/...` (e.g. `app/api/hello`).
 * 3. Export an `async function GET()` to handle HTTP GET requests sent to `/api/hello`.
 */
export async function GET() {
  // NextResponse.json() automatically formats the JavaScript object as JSON data
  return NextResponse.json({
    message: "Hello from your first Next.js API Route!",
    timestamp: new Date().toISOString(),
  });
}
