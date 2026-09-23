import fs from "fs";
import path from "path";
import { ClassifiedArticle } from "../../src/lib/revue-du-jour/types";
import { createClient, extractText, MODELS, withRetry } from "../lib/anthropic";
import { finalizeArticle } from "../lib/frontmatter";
import { slugify } from "../lib/text";
import { Topic } from "../lib/types";

const SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "actualite.system.md"),
  "utf-8"
);

export async function generateArticle(
  topic: Topic,
  articles: ClassifiedArticle[],
  date: string,
  runId: string
): Promise<{ slug: string; mdx: string; title: string }> {
  const topicArticles = articles.filter((a) => topic.articleIds.includes(a.id));
  if (topicArticles.length < 2) {
    throw new Error(`Topic "${topic.topic}" has fewer than 2 source articles`);
  }

  const client = createClient(120000);
  const prompt = SYSTEM_PROMPT.replaceAll("{{DATE_ISO}}", date);
  const sources = Array.from(new Set(topicArticles.map((a) => a.source)));

  const input = {
    topic: topic.topic,
    category: topic.category,
    articles: topicArticles.map((a) => ({
      source: a.source,
      title: a.title,
      url: a.url,
      summary: a.summary,
    })),
  };

  const mdx = await withRetry(`article:${slugify(topic.topic, 30)}`, 2, async () => {
    const response = await client.messages.create({
      model: MODELS.editorial,
      max_tokens: 2048,
      system: prompt,
      messages: [{ role: "user", content: JSON.stringify(input) }],
    });
    return finalizeArticle(
      extractText(response),
      { date, sources },
      { model: MODELS.editorial, runId }
    );
  });

  const titleMatch = mdx.match(/^title: "(.*)"$/m);
  return {
    slug: `${date}-${slugify(topic.topic)}`,
    mdx,
    title: titleMatch ? JSON.parse(`"${titleMatch[1]}"`) : topic.topic,
  };
}
