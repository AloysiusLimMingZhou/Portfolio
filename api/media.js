import { get } from "@vercel/blob";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const MEDIA_PATH_PATTERN = /^(?:portrait\.png|assets\/favicon-tech-space\.png|assets\/(?:career|certificates|events)\/[a-z0-9][a-z0-9-]*\.(?:png|webp))$/;
const BLOB_PREFIX = "portfolio/";
const CACHE_CONTROL = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

function responseHeaders(blob, pathname) {
  const filename = pathname.slice(pathname.lastIndexOf("/") + 1);
  return {
    "Cache-Control": CACHE_CONTROL,
    "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
    "Content-Type": blob.contentType || "application/octet-stream",
    "Cross-Origin-Resource-Policy": "same-origin",
    ETag: blob.etag,
    "X-Content-Type-Options": "nosniff",
  };
}

function sendText(response, status, message, extraHeaders = {}) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  });
  response.end(message);
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendText(response, 405, "Method not allowed", { Allow: "GET, HEAD" });
    return;
  }

  const pathname = new URL(request.url, "http://localhost").searchParams.get("path") || "";
  if (!MEDIA_PATH_PATTERN.test(pathname)) {
    sendText(response, 404, "Not found");
    return;
  }

  try {
    const result = await get(`${BLOB_PREFIX}${pathname}`, {
      access: "private",
      ifNoneMatch: request.headers["if-none-match"] || undefined,
    });

    if (!result) {
      sendText(response, 404, "Not found");
      return;
    }

    const headers = responseHeaders(result.blob, pathname);
    if (result.statusCode === 304) {
      response.writeHead(304, headers);
      response.end();
      return;
    }

    response.writeHead(200, headers);
    if (request.method === "HEAD") {
      response.end();
      return;
    }

    await pipeline(Readable.fromWeb(result.stream), response);
  } catch {
    if (response.headersSent) {
      response.destroy();
      return;
    }

    sendText(response, 503, "Media unavailable");
  }
}
