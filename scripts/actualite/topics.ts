import fs from "fs";
import path from "path";
import { ClassifiedArticle } from "../../src/lib/revue-du-jour/types";
import { createClient, extractJsonArray, extractText, MODELS } from "../lib/anthropic";
import { Topic, topicSchema } from "../lib/types";
import { fillDateTokens } from "../lib/prompts";

const TOPICS_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "actualite.topics.md"),
  "utf-8"
);

export async function identifyTopics(
  articles: ClassifiedArticle[],
  alreadyCovered: string[],
  date: string
): Promise<Topic[]> {
  if (articles.length === 0) return [];
  const client = createClient(60000);
  const knownIds = new Set(articles.map((a) => a.id));
  const prompt = fillDateTokens(TOPICS_PROMPT, date);

  const input = {
    dejaTraites: alreadyCovered,
    articles: articles.map((a) => ({
      id: a.id,
      source: a.source,
      title: a.title,
      summary: a.summary.slice(0, 300),
      category: a.category,
      salience: a.salience,
    })),
  };

  const response = await client.messages.create({
    model: MODELS.fast,
    max_tokens: 2048,
    system: prompt,
    messages: [{ role: "user", content: JSON.stringify(input) }],
  });

  let raw: unknown[];
  try {
    raw = extractJsonArray<unknown>(extractText(response));
  } catch (err) {
    console.error(`[topics] Unparseable response: ${err}`);
    return [];
  }

  const topics: Topic[] = [];
  for (const candidate of raw) {
    const parsed = topicSchema.safeParse(candidate);
    if (!parsed.success) {
      console.warn(`[topics] Rejected topic: ${parsed.error.issues[0]?.message}`);
      continue;
    }
    const ids = parsed.data.articleIds.filter((id) => knownIds.has(id));
    if (ids.length < 2) continue;
    topics.push({ ...parsed.data, articleIds: ids });
  }

  return topics
    .filter((t) => t.importance >= 3)
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 5);
}
