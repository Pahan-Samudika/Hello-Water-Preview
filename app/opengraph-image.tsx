import { ImageResponse } from "next/og";

import { absoluteUrl } from "@/lib/seo";

export const alt = "Hello Water Filtration logo on black background";
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
          background: "#030712",
          color: "#f8fafc",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 80,
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#050816",
              border: "1px solid rgba(87, 239, 255, 0.28)",
              borderRadius: 44,
              boxShadow: "0 30px 90px rgba(69, 160, 209, 0.28)",
              display: "flex",
              height: 220,
              justifyContent: "center",
              width: 220,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image is not supported inside ImageResponse. */}
            <img
              alt=""
              height="164"
              src={absoluteUrl("/icon.svg")}
              style={{ objectFit: "contain" }}
              width="96"
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
