import { get } from "@vercel/blob";

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

export default async function handler(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  const pathname = new URL(request.url).searchParams.get("path") || "";
  if (!MEDIA_PATH_PATTERN.test(pathname)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const result = await get(`${BLOB_PREFIX}${pathname}`, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") || undefined,
    });

    if (!result) {
      return new Response("Not found", { status: 404 });
    }

    const headers = responseHeaders(result.blob, pathname);
    if (result.statusCode === 304) {
      return new Response(null, { status: 304, headers });
    }

    return new Response(request.method === "HEAD" ? null : result.stream, {
      status: 200,
      headers,
    });
  } catch {
    return new Response("Media unavailable", { status: 503 });
  }
}
