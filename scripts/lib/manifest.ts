import fs from "fs";
import path from "path";
import { ManifestEntry } from "./types";

// One manifest per day records which source articles each generated
// piece drew on, so later runs can skip stories already covered.
export function manifestPath(contentDir: string, date: string): string {
  return path.join(contentDir, `.${date}.manifest.json`);
}

export function readManifest(contentDir: string, date: string): ManifestEntry[] {
  const file = manifestPath(contentDir, date);
  if (!fs.existsSync(file)) return [];
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(file, "utf-8"));
    return Array.isArray(parsed) ? (parsed as ManifestEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendManifest(
  contentDir: string,
  date: string,
  entry: ManifestEntry
): void {
  const entries = readManifest(contentDir, date);
  entries.push(entry);
  fs.writeFileSync(
    manifestPath(contentDir, date),
    JSON.stringify(entries, null, 2) + "\n",
    "utf-8"
  );
}

export function overlapRatio(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  const shared = a.filter((id) => setB.has(id)).length;
  return shared / Math.min(a.length, b.length);
}
