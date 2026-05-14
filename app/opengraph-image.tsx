import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/seo";

export const alt = "Hello Water Filtration";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f8fbff",
          color: "#0f172a",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 72,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: 900,
          }}
        >
          <div style={{ color: "#0284c7", fontSize: 30, fontWeight: 700 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02 }}>
            Clean, safer water from every tap.
          </div>
          <div style={{ color: "#475569", fontSize: 32, lineHeight: 1.35 }}>
            Whole-home filtration, reverse osmosis, UV purification, and
            replacement cartridges for Australian homes.
          </div>
        </div>
      </div>
    ),
    size
  );
}
