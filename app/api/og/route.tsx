/**
 * Open Graph / Twitter card image — fresh URL path so social-crawler
 * previews actually update when the brand changes.
 *
 * Why this isn't `app/opengraph-image.tsx`:
 *   - That file-convention route gets its PNG pinned in Vercel's edge
 *     CDN with a path-only cache key. Query-string busters are
 *     normalized away, route segment config (`force-dynamic`, etc.) is
 *     not honored for the cache layer, and `vercel cache purge` has no
 *     way to target a single path. The old "GameChanger" PNG outlived
 *     three successful deploys despite the source code being updated.
 *   - Switching to `/api/og` gives us a brand-new cache key the bots
 *     have never seen, and lets us set explicit edge-cache-killing
 *     headers (CDN-Cache-Control: no-store) so future brand updates
 *     can't get pinned the same way.
 *
 * `metadata.openGraph.images` in `app/layout.tsx` points crawlers here.
 */
import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at top, #1f0f3a 0%, #0b0b10 60%, #08080c 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        {/* Brand mark — same iso cube as the favicon, scaled up. */}
        <svg
          width="190"
          height="190"
          viewBox="0 0 64 64"
          style={{ marginBottom: 36 }}
        >
          <path d="M32 12 L52 22 L32 32 L12 22 Z" fill="#c084fc" />
          <path d="M12 22 L32 32 L32 52 L12 42 Z" fill="#7c3aed" />
          <path d="M52 22 L32 32 L32 52 L52 42 Z" fill="#a855f7" />
        </svg>

        {/* Solid white wordmark — the iso cube above carries the color. */}
        <div
          style={{
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            display: "flex",
          }}
        >
          Dezignxo
        </div>

        {/* Tagline — mirrors the home metadata's four-category positioning. */}
        <div
          style={{
            fontSize: 32,
            color: "#a8a8bd",
            marginTop: 24,
            textAlign: "center",
            display: "flex",
          }}
        >
          Premium 3D models, Lottie animations &amp; SVG icons.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Hard-block every cache layer Vercel exposes. The whole reason
        // this route exists is that the old file-convention OG image
        // got pinned in the edge cache and survived deploys. Don't let
        // it happen again.
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    }
  );
}
