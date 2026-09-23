import matter from "gray-matter";
import { z } from "zod";
import { CATEGORY_IDS } from "../../src/lib/actualite/types";
import { sanitizeMarkdown, stripCodeFences, wordCount } from "./text";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const articleSchema = z.object({
  date: isoDate,
  title: z.string().min(10).max(160),
  chapeau: z.string().min(10).max(300),
  category: z.enum(CATEGORY_IDS as [string, ...string[]]),
  sources: z.array(z.string().min(1)).min(1),
  readingTime: z.number().int().positive(),
});

export const revueSchema = z.object({
  date: isoDate,
  title: z.string().min(5).max(160),
  chapeau: z.string().min(10).max(300),
  categories: z.array(z.string()).default([]),
  sourcesCount: z.number().int().nonnegative(),
  itemsCount: z.number().int().nonnegative(),
  readingTime: z.number().int().positive(),
});

export interface Internal {
  model: string;
  runId: string;
}

interface Overrides {
  date: string;
  sourcesCount?: number;
  sources?: string[];
}

export interface IllustrationFields {
  illustration: string;
  illustrationAlt: string;
  legende: string;
}

export interface Finalized<T> {
  mdx: string;
  data: T;
  body: string;
}

const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
  "août", "septembre", "octobre", "novembre", "décembre",
];

function readingTime(body: string): number {
  return Math.max(1, Math.ceil(wordCount(body) / 200));
}

function countH3(body: string): number {
  return (body.match(/^###\s/gm) || []).length;
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function serialize(data: Record<string, unknown>, internal: Internal): string {
  const lines: string[] = ["---"];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${yamlString(String(item))}`);
    } else if (typeof value === "number") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${yamlString(String(value))}`);
    }
  }
  lines.push("_internal:");
  lines.push(`  model: ${yamlString(internal.model)}`);
  lines.push(`  generatedAt: ${yamlString(new Date().toISOString())}`);
  lines.push(`  runId: ${yamlString(internal.runId)}`);
  lines.push("---");
  return lines.join("\n");
}

// A full date whose month matches the run month but whose year differs is,
// in practice, always the model misdating a current event.
function rejectSuspiciousYears(body: string, runDate: string): void {
  const [year, month] = runDate.split("-").map(Number);
  const monthName = MONTHS[month - 1];
  const re = new RegExp(`\\b\\d{1,2}(?:er)?\\s+${monthName}\\s+(\\d{4})\\b`, "gi");
  for (const match of body.matchAll(re)) {
    if (Number(match[1]) !== year) {
      throw new Error(`Date suspecte dans le corps : « ${match[0]} » (année attendue ${year})`);
    }
  }
}

function requireSections(body: string, headings: string[]): void {
  const missing = headings.filter((h) => !body.includes(h));
  if (missing.length) {
    throw new Error(`Missing sections: ${missing.join(", ")}`);
  }
}

export function finalizeArticle(
  raw: string,
  overrides: Overrides,
  internal: Internal
): Finalized<z.infer<typeof articleSchema>> {
  const text = stripCodeFences(raw);
  const { data, content } = matter(text);
  const body = sanitizeMarkdown(content).trim();

  const candidate = {
    date: overrides.date,
    title: String(data.title ?? ""),
    chapeau: String(data.chapeau ?? ""),
    category: String(data.category ?? ""),
    sources:
      overrides.sources ??
      (Array.isArray(data.sources) ? data.sources.map(String) : []),
    readingTime: readingTime(body),
  };

  const parsed = articleSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new Error(`Invalid article front matter: ${parsed.error.message}`);
  }
  requireSections(body, ["## Le fait", "## Le contexte", "## Les angles", "## La question Jubël"]);
  rejectSuspiciousYears(body, overrides.date);

  return { mdx: `${serialize(parsed.data, internal)}\n\n${body}\n`, data: parsed.data, body };
}

export function finalizeRevue(
  raw: string,
  overrides: Overrides,
  internal: Internal
): Finalized<z.infer<typeof revueSchema>> {
  const text = stripCodeFences(raw);
  const { data, content } = matter(text);
  const body = sanitizeMarkdown(content).trim();

  const candidate = {
    date: overrides.date,
    title: String(data.title ?? ""),
    chapeau: String(data.chapeau ?? ""),
    categories: Array.isArray(data.categories) ? data.categories.map(String) : [],
    sourcesCount: overrides.sourcesCount ?? Number(data.sourcesCount) ?? 0,
    itemsCount: countH3(body),
    readingTime: readingTime(body),
  };

  const parsed = revueSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new Error(`Invalid revue front matter: ${parsed.error.message}`);
  }
  requireSections(body, ["## L'essentiel du jour", "## Ce qui se dit", "## À surveiller"]);
  rejectSuspiciousYears(body, overrides.date);

  return { mdx: `${serialize(parsed.data, internal)}\n\n${body}\n`, data: parsed.data, body };
}

export function withIllustration(mdx: string, fields: IllustrationFields): string {
  const block = [
    `illustration: ${yamlString(fields.illustration)}`,
    `illustrationAlt: ${yamlString(fields.illustrationAlt)}`,
    `legende: ${yamlString(fields.legende)}`,
  ].join("\n");
  if (!mdx.includes("\n_internal:\n")) {
    throw new Error("Cannot inject illustration: _internal block missing");
  }
  return mdx.replace("\n_internal:\n", `\n${block}\n_internal:\n`);
}
