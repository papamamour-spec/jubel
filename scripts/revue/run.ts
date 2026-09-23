import crypto from "crypto";
import fs from "fs";
import path from "path";
import { collectArticles } from "./collect";
import { filterArticles } from "./filter";
import { classifyArticles } from "./classify";
import { synthesize } from "./synthesize";
import { persistEdition } from "./persist";
import { notifyAdmin } from "./notify";
import { MIN_SOURCES_TO_PUBLISH } from "../../src/lib/revue-du-jour/feeds";

async function main() {
  const runId = crypto.randomUUID();
  const date = new Date().toISOString().slice(0, 10);

  console.log(`\n=== Revue du Jour, ${date}, run ${runId} ===\n`);

  const existingFile = path.join(process.cwd(), "content", "revue-du-jour", `${date}.mdx`);
  if (fs.existsSync(existingFile)) {
    console.log(`[run] L'édition du ${date} existe déjà. Rien à faire.`);
    return;
  }

  try {
    const { articles, successCount, totalSources, failedSources } =
      await collectArticles();

    if (successCount < MIN_SOURCES_TO_PUBLISH) {
      const msg = `Seulement ${successCount}/${totalSources} sources disponibles (minimum : ${MIN_SOURCES_TO_PUBLISH}). En échec : ${failedSources.join(", ")}. Publication annulée.`;
      console.error(`[run] ${msg}`);
      await notifyAdmin(date, false, msg);
      process.exit(1);
    }

    const filtered = filterArticles(articles);
    const classified = await classifyArticles(filtered);
    const mdx = await synthesize(classified, date, runId, successCount);
    const filePath = persistEdition(date, mdx);

    const summary = [
      `Revue du ${date} générée avec succès.`,
      `Sources : ${successCount}/${totalSources}`,
      `Articles collectés : ${articles.length}`,
      `Articles après filtrage : ${filtered.length}`,
      `Articles classifiés : ${classified.length}`,
      `Fichier : ${filePath}`,
      `Run : ${runId}`,
      failedSources.length ? `Sources en échec : ${failedSources.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    console.log(`\n${summary}\n`);
    await notifyAdmin(date, true, summary);
  } catch (err) {
    const msg = `Échec de la génération de la revue du ${date} :\n${err}`;
    console.error(`[run] ${msg}`);
    await notifyAdmin(date, false, msg);
    process.exit(1);
  }
}

main();
