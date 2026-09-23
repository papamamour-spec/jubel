import crypto from "crypto";
import fs from "fs";
import path from "path";
import { collectArticles } from "../revue/collect";
import { filterArticles } from "../revue/filter";
import { classifyArticles } from "../revue/classify";
import { identifyTopics } from "./topics";
import { generateArticle } from "./generate";
import { MIN_SOURCES_TO_PUBLISH } from "../../src/lib/revue-du-jour/feeds";
import { appendManifest, overlapRatio, readManifest } from "../lib/manifest";

const CONTENT_DIR = path.join(process.cwd(), "content", "actualite");
const MAX_OVERLAP = 0.5;

async function main() {
  const runId = crypto.randomUUID();
  const date = new Date().toISOString().slice(0, 10);

  console.log(`\n=== Actualité Jubël, ${date}, run ${runId} ===\n`);
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  const { articles, successCount, totalSources, failedSources } =
    await collectArticles();

  if (successCount < MIN_SOURCES_TO_PUBLISH) {
    console.error(
      `[run] ${successCount}/${totalSources} sources seulement. En échec : ${failedSources.join(", ")}`
    );
    process.exit(1);
  }

  const filtered = filterArticles(articles);
  const classified = await classifyArticles(filtered);
  console.log(`[run] ${classified.length} articles classés`);

  const manifest = readManifest(CONTENT_DIR, date);
  const topics = await identifyTopics(
    classified,
    manifest.map((m) => m.title),
    date
  );
  console.log(`[run] ${topics.length} sujets proposés, ${manifest.length} déjà traités aujourd'hui`);

  if (topics.length === 0) {
    console.error("[run] Aucun sujet exploitable");
    process.exit(1);
  }

  let generated = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const topic of topics) {
    const duplicate = manifest.find(
      (m) => overlapRatio(m.articleIds, topic.articleIds) >= MAX_OVERLAP
    );
    if (duplicate) {
      console.log(`[run] "${topic.topic}" recoupe "${duplicate.title}", ignoré`);
      skipped++;
      continue;
    }

    try {
      const result = await generateArticle(topic, classified, date, runId);
      const filePath = path.join(CONTENT_DIR, `${result.slug}.mdx`);
      if (fs.existsSync(filePath)) {
        console.log(`[run] ${result.slug} existe déjà, ignoré`);
        skipped++;
        continue;
      }
      fs.writeFileSync(filePath, result.mdx, "utf-8");
      appendManifest(CONTENT_DIR, date, {
        slug: result.slug,
        title: result.title,
        articleIds: topic.articleIds,
        generatedAt: new Date().toISOString(),
      });
      manifest.push({ slug: result.slug, title: result.title, articleIds: topic.articleIds, generatedAt: "" });
      console.log(`[run] Généré : ${result.slug} (dessin : ${result.cartoon})`);
      generated++;
    } catch (err) {
      console.error(`[run] Échec pour "${topic.topic}" : ${err}`);
      failures.push(topic.topic);
    }
  }

  console.log(
    `\n[run] ${generated} générés, ${skipped} ignorés, ${failures.length} échecs sur ${topics.length} sujets\n`
  );

  if (generated === 0 && failures.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`[run] Erreur fatale : ${err}`);
  process.exit(1);
});
