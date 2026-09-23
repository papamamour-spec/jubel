import fs from "fs";
import path from "path";
import { parseFrontMatter } from "@/lib/frontmatter";
import { readingTimeMinutes, toISODate } from "@/lib/dates";
import { RevueEdition, RevueFrontmatter } from "./types";

const contentDir = path.join(process.cwd(), "content", "revue-du-jour");

function load(file: string): RevueEdition | null {
  const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
  const { data, content } = parseFrontMatter(raw);
  const slug = file.replace(/\.mdx$/, "");
  if (!data.title) return null;

  const meta: RevueFrontmatter = {
    date: toISODate(data.date ?? slug),
    title: String(data.title),
    chapeau: String(data.chapeau ?? ""),
    categories: Array.isArray(data.categories) ? data.categories.map(String) : [],
    sourcesCount: Number(data.sourcesCount) || 0,
    itemsCount: Number(data.itemsCount) || 0,
    readingTime: readingTimeMinutes(content),
  };
  return { meta, content, slug };
}

export function listEditions(): RevueEdition[] {
  if (!fs.existsSync(contentDir)) return [];

  return fs
    .readdirSync(contentDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.mdx$/.test(f))
    .map(load)
    .filter((e): e is RevueEdition => e !== null)
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getEdition(date: string): RevueEdition | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  const filePath = path.join(contentDir, `${date}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  return load(`${date}.mdx`) ?? undefined;
}

export function getLatestEdition(): RevueEdition | undefined {
  return listEditions()[0];
}
