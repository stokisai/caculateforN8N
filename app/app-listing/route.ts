import type { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/reverse-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROXY_BASE_PATH = "/app-listing";

const getUpstreamBase = () => process.env.APP_LISTING_PROXY_URL;

const handler = async (request: NextRequest) => {
  const upstreamBase = getUpstreamBase();
  if (!upstreamBase) {
    return new Response("APP_LISTING_PROXY_URL is not set", { status: 500 });
  }
  return proxyRequest(request, PROXY_BASE_PATH, upstreamBase);
};

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS, handler as HEAD };
