import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { RevueEdition, RevueFrontmatter } from "./types";

const contentDir = path.join(process.cwd(), "content", "revue-du-jour");

export function listEditions(): RevueEdition[] {
  if (!fs.existsSync(contentDir)) return [];

  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      return { meta: data as RevueFrontmatter, content, slug };
    })
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getEdition(date: string): RevueEdition | undefined {
  const filePath = path.join(contentDir, `${date}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: data as RevueFrontmatter, content, slug: date };
}

export function getLatestEdition(): RevueEdition | undefined {
  const editions = listEditions();
  return editions.length > 0 ? editions[0] : undefined;
}
