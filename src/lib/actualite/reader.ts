import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article, ArticleFrontmatter, CategoryId } from "./types";

const contentDir = path.join(process.cwd(), "content", "actualite");

export function listArticles(limit?: number): Article[] {
  if (!fs.existsSync(contentDir)) return [];

  const articles = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      return { meta: data as ArticleFrontmatter, content, slug };
    })
    .sort((a, b) => b.slug.localeCompare(a.slug));

  return limit ? articles.slice(0, limit) : articles;
}

export function getArticle(slug: string): Article | undefined {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: data as ArticleFrontmatter, content, slug };
}

export function listArticlesByCategory(
  category: CategoryId,
  limit?: number
): Article[] {
  return listArticles()
    .filter((a) => a.meta.category === category)
    .slice(0, limit || 50);
}

export function getLatestArticles(count: number): Article[] {
  return listArticles(count);
}
