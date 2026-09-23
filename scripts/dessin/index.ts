import fs from "fs";
import path from "path";
import { z } from "zod";
import { createClient, extractText, MODELS } from "../lib/anthropic";
import { fallbackSvg, generateImage, hasImageProvider, saveIllustration } from "../lib/images";
import { formatDateLong } from "../../src/lib/dates";

const read = (name: string) =>
  fs.readFileSync(path.join(process.cwd(), "prompts", name), "utf-8");

const CONCEPT_PROMPT = read("dessin.concept.md");
const CONFORMITE_PROMPT = read("dessin.conformite.md");
const VERIFICATION_PROMPT = read("dessin.verification.md");

const briefSchema = z.object({
  idee: z.string().min(10),
  scene: z.string().min(40).max(900),
  legende: z.string().min(8).max(200),
  alt: z.string().min(15).max(300),
  cible: z.string().min(3),
});
type Brief = z.infer<typeof briefSchema>;

const reviewSchema = z.object({
  verdict: z.enum(["approuve", "corrige", "rejete"]),
  motifs: z.array(z.string()).default([]),
  brief: briefSchema.partial().optional(),
});

const verificationSchema = z.object({
  verdict: z.enum(["approuve", "rejete"]),
  motifs: z.array(z.string()).default([]),
});

export interface CartoonInput {
  slug: string;
  date: string;
  title: string;
  chapeau: string;
  category: string;
  body: string;
}

export interface CartoonResult {
  illustration: string;
  illustrationAlt: string;
  legende: string;
  status: "image" | "repli";
  motifs: string[];
}

const FORBIDDEN_IN_TEXT = [
  /\b(président|premier ministre|ministre|député|maire)\s+[A-ZÉ][a-zé]+/,
  /\b(imam|khalife|marabout|serigne|cheikh|pape|évêque|mosquée|église)\b/i,
  /\b(wolof|sérère|peul|diola|toucouleur|mandingue|soninké)\b/i,
];

function extractJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```[a-z]*\s*|\s*```$/g, "");
  const match = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : cleaned);
}

function localGuard(brief: Brief): string[] {
  const problems: string[] = [];
  const haystack = `${brief.scene} ${brief.legende} ${brief.idee}`;
  for (const re of FORBIDDEN_IN_TEXT) {
    if (re.test(haystack)) problems.push(`motif interdit : ${re.source}`);
  }
  if (/[—–]/.test(brief.legende)) problems.push("tiret cadratin dans la légende");
  return problems;
}

async function conceive(input: CartoonInput): Promise<Brief> {
  const client = createClient(60000);
  const prompt = CONCEPT_PROMPT.replaceAll("{{DATE_LONGUE}}", formatDateLong(input.date));
  const response = await client.messages.create({
    model: MODELS.editorial,
    max_tokens: 1024,
    system: prompt,
    messages: [
      {
        role: "user",
        content: JSON.stringify({
          titre: input.title,
          chapeau: input.chapeau,
          rubrique: input.category,
          corps: input.body.slice(0, 3000),
        }),
      },
    ],
  });
  return briefSchema.parse(extractJson(extractText(response)));
}

async function review(brief: Brief): Promise<{ ok: boolean; brief: Brief; motifs: string[] }> {
  const client = createClient(60000);
  const response = await client.messages.create({
    model: MODELS.editorial,
    max_tokens: 1024,
    system: CONFORMITE_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(brief) }],
  });
  const result = reviewSchema.parse(extractJson(extractText(response)));
  if (result.verdict === "rejete") return { ok: false, brief, motifs: result.motifs };
  if (result.verdict === "corrige") {
    const merged = briefSchema.safeParse({ ...brief, ...result.brief });
    if (!merged.success) return { ok: false, brief, motifs: ["correction invalide"] };
    return { ok: true, brief: merged.data, motifs: result.motifs };
  }
  return { ok: true, brief, motifs: [] };
}

async function verifyImage(
  image: { buffer: Buffer; mediaType: "image/webp" | "image/png" },
  brief: Brief
): Promise<{ ok: boolean; motifs: string[] }> {
  const client = createClient(60000);
  const response = await client.messages.create({
    model: MODELS.editorial,
    max_tokens: 512,
    system: VERIFICATION_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: image.mediaType,
              data: image.buffer.toString("base64"),
            },
          },
          { type: "text", text: `Brief : ${JSON.stringify(brief)}` },
        ],
      },
    ],
  });
  const result = verificationSchema.parse(extractJson(extractText(response)));
  return { ok: result.verdict === "approuve", motifs: result.motifs };
}

export async function createCartoon(input: CartoonInput): Promise<CartoonResult> {
  const motifs: string[] = [];
  let brief: Brief | null = null;

  for (let attempt = 0; attempt < 2 && !brief; attempt++) {
    try {
      const candidate = await conceive(input);
      const guard = localGuard(candidate);
      if (guard.length) {
        motifs.push(...guard);
        continue;
      }
      const verdict = await review(candidate);
      motifs.push(...verdict.motifs);
      if (verdict.ok && localGuard(verdict.brief).length === 0) {
        brief = verdict.brief;
      }
    } catch (err) {
      motifs.push(`conception : ${err}`);
    }
  }

  if (!brief) {
    throw new Error(`Aucun brief conforme : ${motifs.join(" | ")}`);
  }

  if (hasImageProvider()) {
    try {
      const image = await generateImage(brief.scene);
      const check = await verifyImage(image, brief);
      if (check.ok) {
        const illustration = saveIllustration(input.slug, image);
        return { illustration, illustrationAlt: brief.alt, legende: brief.legende, status: "image", motifs };
      }
      motifs.push(...check.motifs.map((m) => `image rejetée : ${m}`));
    } catch (err) {
      motifs.push(`image : ${err}`);
    }
  } else {
    motifs.push("aucun fournisseur d'image configuré");
  }

  const illustration = saveIllustration(input.slug, { svg: fallbackSvg(brief.legende) });
  return {
    illustration,
    illustrationAlt: `Dessin de repli : ${brief.legende}`,
    legende: brief.legende,
    status: "repli",
    motifs,
  };
}
