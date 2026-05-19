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
const WINDOW_HOURS = 48;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function fetchFeed(
  source: FeedSource
): Promise<{ articles: RawArticle[]; success: boolean }> {
  try {
    const feed = await parser.parseURL(source.url);
    const cutoff = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000);

    const articles: RawArticle[] = (feed.items || [])
      .filter((item) => {
        if (!item.pubDate) return true;
        return new Date(item.pubDate) >= cutoff;
      })
      .map((item) => ({
        id: crypto
          .createHash("md5")
          .update(`${source.name}:${item.title || ""}`)
          .digest("hex")
          .slice(0, 12),
        source: source.name,
        title: (item.title || "").trim(),
        url: item.link || "",
        summary: stripHtml(
          item.contentSnippet || item.content || item.title || ""
        ).slice(0, 500),
        publishedAt: item.pubDate || new Date().toISOString(),
      }))
      .filter((a) => a.title.length > 10);

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
  failedSources: string[];
}> {
  const results = await Promise.all(FEEDS.map(fetchFeed));

  const articles = results.flatMap((r) => r.articles);
  const successCount = results.filter((r) => r.success).length;
  const failedSources = FEEDS.filter((_, i) => !results[i].success).map(
    (f) => f.name
  );

  console.log(
    `[collect] Total: ${articles.length} articles from ${successCount}/${FEEDS.length} sources`
  );

  return { articles, successCount, failedSources };
}
