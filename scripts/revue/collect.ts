import Parser from "rss-parser";
import crypto from "crypto";
import { FEEDS } from "../../src/lib/revue-du-jour/feeds";
import { RawArticle, FeedSource } from "../../src/lib/revue-du-jour/types";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "JubelBot/1.0 (+https://jubel.sn)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

const WINDOW_HOURS = 24;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

async function fetchFeed(
  source: FeedSource
): Promise<{ articles: RawArticle[]; success: boolean }> {
  try {
    const feed = await parser.parseURL(source.url);
    const cutoff = Date.now() - WINDOW_HOURS * 60 * 60 * 1000;

    const articles: RawArticle[] = [];
    for (const item of feed.items ?? []) {
      const published = parseDate(item.isoDate ?? item.pubDate);
      if (!published || published.getTime() < cutoff) continue;
      const title = (item.title ?? "").trim();
      const url = (item.link ?? "").trim();
      if (title.length <= 10 || !/^https?:\/\//.test(url)) continue;

      articles.push({
        id: crypto
          .createHash("md5")
          .update(`${source.name}:${title}`)
          .digest("hex")
          .slice(0, 12),
        source: source.name,
        title,
        url,
        summary: stripHtml(item.contentSnippet ?? item.content ?? title).slice(0, 500),
        publishedAt: published.toISOString(),
      });
    }

    console.log(`[collect] ${source.name}: ${articles.length} articles`);
    return { articles, success: true };
  } catch (err) {
    console.error(`[collect] ${source.name}: FAILED - ${err}`);
    return { articles: [], success: false };
  }
}

export async function collectArticles(): Promise<{
  articles: RawArticle[];
  successCount: number;
  totalSources: number;
  failedSources: string[];
}> {
  const active = FEEDS.filter((f) => f.enabled !== false);
  const results = await Promise.all(active.map(fetchFeed));

  const articles = results.flatMap((r) => r.articles);
  const successCount = results.filter((r) => r.success).length;
  const failedSources = active
    .filter((_, i) => !results[i].success)
    .map((f) => f.name);

  console.log(
    `[collect] Total: ${articles.length} articles from ${successCount}/${active.length} sources`
  );

  return { articles, successCount, totalSources: active.length, failedSources };
}
