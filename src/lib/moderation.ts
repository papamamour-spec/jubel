import fs from "fs";
import path from "path";

export type Verdict = "publie" | "en_attente" | "rejete";

export interface Moderation {
  verdict: Verdict;
  motif: string;
}

let promptCache: string | null = null;
function prompt(): string {
  if (!promptCache) {
    promptCache = fs.readFileSync(path.join(process.cwd(), "prompts", "moderation.md"), "utf-8");
  }
  return promptCache;
}

const LINK_LIMIT = 2;

function preScreen(texte: string): Moderation | null {
  const links = (texte.match(/https?:\/\//gi) ?? []).length;
  if (links > LINK_LIMIT) return { verdict: "rejete", motif: "trop de liens" };
  if (/(.)\1{15,}/.test(texte)) return { verdict: "rejete", motif: "contenu répétitif" };
  if (/\b(\+?221|00221)?\s?7[05678]\s?\d{3}\s?\d{2}\s?\d{2}\b/.test(texte)) {
    return { verdict: "en_attente", motif: "numéro de téléphone détecté" };
  }
  return null;
}

export async function moderer(input: {
  type: "commentaire" | "contribution";
  texte: string;
  pseudo?: string;
  titre?: string;
}): Promise<Moderation> {
  const early = preScreen(input.texte);
  if (early) return early;

  if (!process.env.ANTHROPIC_API_KEY) {
    return { verdict: "en_attente", motif: "modération manuelle (IA non configurée)" };
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ timeout: 20000, maxRetries: 1 });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: prompt(),
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            type: input.type,
            pseudo: input.pseudo ?? null,
            titre: input.titre ?? null,
            texte: input.texte,
          }),
        },
      ],
    });
    const block = response.content.find((b) => b.type === "text");
    const text = block && block.type === "text" ? block.text : "";
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : text) as Partial<Moderation>;
    if (parsed.verdict === "publie" || parsed.verdict === "en_attente" || parsed.verdict === "rejete") {
      return { verdict: parsed.verdict, motif: String(parsed.motif ?? "").slice(0, 200) };
    }
  } catch (err) {
    console.error(`[moderation] ${err}`);
  }
  return { verdict: "en_attente", motif: "modération automatique indisponible" };
}
