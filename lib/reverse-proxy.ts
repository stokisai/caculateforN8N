import type { NextRequest } from "next/server";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const replaceUpstreamBase = (content: string, proxyBasePath: string, upstreamBase: string) => {
  const normalizedUpstream = upstreamBase.replace(/\/$/, "");
  const upstreamPattern = new RegExp(escapeRegExp(normalizedUpstream), "g");

  return content.replace(upstreamPattern, proxyBasePath);
};

const rewriteHtml = (html: string, proxyBasePath: string, upstreamBase: string) => {
  let rewritten = replaceUpstreamBase(html, proxyBasePath, upstreamBase);

  if (!/<base\s/i.test(rewritten)) {
    rewritten = rewritten.replace(/<head([^>]*)>/i, `<head$1>\n<base href="${proxyBasePath}/">`);
  }

  rewritten = rewritten.replace(
    /(\b(?:href|src|action)=['"])\/(?!\/)/gi,
    `$1${proxyBasePath}/`
  );

  return rewritten;
};

const rewriteLocation = (location: string, proxyBasePath: string, upstreamBase: string) => {
  try {
    const upstreamUrl = new URL(upstreamBase);
    const resolved = new URL(location, upstreamUrl);
    if (resolved.origin !== upstreamUrl.origin) {
      return location;
    }
    const path = `${resolved.pathname}${resolved.search}${resolved.hash}`;
    return `${proxyBasePath}${path.startsWith("/") ? path : `/${path}`}`;
  } catch {
    return location;
  }
};

export async function proxyRequest(
  request: NextRequest,
  proxyBasePath: string,
  upstreamBase: string
) {
  const incomingUrl = request.nextUrl;
  const strippedPath = incomingUrl.pathname.startsWith(proxyBasePath)
    ? incomingUrl.pathname.slice(proxyBasePath.length) || "/"
    : incomingUrl.pathname;

  const targetUrl = new URL(strippedPath, upstreamBase);
  targetUrl.search = incomingUrl.search;

  const headers = new Headers(request.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));
  headers.set("accept-encoding", "identity");

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  const location = upstreamResponse.headers.get("location");
  if (location) {
    responseHeaders.set("location", rewriteLocation(location, proxyBasePath, upstreamBase));
  }

  const contentType = upstreamResponse.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    const html = await upstreamResponse.text();
    const rewritten = rewriteHtml(html, proxyBasePath, upstreamBase);
    return new Response(rewritten, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  }

  if (contentType.includes("javascript") || contentType.includes("text/css")) {
    const text = await upstreamResponse.text();
    const rewritten = replaceUpstreamBase(text, proxyBasePath, upstreamBase);
    return new Response(rewritten, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
