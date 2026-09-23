import fs from "fs";
import path from "path";
import { ClassifiedArticle } from "../../src/lib/revue-du-jour/types";
import { createClient, extractText, MODELS, withRetry } from "../lib/anthropic";
import { finalizeRevue, withIllustration } from "../lib/frontmatter";
import { fillDateTokens } from "../lib/prompts";
import { createCartoon } from "../dessin";

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
  const prompt = fillDateTokens(SYSTEM_PROMPT, date);

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

  const revue = await withRetry("synthesize", 3, async () => {
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

  try {
    const result = await createCartoon({
      slug: `revue-${date}`,
      date,
      title: revue.data.title,
      chapeau: revue.data.chapeau,
      category: "revue",
      body: revue.body,
    });
    console.log(`[dessin] revue ${date} (${result.status})`);
    return withIllustration(revue.mdx, result);
  } catch (err) {
    console.error(`[dessin] revue ${date} sans dessin : ${err}`);
    return revue.mdx;
  }
}
