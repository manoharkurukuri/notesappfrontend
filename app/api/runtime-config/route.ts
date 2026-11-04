export const dynamic = "force-dynamic";

export function GET() {
  const apiUrl = (process.env.API_URL ?? process.env.BASE_URL)?.trim();
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
    const error = "API_URL (or BASE_URL) must be set to an HTTP(S) URL without credentials";
    console.error(error);
    return Response.json({ error }, { status: 500, headers });
  }

  return Response.json({ apiUrl }, { headers });
}
