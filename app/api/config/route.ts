export const dynamic = "force-dynamic";

export function GET() {
  const baseURL = process.env.BASE_URL?.trim();
  const headers = { "Cache-Control": "no-store" };

  if (!baseURL) {
    return Response.json(
      { error: "Backend API is not configured. Set BASE_URL on the frontend server." },
      { status: 503, headers },
    );
  }

  const url = URL.canParse(baseURL) ? new URL(baseURL) : null;
  if (
    !url ||
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    return Response.json(
      { error: "BASE_URL must be an HTTP or HTTPS URL without credentials." },
      { status: 503, headers },
    );
  }

  return Response.json({ baseURL }, { headers });
}
