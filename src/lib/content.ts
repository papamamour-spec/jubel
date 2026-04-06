import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface ContentMeta {
  title: string;
  date: string;
  slug: string;
  description?: string;
  rubriques?: string[];
  numero?: number;
  [key: string]: unknown;
}

export interface ContentItem {
  meta: ContentMeta;
  content: string;
}

function getContentFromDir(dir: string): ContentItem[] {
  const fullDir = path.join(contentDir, dir);
  if (!fs.existsSync(fullDir)) return [];

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      return {
        meta: { ...data, slug } as ContentMeta,
        content,
      };
    })
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
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
