import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { ClassifiedArticle } from "../../src/lib/revue-du-jour/types";

const SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "actualite.system.md"),
  "utf-8"
);

interface Topic {
  topic: string;
  category: string;
  articleIds: string[];
  importance: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function generateArticle(
  topic: Topic,
  articles: ClassifiedArticle[],
  date: string,
  runId: string
): Promise<{ slug: string; mdx: string } | null> {
  const client = new Anthropic({ timeout: 120000 });

  const topicArticles = articles.filter((a) =>
    topic.articleIds.includes(a.id)
  );

  if (topicArticles.length < 2) return null;

  const prompt = SYSTEM_PROMPT.replace("{{DATE_ISO}}", date);

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

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: prompt,
      messages: [{ role: "user", content: JSON.stringify(input) }],
    });

    let mdx =
      response.content[0].type === "text" ? response.content[0].text : "";

    const internalBlock = [
      "_internal:",
      `  model: "claude-sonnet-4-6"`,
      `  generatedAt: "${new Date().toISOString()}"`,
      `  runId: "${runId}"`,
    ].join("\n");

    mdx = mdx.replace(/^---\n([\s\S]*?)\n---/, `---\n$1\n${internalBlock}\n---`);

    const slug = `${date}-${slugify(topic.topic)}`;
    return { slug, mdx };
  } catch (err) {
    console.error(`[article] Failed for "${topic.topic}": ${err}`);
    return null;
  }
}
