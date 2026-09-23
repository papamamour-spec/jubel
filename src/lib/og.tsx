import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

// Aperçu 1200x630 affiché par WhatsApp, Facebook et X quand un lien est partagé.
export const OG_SIZE = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "assets", "fonts");
const font = (file: string) => fs.readFileSync(path.join(fontDir, file));

export function ogImage({
  kicker,
  dateLabel,
  title,
  subtitle,
}: {
  kicker: string;
  dateLabel: string;
  title: string;
  subtitle?: string;
}) {
  const titleSize = title.length > 90 ? 50 : title.length > 60 ? 58 : 66;
  const sub = subtitle && subtitle.length > 170 ? `${subtitle.slice(0, 167).trimEnd()}…` : subtitle;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAFAF7",
          color: "#1A1A1A",
          fontFamily: "Inter",
          padding: 28,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1.5px solid #1A1A1A",
            padding: "52px 64px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 32, fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>
            <span style={{ color: "#7A6120", fontWeight: 600 }}>{kicker}</span>
            <span style={{ color: "#555555" }}>{dateLabel}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Playfair", fontSize: titleSize, lineHeight: 1.12 }}>{title}</div>
            <div style={{ width: 110, height: 4, background: "#C9A84C", marginTop: 30 }} />
            {sub ? (
              <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 28, lineHeight: 1.4, color: "#555555", marginTop: 26 }}>
                {sub}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2 }}>
            <span style={{ fontFamily: "Playfair", fontSize: 26, letterSpacing: 0 }}>Institut Jubël</span>
            <span style={{ color: "#7A6120" }}>jubel.sn</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Playfair", data: font("playfair-display-latin-400-normal.woff"), weight: 400, style: "normal" },
        { name: "Playfair", data: font("playfair-display-latin-400-italic.woff"), weight: 400, style: "italic" },
        { name: "Inter", data: font("inter-latin-400-normal.woff"), weight: 400, style: "normal" },
        { name: "Inter", data: font("inter-latin-600-normal.woff"), weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    }
  );
}
