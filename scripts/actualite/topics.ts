import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { ClassifiedArticle } from "../../src/lib/revue-du-jour/types";

const TOPICS_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "actualite.topics.md"),
  "utf-8"
);

interface Topic {
  topic: string;
  category: string;
  articleIds: string[];
  importance: number;
}

export async function identifyTopics(
  articles: ClassifiedArticle[]
): Promise<Topic[]> {
  const client = new Anthropic({ timeout: 60000 });

  const input = articles.map((a) => ({
    id: a.id,
    source: a.source,
    title: a.title,
    summary: a.summary.slice(0, 300),
    category: a.category,
    salience: a.salience,
  }));

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: TOPICS_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(input) }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const topics: Topic[] = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return topics
      .filter((t) => t.importance >= 3)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);
  } catch {
    console.error("[topics] Failed to parse response");
    return [];
  }
}
