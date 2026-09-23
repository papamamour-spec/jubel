import { Illustration } from "@/lib/actualite/types";

interface RawMeta {
  [key: string]: unknown;
  _internal?: { generatedAt?: unknown };
}

export function readIllustration(data: RawMeta): Illustration | undefined {
  const src = typeof data.illustration === "string" ? data.illustration : "";
  if (!src.startsWith("/illustrations/")) return undefined;
  const legende = String(data.legende ?? "").trim();
  if (!legende) return undefined;
  return {
    src,
    alt: String(data.illustrationAlt ?? legende),
    legende,
  };
}

export function readPublishedAt(data: RawMeta, isoDate: string): string {
  const generated = data._internal?.generatedAt;
  if (typeof generated === "string" && !isNaN(new Date(generated).getTime())) {
    return new Date(generated).toISOString();
  }
  return `${isoDate}T06:30:00.000Z`;
}
