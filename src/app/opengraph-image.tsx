import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#FAFAF7",
          color: "#1A1A1A",
          fontFamily: "Georgia, serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#7A6120",
            marginBottom: 40,
          }}
        >
          Institut Jubël
        </div>
        <div
          style={{
            fontSize: 56,
            lineHeight: 1.25,
            textAlign: "center",
            maxWidth: 1000,
          }}
        >
          Nous ne cherchons pas à gouverner le Sénégal.
        </div>
        <div
          style={{
            fontSize: 56,
            lineHeight: 1.25,
            textAlign: "center",
            maxWidth: 1000,
            marginTop: 12,
          }}
        >
          Nous cherchons à le comprendre.
        </div>
        <div
          style={{
            width: 120,
            height: 3,
            background: "#C9A84C",
            marginTop: 48,
          }}
        />
        <div style={{ fontSize: 24, color: "#4A4A4A", marginTop: 32 }}>
          jubel.sn
        </div>
      </div>
    ),
    { ...size }
  );
}
