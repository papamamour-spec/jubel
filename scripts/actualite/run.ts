import crypto from "crypto";
import fs from "fs";
import path from "path";
import { collectArticles } from "../revue/collect";
import { filterArticles } from "../revue/filter";
import { classifyArticles } from "../revue/classify";
import { identifyTopics } from "./topics";
import { generateArticle } from "./generate";
import { MIN_SOURCES_TO_PUBLISH } from "../../src/lib/revue-du-jour/feeds";

const CONTENT_DIR = path.join(process.cwd(), "content", "actualite");

async function main() {
  const runId = crypto.randomUUID();
  const date = new Date().toISOString().split("T")[0];

  console.log(`\n=== Actualite Jubel, ${date}, Run ${runId} ===\n`);

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  try {
    const { articles, successCount, failedSources } = await collectArticles();

    if (successCount < MIN_SOURCES_TO_PUBLISH) {
      console.error(
        `[run] ${successCount} sources seulement. Echec: ${failedSources.join(", ")}`
      );
      process.exit(1);
    }

    const filtered = filterArticles(articles);
    const classified = await classifyArticles(filtered);

    console.log(`[run] ${classified.length} articles classes`);

    const topics = await identifyTopics(classified);
    console.log(`[run] ${topics.length} sujets identifies`);

    let generated = 0;

    for (const topic of topics) {
      const existing = path.join(CONTENT_DIR, `${date}-${slugify(topic.topic)}.mdx`);
      if (fs.existsSync(existing)) {
        console.log(`[run] Article deja existant pour "${topic.topic}", skip`);
        continue;
      }

      const result = await generateArticle(topic, classified, date, runId);
      if (result) {
        const filePath = path.join(CONTENT_DIR, `${result.slug}.mdx`);
        fs.writeFileSync(filePath, result.mdx, "utf-8");
        console.log(`[run] Genere : ${result.slug}`);
        generated++;
      }
    }

    console.log(`\n[run] ${generated} articles generes sur ${topics.length} sujets\n`);
  } catch (err) {
    console.error(`[run] Echec : ${err}`);
    process.exit(1);
  }
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

main();
