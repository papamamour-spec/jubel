import crypto from "crypto";
import { RawArticle } from "../../src/lib/revue-du-jour/types";
import { MAX_ARTICLES_FOR_SYNTHESIS } from "../../src/lib/revue-du-jour/feeds";
import { normalizeTitle } from "../lib/text";

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

  const time = (iso: string) => {
    const t = new Date(iso).getTime();
    return isNaN(t) ? 0 : t;
  };

  const result = deduped
    .sort((a, b) => time(b.publishedAt) - time(a.publishedAt))
    .slice(0, MAX_ARTICLES_FOR_SYNTHESIS);

  console.log(
    `[filter] ${articles.length} -> ${deduped.length} (dedup) -> ${result.length} (capped)`
  );

  return result;
}
