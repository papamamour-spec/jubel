import { NextRequest, NextResponse } from "next/server";
import { dbEnabled, query } from "@/lib/db";
import { empreinte, isBot } from "@/lib/empreinte";
import { moderer } from "@/lib/moderation";

export const dynamic = "force-dynamic";

const DAILY_MAX = 2;

export async function POST(req: NextRequest) {
  if (!dbEnabled()) return NextResponse.json({ error: "Les contributions sont indisponibles." }, { status: 503 });
  if (isBot(req.headers.get("user-agent"))) return NextResponse.json({ error: "refusé" }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "requête invalide" }, { status: 400 });
  }

  const nom = String(body.nom ?? "").trim().replace(/\s+/g, " ");
  const email = String(body.email ?? "").trim().toLowerCase();
  const titre = String(body.titre ?? "").trim().replace(/\s+/g, " ");
  const texte = String(body.texte ?? "").trim();
  const honeypot = String(body.site ?? "");

  if (honeypot) return NextResponse.json({ ok: true });
  if (nom.length < 2 || nom.length > 60) {
    return NextResponse.json({ error: "Le nom ou pseudonyme doit faire entre 2 et 60 caractères." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return NextResponse.json({ error: "Une adresse électronique valide est nécessaire pour vous répondre." }, { status: 400 });
  }
  if (titre.length < 5 || titre.length > 140) {
    return NextResponse.json({ error: "Le titre doit faire entre 5 et 140 caractères." }, { status: 400 });
  }
  if (texte.length < 400 || texte.length > 15000) {
    return NextResponse.json({ error: "Le texte doit faire entre 400 et 15 000 caractères." }, { status: 400 });
  }

  const hash = empreinte(req.headers);

  try {
    const [recent] = await query<{ n: string }>(
      `SELECT COUNT(*)::text AS n FROM contributions WHERE empreinte = $1 AND cree_le > now() - interval '1 day'`,
      [hash]
    );
    if (Number(recent?.n ?? 0) >= DAILY_MAX) {
      return NextResponse.json({ error: "Vous avez déjà envoyé deux contributions aujourd'hui." }, { status: 429 });
    }

    const screening = await moderer({ type: "contribution", texte, pseudo: nom, titre });
    const statut = screening.verdict === "rejete" ? "rejetee" : "recue";

    const [row] = await query<{ id: number }>(
      `INSERT INTO contributions (nom, email, titre, texte, statut, motif, empreinte)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [nom, email, titre, texte, statut, screening.motif, hash]
    );

    return NextResponse.json({ ok: true, id: row.id, statut });
  } catch (err) {
    console.error(`[contributions] ${err}`);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez plus tard." }, { status: 500 });
  }
}
