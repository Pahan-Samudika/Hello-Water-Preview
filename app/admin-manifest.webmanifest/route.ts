import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/seo";

export async function GET() {
  const manifestData = {
    name: `${siteConfig.name} Admin`,
    short_name: `${siteConfig.shortName} Admin`,
    description: "Hello Water Filtration Management Dashboard",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    background_color: "#020617", // Slate-950 dark background for admin dashboard
    theme_color: "#0ea5e9",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };

  return new NextResponse(JSON.stringify(manifestData), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
