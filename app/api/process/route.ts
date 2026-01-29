import { NextResponse } from "next/server";

function getFastapiProcessUrl() {
  const base = process.env.FASTAPI_URL || "";
  if (!base) return "";
  return `${base.replace(/\/$/, "")}/process`;
}

export async function POST(req: Request) {
  const targetUrl = getFastapiProcessUrl();
  if (!targetUrl) {
    return NextResponse.json(
      { error: "FASTAPI_URL is not configured" },
      { status: 500 },
    );
  }

  const contentType = req.headers.get("content-type") || "";
  let upstream: Response;

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    upstream = await fetch(targetUrl, {
      method: "POST",
      body: formData,
    });
  } else {
    const body = await req.json().catch(() => ({}));
    upstream = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "n8n-saas-proxy/1.0",
      },
      body: JSON.stringify(body),
    });
  }

  if (!upstream.ok) {
    const errorText = await upstream.text().catch(() => "");
    return NextResponse.json(
      {
        error: "FastAPI request failed",
        detail: errorText || `HTTP ${upstream.status}`,
      },
      { status: upstream.status },
    );
  }

  const upstreamContentType = upstream.headers.get("content-type") || "";
  const contentDisposition = upstream.headers.get("content-disposition");

  if (!upstreamContentType.includes("application/json")) {
    const buffer = Buffer.from(await upstream.arrayBuffer());
    const headers: Record<string, string> = {
      "content-type": upstreamContentType || "application/octet-stream",
    };
    if (contentDisposition) {
      headers["content-disposition"] = contentDisposition;
    }
    return new NextResponse(buffer, {
      status: upstream.status,
      headers,
    });
  }

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
