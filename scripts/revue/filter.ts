import crypto from "crypto";
import { RawArticle } from "../../src/lib/revue-du-jour/types";
import { MAX_ARTICLES_FOR_SYNTHESIS } from "../../src/lib/revue-du-jour/feeds";

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterArticles(articles: RawArticle[]): RawArticle[] {
  const seen = new Set<string>();
  const deduped: RawArticle[] = [];

  for (const article of articles) {
    const hash = crypto
      .createHash("md5")
      .update(normalizeTitle(article.title))
      .digest("hex")
      .slice(0, 10);

    if (seen.has(hash)) continue;
    seen.add(hash);
    deduped.push(article);
  }

  const sorted = deduped.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const result = sorted.slice(0, MAX_ARTICLES_FOR_SYNTHESIS);

  console.log(
    `[filter] ${articles.length} -> ${deduped.length} (dedup) -> ${result.length} (capped)`
  );

  return result;
}
