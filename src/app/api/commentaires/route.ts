import { NextRequest, NextResponse } from "next/server";
import { dbEnabled, query } from "@/lib/db";
import { empreinte, isBot } from "@/lib/empreinte";
import { moderer } from "@/lib/moderation";

export const dynamic = "force-dynamic";

const SLUG = /^[a-z0-9-]{3,120}$/;
const RATE_WINDOW_MIN = 10;
const RATE_MAX = 3;

export interface PublicComment {
  id: number;
  pseudo: string;
  texte: string;
  cree_le: string;
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!SLUG.test(slug)) return NextResponse.json({ error: "slug invalide" }, { status: 400 });
  if (!dbEnabled()) return NextResponse.json({ disponible: false, commentaires: [] }, { status: 503 });
  try {
    const rows = await query<PublicComment>(
      `SELECT id, pseudo, texte, cree_le FROM commentaires
       WHERE slug = $1 AND statut = 'publie'
       ORDER BY cree_le ASC LIMIT 200`,
      [slug]
    );
    return NextResponse.json({ disponible: true, commentaires: rows }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(`[commentaires] ${err}`);
    return NextResponse.json({ disponible: false, commentaires: [] }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!dbEnabled()) return NextResponse.json({ error: "Les commentaires sont indisponibles." }, { status: 503 });
  if (isBot(req.headers.get("user-agent"))) return NextResponse.json({ error: "refusé" }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "requête invalide" }, { status: 400 });
  }

  const slug = String(body.slug ?? "");
  const pseudo = String(body.pseudo ?? "").trim().replace(/\s+/g, " ");
  const email = String(body.email ?? "").trim().toLowerCase();
  const texte = String(body.texte ?? "").trim();
  const honeypot = String(body.site ?? "");

  if (honeypot) return NextResponse.json({ ok: true, statut: "publie" });
  if (!SLUG.test(slug)) return NextResponse.json({ error: "slug invalide" }, { status: 400 });
  if (pseudo.length < 2 || pseudo.length > 40) {
    return NextResponse.json({ error: "Le pseudonyme doit faire entre 2 et 40 caractères." }, { status: 400 });
  }
  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return NextResponse.json({ error: "Adresse électronique invalide." }, { status: 400 });
  }
  if (texte.length < 10 || texte.length > 2000) {
    return NextResponse.json({ error: "Le commentaire doit faire entre 10 et 2000 caractères." }, { status: 400 });
  }

  const hash = empreinte(req.headers);

  try {
    const [recent] = await query<{ n: string }>(
      `SELECT COUNT(*)::text AS n FROM commentaires
       WHERE empreinte = $1 AND cree_le > now() - ($2 || ' minutes')::interval`,
      [hash, String(RATE_WINDOW_MIN)]
    );
    if (Number(recent?.n ?? 0) >= RATE_MAX) {
      return NextResponse.json({ error: "Trop de commentaires en peu de temps. Réessayez dans quelques minutes." }, { status: 429 });
    }

    const verdict = await moderer({ type: "commentaire", texte, pseudo });

    const [row] = await query<{ id: number }>(
      `INSERT INTO commentaires (slug, pseudo, email, texte, statut, motif, empreinte)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [slug, pseudo, email || null, texte, verdict.verdict, verdict.motif, hash]
    );

    return NextResponse.json({ ok: true, id: row.id, statut: verdict.verdict });
  } catch (err) {
    console.error(`[commentaires] ${err}`);
    return NextResponse.json({ error: "Une erreur est survenue. Réessayez plus tard." }, { status: 500 });
  }
}
