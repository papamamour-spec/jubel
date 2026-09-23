import fs from "fs";
import path from "path";
import { parseFrontMatter } from "@/lib/frontmatter";
import { readingTimeMinutes, toISODate } from "@/lib/dates";

const contentDir = path.join(process.cwd(), "content");

export interface ContentMeta {
  title: string;
  date: string;
  slug: string;
  description: string;
  readingTime: number;
  rubriques?: string[];
  numero?: number;
}

export interface ContentItem {
  meta: ContentMeta;
  content: string;
}

function getContentFromDir(dir: string): ContentItem[] {
  const fullDir = path.join(contentDir, dir);
  if (!fs.existsSync(fullDir)) return [];

  return fs
    .readdirSync(fullDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
      const { data, content } = parseFrontMatter(raw);
      const slug = file.replace(/\.mdx$/, "");
      const meta: ContentMeta = {
        title: String(data.title ?? slug),
        date: toISODate(data.date),
        slug,
        description: String(data.description ?? ""),
        readingTime: readingTimeMinutes(content),
        rubriques: Array.isArray(data.rubriques)
          ? data.rubriques.map(String)
          : undefined,
        numero: data.numero !== undefined ? Number(data.numero) : undefined,
      };
      return { meta, content };
    })
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export function getCarnets(): ContentItem[] {
  return getContentFromDir("carnets");
}

export function getCarnet(slug: string): ContentItem | undefined {
  return getCarnets().find((c) => c.meta.slug === slug);
}

export function getRevues(): ContentItem[] {
  return getContentFromDir("revue");
}

export function getRevue(slug: string): ContentItem | undefined {
  return getRevues().find((r) => r.meta.slug === slug);
}
