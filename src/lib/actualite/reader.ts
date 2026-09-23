import fs from "fs";
import path from "path";
import { parseFrontMatter } from "@/lib/frontmatter";
import { readingTimeMinutes, toISODate } from "@/lib/dates";
import { readIllustration, readPublishedAt } from "@/lib/meta";
import { Article, ArticleFrontmatter, CategoryId, isCategoryId } from "./types";

const contentDir = path.join(process.cwd(), "content", "actualite");

function load(file: string): Article | null {
  const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
  const { data, content } = parseFrontMatter(raw);
  const slug = file.replace(/\.mdx$/, "");
  const category = String(data.category ?? "");
  if (!isCategoryId(category) || !data.title) return null;

  const date = toISODate(data.date ?? slug.slice(0, 10));
  const meta: ArticleFrontmatter = {
    date,
    publishedAt: readPublishedAt(data, date),
    title: String(data.title),
    chapeau: String(data.chapeau ?? ""),
    category,
    sources: Array.isArray(data.sources) ? data.sources.map(String) : [],
    readingTime: readingTimeMinutes(content),
    illustration: readIllustration(data),
  };
  return { meta, content, slug };
}

export function listArticles(limit?: number): Article[] {
  if (!fs.existsSync(contentDir)) return [];

  const articles = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map(load)
    .filter((a): a is Article => a !== null)
    .sort((a, b) => b.meta.publishedAt.localeCompare(a.meta.publishedAt));

  return limit ? articles.slice(0, limit) : articles;
}

export function getArticle(slug: string): Article | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  return load(`${slug}.mdx`) ?? undefined;
}

export function listArticlesByCategory(
  category: CategoryId,
  limit?: number
): Article[] {
  return listArticles()
    .filter((a) => a.meta.category === category)
    .slice(0, limit ?? 100);
}

export function getLatestArticles(count: number): Article[] {
  return listArticles(count);
}
