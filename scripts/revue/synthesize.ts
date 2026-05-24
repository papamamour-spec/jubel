import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { ClassifiedArticle } from "../../src/lib/revue-du-jour/types";

const SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "prompts", "revue.system.md"),
  "utf-8"
);

export async function synthesize(
  articles: ClassifiedArticle[],
  date: string,
  runId: string
): Promise<string> {
  const client = new Anthropic({ timeout: 120000 });

  const prompt = SYSTEM_PROMPT.replace("{{DATE_ISO}}", date);

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

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: prompt,
        messages: [
          {
            role: "user",
            content: JSON.stringify(input),
          },
        ],
      });

      let mdx =
        response.content[0].type === "text" ? response.content[0].text : "";

      mdx = injectInternalMeta(mdx, runId);

      console.log(`[synthesize] Success on attempt ${attempt + 1}`);
      return mdx;
    } catch (err) {
      lastError = err;
      console.error(
        `[synthesize] Attempt ${attempt + 1} failed: ${err}`
      );
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 10000));
      }
    }
  }

  throw new Error(`[synthesize] All attempts failed: ${lastError}`);
}

function injectInternalMeta(mdx: string, runId: string): string {
  const frontmatterMatch = mdx.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return mdx;

  const internalBlock = [
    "_internal:",
    `  model: "claude-sonnet-4-6"`,
    `  generatedAt: "${new Date().toISOString()}"`,
    `  runId: "${runId}"`,
  ].join("\n");

  return mdx.replace(
    /^---\n([\s\S]*?)\n---/,
    `---\n$1\n${internalBlock}\n---`
  );
}
