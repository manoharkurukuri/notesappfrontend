import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const apiUrl = process.env.API_URL;
  const headers = { "Cache-Control": "no-store" };

  let parsedUrl: URL | undefined;
  if (apiUrl) {
    try {
      parsedUrl = new URL(apiUrl);
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
    }
  }

  if (
    !parsedUrl ||
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    parsedUrl.username ||
    parsedUrl.password
  ) {
    const error = "API_URL must be set to an HTTP(S) URL without credentials";
    console.error(error);
    return NextResponse.json({ error }, { status: 500, headers });
  }

  return NextResponse.json({ apiUrl }, { headers });
}
