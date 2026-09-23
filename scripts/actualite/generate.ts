import fs from "fs";
import path from "path";
import { ClassifiedArticle } from "../../src/lib/revue-du-jour/types";
import { createClient, extractText, MODELS, withRetry } from "../lib/anthropic";
import { finalizeArticle, withIllustration } from "../lib/frontmatter";
import { fillDateTokens } from "../lib/prompts";
import { slugify } from "../lib/text";
import { Topic } from "../lib/types";
import { createCartoon } from "../dessin";

const SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "actualite.system.md"),
  "utf-8"
);

export interface GeneratedArticle {
  slug: string;
  mdx: string;
  title: string;
  cartoon: "image" | "repli" | "absent";
}

export async function generateArticle(
  topic: Topic,
  articles: ClassifiedArticle[],
  date: string,
  runId: string
): Promise<GeneratedArticle> {
  const topicArticles = articles.filter((a) => topic.articleIds.includes(a.id));
  if (topicArticles.length < 2) {
    throw new Error(`Topic "${topic.topic}" has fewer than 2 source articles`);
  }

  const client = createClient(120000);
  const prompt = fillDateTokens(SYSTEM_PROMPT, date);
  const sources = Array.from(new Set(topicArticles.map((a) => a.source)));
  const slug = `${date}-${slugify(topic.topic)}`;

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

  const article = await withRetry(`article:${slugify(topic.topic, 30)}`, 2, async () => {
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

  let mdx = article.mdx;
  let cartoon: GeneratedArticle["cartoon"] = "absent";
  try {
    const result = await createCartoon({
      slug,
      date,
      title: article.data.title,
      chapeau: article.data.chapeau,
      category: article.data.category,
      body: article.body,
    });
    mdx = withIllustration(mdx, result);
    cartoon = result.status;
    if (result.motifs.length) {
      console.log(`[dessin] ${slug} (${result.status}) : ${result.motifs.join(" | ")}`);
    }
  } catch (err) {
    console.error(`[dessin] ${slug} sans dessin : ${err}`);
  }

  return { slug, mdx, title: article.data.title, cartoon };
}
