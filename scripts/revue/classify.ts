import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import {
  RawArticle,
  ClassifiedArticle,
} from "../../src/lib/revue-du-jour/types";

const CLASSIFY_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "revue.classify.md"),
  "utf-8"
);

export async function classifyArticles(
  articles: RawArticle[]
): Promise<ClassifiedArticle[]> {
  const client = new Anthropic();

  const input = articles.map((a) => ({
    id: a.id,
    source: a.source,
    title: a.title,
    summary: a.summary.slice(0, 200),
  }));

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: CLASSIFY_PROMPT,
    messages: [
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  let classifications: { id: string; category: string; salience: number }[];
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    classifications = JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch {
    console.error("[classify] Failed to parse response, using defaults");
    classifications = articles.map((a) => ({
      id: a.id,
      category: "social",
      salience: 2,
    }));
  }

  const classMap = new Map(classifications.map((c) => [c.id, c]));

  const classified: ClassifiedArticle[] = articles
    .map((a) => {
      const c = classMap.get(a.id);
      return {
        ...a,
        category: c?.category || "social",
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
