import fs from "fs";
import path from "path";
import { z } from "zod";
import { RawArticle, ClassifiedArticle } from "../../src/lib/revue-du-jour/types";
import { createClient, extractJsonArray, extractText, MODELS } from "../lib/anthropic";

const CLASSIFY_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "revue.classify.md"),
  "utf-8"
);

const classificationSchema = z.object({
  id: z.string(),
  category: z.string().default("societe"),
  salience: z.number().int().min(0).max(5).default(2),
});

export async function classifyArticles(
  articles: RawArticle[]
): Promise<ClassifiedArticle[]> {
  if (articles.length === 0) return [];
  const client = createClient(60000);

  const input = articles.map((a) => ({
    id: a.id,
    source: a.source,
    title: a.title,
    summary: a.summary.slice(0, 200),
  }));

  const response = await client.messages.create({
    model: MODELS.fast,
    max_tokens: 4096,
    system: CLASSIFY_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(input) }],
  });

  const classMap = new Map<string, { category: string; salience: number }>();
  try {
    for (const raw of extractJsonArray<unknown>(extractText(response))) {
      const parsed = classificationSchema.safeParse(raw);
      if (parsed.success) classMap.set(parsed.data.id, parsed.data);
    }
  } catch (err) {
    console.error(`[classify] Unparseable response, using defaults: ${err}`);
  }

  const classified: ClassifiedArticle[] = articles
    .map((a) => {
      const c = classMap.get(a.id);
      return {
        ...a,
        category: c?.category ?? "societe",
        salience: c?.salience ?? 2,
      };
    })
    .filter((a) => a.salience > 0)
    .sort((a, b) => b.salience - a.salience);

  console.log(
    `[classify] ${classified.length} articles classified (${articles.length - classified.length} filtered out)`
  );

  return classified;
}
