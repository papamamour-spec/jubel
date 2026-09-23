import fs from "fs";
import path from "path";
import { ClassifiedArticle } from "../../src/lib/revue-du-jour/types";
import { createClient, extractText, MODELS, withRetry } from "../lib/anthropic";
import { finalizeRevue } from "../lib/frontmatter";

const SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "revue.system.md"),
  "utf-8"
);

export async function synthesize(
  articles: ClassifiedArticle[],
  date: string,
  runId: string,
  sourcesCount: number
): Promise<string> {
  if (articles.length === 0) throw new Error("No articles to synthesize");
  const client = createClient(120000);
  const prompt = SYSTEM_PROMPT.replaceAll("{{DATE_ISO}}", date);

  const input = articles.map((a) => ({
    id: a.id,
    source: a.source,
    title: a.title,
    url: a.url,
    summary: a.summary,
    category: a.category,
    salience: a.salience,
    publishedAt: a.publishedAt,
  }));

  return withRetry("synthesize", 3, async () => {
    const response = await client.messages.create({
      model: MODELS.editorial,
      max_tokens: 4096,
      system: prompt,
      messages: [{ role: "user", content: JSON.stringify(input) }],
    });
    return finalizeRevue(
      extractText(response),
      { date, sourcesCount },
      { model: MODELS.editorial, runId }
    );
  });
}
