import fs from "fs";
import path from "path";

export const ILLUSTRATIONS_DIR = path.join(process.cwd(), "public", "illustrations");

const STYLE_PREFIX =
  "Dessin de presse satirique à l'encre noire sur fond crème (#FAFAF7), " +
  "trait vif et hachures à la plume, un seul aplat de couleur or (#C9A84C) " +
  "utilisé avec parcimonie, composition claire lisible en une seconde, " +
  "style gravure de presse française des années 1960, personnages " +
  "anonymes et stylisés sans aucune ressemblance avec des personnes " +
  "réelles, aucun texte, aucune lettre, aucun chiffre, aucun logo dans " +
  "l'image. Scène : ";

export interface GeneratedImage {
  buffer: Buffer;
  mediaType: "image/webp" | "image/png";
  extension: "webp" | "png";
}

export function hasImageProvider(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateImage(scene: string): Promise<GeneratedImage> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: STYLE_PREFIX + scene,
      size: "1536x1024",
      quality: "medium",
      output_format: "webp",
      output_compression: 80,
      moderation: "auto",
      n: 1,
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Image API ${res.status}: ${detail.slice(0, 300)}`);
  }

  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image API returned no image");

  return { buffer: Buffer.from(b64, "base64"), mediaType: "image/webp", extension: "webp" };
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(text: string, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = `${line} ${w}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 6);
}

// Typographic stand-in used when no image provider is configured or the
// generated image failed verification: the caption in a speech bubble.
export function fallbackSvg(legende: string): string {
  const lines = wrap(legende, 38);
  const lineHeight = 44;
  const textHeight = lines.length * lineHeight;
  const bubbleTop = 512 - textHeight / 2 - 60;
  const bubbleHeight = textHeight + 120;
  const tspans = lines
    .map(
      (l, i) =>
        `<tspan x="768" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1024" width="1536" height="1024" role="img" aria-label="${escapeXml(legende)}">
  <rect width="1536" height="1024" fill="#FAFAF7"/>
  <rect x="48" y="48" width="1440" height="928" fill="none" stroke="#1A1A1A" stroke-width="3"/>
  <rect x="200" y="${bubbleTop}" width="1136" height="${bubbleHeight}" rx="28" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="4"/>
  <path d="M 640 ${bubbleTop + bubbleHeight} L 600 ${bubbleTop + bubbleHeight + 70} L 700 ${bubbleTop + bubbleHeight}" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="4" stroke-linejoin="round"/>
  <line x1="700" y1="${bubbleTop + bubbleHeight}" x2="640" y2="${bubbleTop + bubbleHeight}" stroke="#FFFFFF" stroke-width="6"/>
  <text x="768" y="${bubbleTop + 88}" font-family="Georgia, 'Playfair Display', serif" font-size="34" font-style="italic" fill="#1A1A1A" text-anchor="middle">${tspans}</text>
  <circle cx="1400" cy="900" r="22" fill="#C9A84C"/>
  <text x="96" y="940" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="#7A6120">LE DESSIN DE JUBËL</text>
</svg>
`;
}

export function saveIllustration(
  slug: string,
  image: GeneratedImage | { svg: string }
): string {
  fs.mkdirSync(ILLUSTRATIONS_DIR, { recursive: true });
  if ("svg" in image) {
    const file = path.join(ILLUSTRATIONS_DIR, `${slug}.svg`);
    fs.writeFileSync(file, image.svg, "utf-8");
    return `/illustrations/${slug}.svg`;
  }
  const file = path.join(ILLUSTRATIONS_DIR, `${slug}.${image.extension}`);
  fs.writeFileSync(file, image.buffer);
  return `/illustrations/${slug}.${image.extension}`;
}
